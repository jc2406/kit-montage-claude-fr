import fs from 'node:fs';import path from 'node:path';
export function validatePlan(plan,transcript,edl,exists=()=>true){
 const errors=[],fail=m=>errors.push(m),fps=plan.fps,tol=1/fps+.005;
 if(!Number.isFinite(fps)||fps<=0)fail('fps invalide');
 if(!plan.scenes?.length)fail('Aucune scène');
 const words=transcript.words.filter(w=>w.type!=='spacing');
 const caps=(plan.captions||[]).flatMap(g=>g.words);
 if(caps.length!==words.length)fail(`Nombre de mots des sous-titres ${caps.length} != nombre de mots conservés ${words.length}`);
 words.forEach((w,i)=>{
  const cap=caps[i];if(!cap||cap.text!==w.text)fail(`Sous-titre ${i} manquant ou différent`);
  else if(Math.abs(cap.start-w.start)>.005||Math.abs(cap.end-w.end)>.005)fail(`Le timing du sous-titre ${i} diffère de la transcription`);
  if(w.end<=w.start||w.start<0||w.end>plan.duration+tol)fail(`Mot ${i} hors de la timeline`);
  const k=edl.keeps.find(k=>w.sourceStart>=k.sourceStart-.016&&w.sourceEnd<=k.sourceEnd+.016);
  if(!k)fail(`Le mot ${i} traverse une coupe ou n'a pas de plage source`);
  else if(Math.abs(w.start-(k.start+w.sourceStart-k.sourceStart))>.006)fail(`Correspondance avec la source incorrecte pour le mot ${i}`);
 });
 let end=0;const ids=new Set();for(const s of plan.scenes||[]){
  if(ids.has(s.id))fail(`Scène en double ${s.id}`);ids.add(s.id);
  if(Math.abs(s.start-end)>.005)fail(`Trou ou chevauchement de scène à ${s.id}`);
  if(s.end<=s.start)fail(`La scène ${s.id} n'a pas de durée`);
  if(Math.abs(s.start*fps-Math.round(s.start*fps))>.01)fail(`La scène ${s.id} n'est pas calée sur une image`);
  if(!s.anchor||!Number.isFinite(s.anchorTime))fail(`La scène ${s.id} n'a pas d'ancre vérifiée`);
  else if(s.anchorTime-s.start<-.15||s.anchorTime-s.start>.2)fail(`L'ancre de la scène ${s.id} n'est pas proche de la coupe`);
  if(s.layout.includes('broll')&&!exists('assets/'+s.kind+'.mp4'))fail(`B-roll en mouvement manquant ${s.kind}`);
  end=s.end;
 }
 if(Math.abs(end-plan.duration)>.005)fail('La couverture des scènes diffère de la durée');
 const times=[0,...(plan.events||[]).map(e=>e.time),plan.duration].sort((a,b)=>a-b);let maxGap=0;
 for(let i=1;i<times.length;i++){const gap=times[i]-times[i-1];maxGap=Math.max(maxGap,gap);if(gap>2.2){const s=plan.scenes.find(s=>times[i-1]>=s.start&&times[i-1]<s.end);if(!s?.holdReason)fail(`Trou inexpliqué entre événements visuels de ${gap.toFixed(2)} s à ${times[i-1].toFixed(2)}`);}}
 for(const e of plan.events||[])if(!ids.has(e.visual)||e.time<0||e.time>=plan.duration)fail('Événement visuel invalide '+JSON.stringify(e));
 for(let i=0;i<(plan.captions||[]).length;i++){const g=plan.captions[i];if(g.start>g.words[0].start+.005||g.end<g.words.at(-1).end-.005)fail('Le groupe de sous-titres tronque le mot '+i);if(i&&g.start<plan.captions[i-1].end-.005)fail('Groupes de sous-titres qui se chevauchent '+i);}
 return {ok:!errors.length,errors,metrics:{duration:plan.duration,retainedWords:words.length,scenes:plan.scenes.length,averageShotSeconds:plan.duration/plan.scenes.length,visualEvents:plan.events.length,maxEventGap:maxGap,speakerShare:plan.scenes.filter(s=>['face','split','broll-split'].includes(s.layout)).reduce((a,s)=>a+s.end-s.start,0)/plan.duration}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===path.resolve(import.meta.filename)){
 const root=path.resolve(process.argv[2]||'.');const read=n=>JSON.parse(fs.readFileSync(path.join(root,'assets',n)));
 const result=validatePlan(read('plan.json'),read('transcript.json'),read('edit-decisions.json'),p=>fs.existsSync(path.join(root,p)));
 console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;
}
