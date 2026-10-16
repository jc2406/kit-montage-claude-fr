#!/usr/bin/env python3
"""
Extrait, image par image, les données de visualisation audio d'un fichier audio ou vidéo.

Produit un JSON avec l'amplitude RMS et les bandes de fréquence au FPS voulu,
prêt à intégrer dans une composition HyperFrames.

Utilisation :
    python extract-audio-data.py input.mp3 -o audio-data.json
    python extract-audio-data.py input.mp4 --fps 30 --bands 16 -o audio-data.json

Prérequis :
    - Python 3.9+
    - ffmpeg (pour décoder l'audio)
    - numpy (pip install numpy)
"""

import argparse
import json
import subprocess
import sys

import numpy as np

# ---------------------------------------------------------------------------
# Paramètres de la FFT
#
# Une fenêtre de 4096 échantillons donne ~10,8 Hz par case à 44100 Hz — assez pour
# séparer proprement les bandes graves. La tranche audio d'une image (44100/30 = 1470
# échantillons à 30 i/s) est trop petite : les bandes graves tomberaient dans les mêmes cases.
#
# La plage 30 Hz–16 kHz couvre l'utile pour la musique. Sous 30 Hz, ce sont des
# infra-basses que la plupart des enceintes ne reproduisent pas ; au-dessus de 16 kHz,
# du bruit/des harmoniques qui ne comptent pas dans le rythme ou la mélodie perçus.
# ---------------------------------------------------------------------------

SAMPLE_RATE = 44100
FFT_SIZE = 4096
MIN_FREQ = 30.0
MAX_FREQ = 16000.0


def decode_audio(path: str) -> np.ndarray:
    """Décode l'audio en échantillons mono float32 via ffmpeg."""
    cmd = [
        "ffmpeg", "-i", path,
        "-vn", "-ac", "1", "-ar", str(SAMPLE_RATE),
        "-f", "s16le", "-acodec", "pcm_s16le",
        "-loglevel", "error",
        "pipe:1",
    ]
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        print(f"erreur ffmpeg : {result.stderr.decode()}", file=sys.stderr)
        sys.exit(1)
    return np.frombuffer(result.stdout, dtype=np.int16).astype(np.float32) / 32768.0


def compute_band_edges(n_bands: int) -> np.ndarray:
    """Bornes de bandes de fréquence espacées logarithmiquement de MIN_FREQ à MAX_FREQ."""
    return np.array([
        MIN_FREQ * (MAX_FREQ / MIN_FREQ) ** (i / n_bands)
        for i in range(n_bands + 1)
    ])


def compute_fft_bands(
    windowed: np.ndarray, freq_per_bin: float, n_bins: int,
    band_edges: np.ndarray, n_bands: int,
) -> np.ndarray:
    """Calcule l'amplitude maximale dans des bandes de fréquence espacées logarithmiquement."""
    magnitudes = np.abs(np.fft.rfft(windowed))

    bands = np.zeros(n_bands)
    for b in range(n_bands):
        low_bin = max(0, int(band_edges[b] / freq_per_bin))
        high_bin = min(n_bins, int(band_edges[b + 1] / freq_per_bin))
        if high_bin <= low_bin:
            high_bin = low_bin + 1
        # Borner à une plage valide pour éviter les tranches vides
        low_bin = min(low_bin, n_bins - 1)
        high_bin = min(high_bin, n_bins)
        bands[b] = np.max(magnitudes[low_bin:high_bin])

    return bands


def extract(path: str, fps: int, n_bands: int) -> dict:
    """Extrait les données audio image par image."""
    print(f"Décodage de l'audio de {path}...", file=sys.stderr)
    samples = decode_audio(path)
    duration = len(samples) / SAMPLE_RATE
    frame_step = SAMPLE_RATE // fps
    total_frames = int(duration * fps)

    print(f"Durée : {duration:.1f} s, {total_frames} images à {fps} i/s", file=sys.stderr)
    print(f"Fenêtre FFT : {FFT_SIZE} échantillons ({SAMPLE_RATE / FFT_SIZE:.1f} Hz/case)", file=sys.stderr)
    print(f"Plage de fréquences : {MIN_FREQ:.0f}-{MAX_FREQ:.0f} Hz, {n_bands} bandes", file=sys.stderr)

    # Précalculer les constantes
    hann = np.hanning(FFT_SIZE)
    band_edges = compute_band_edges(n_bands)
    freq_per_bin = SAMPLE_RATE / FFT_SIZE
    n_bins = FFT_SIZE // 2 + 1
    half_fft = FFT_SIZE // 2

    # Passe 1 : extraire les valeurs brutes
    rms_values = np.zeros(total_frames)
    band_values = np.zeros((total_frames, n_bands))

    for f in range(total_frames):
        # RMS sur la tranche audio de l'image
        rms_start = f * frame_step
        rms_end = rms_start + frame_step
        frame_slice = samples[rms_start:min(rms_end, len(samples))]
        if len(frame_slice) > 0:
            rms_values[f] = np.sqrt(np.mean(frame_slice ** 2))

        # FFT sur une fenêtre centrée de 4096 échantillons
        center = rms_start + frame_step // 2
        win_start = center - half_fft
        win_end = center + half_fft

        if win_start >= 0 and win_end <= len(samples):
            window = samples[win_start:win_end] * hann
        else:
            # Compléter par des zéros aux bords
            padded = np.zeros(FFT_SIZE)
            src_start = max(0, win_start)
            src_end = min(len(samples), win_end)
            dst_start = src_start - win_start
            dst_end = dst_start + (src_end - src_start)
            padded[dst_start:dst_end] = samples[src_start:src_end]
            window = padded * hann

        band_values[f] = compute_fft_bands(window, freq_per_bin, n_bins, band_edges, n_bands)

    # Passe 2 : normaliser
    peak_rms = rms_values.max() if total_frames > 0 else 1.0
    if peak_rms > 0:
        rms_values /= peak_rms

    # Normalisation par bande pour que les aigus restent visibles à côté des graves plus forts
    band_peaks = band_values.max(axis=0)
    band_peaks[band_peaks == 0] = 1.0
    band_values /= band_peaks

    # Construire la sortie
    frames = []
    for f in range(total_frames):
        frames.append({
            "time": round(f / fps, 4),
            "rms": round(float(rms_values[f]), 4),
            "bands": [round(float(b), 4) for b in band_values[f]],
        })

    return {
        "duration": round(duration, 4),
        "fps": fps,
        "bands": n_bands,
        "totalFrames": total_frames,
        "frames": frames,
    }


def main():
    parser = argparse.ArgumentParser(description="Extrait les données de visualisation audio image par image")
    parser.add_argument("input", help="Fichier audio ou vidéo")
    parser.add_argument("-o", "--output", default="audio-data.json", help="Chemin du JSON de sortie")
    parser.add_argument("--fps", type=int, default=30, help="Images par seconde (défaut : 30)")
    parser.add_argument("--bands", type=int, default=16, help="Nombre de bandes de fréquence (défaut : 16)")
    args = parser.parse_args()

    if args.fps < 1:
        parser.error("--fps must be at least 1")
    if args.bands < 1:
        parser.error("--bands must be at least 1")

    data = extract(args.input, args.fps, args.bands)

    with open(args.output, "w") as f:
        json.dump(data, f)

    print(f"Écrit : {args.output} ({data['totalFrames']} images, {data['bands']} bandes)", file=sys.stderr)


if __name__ == "__main__":
    main()
