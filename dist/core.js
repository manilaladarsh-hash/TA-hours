export const CATEGORIES = ['Teaching / supervision','Consultation / lectures','Grading / entering marks','Preparation / meetings','Invigilation','Other'];
export const PRESETS = {
 tutorial1: {name:'1D03 · Tutorial TA1',budgets:[12,25,17,5,6,0]},
 tutorial2: {name:'1D03 · Tutorial TA2 (L35)',budgets:[6,31,17,5,6,0]},
 lab1: {name:'1D03 · Lab TA1',budgets:[30,0,15,15,0,5]},
 lab2: {name:'1D03 · Lab TA2',budgets:[30,0,5,15,0,15]},
 lab3: {name:'1D03 · Lab TA3 (double)',budgets:[60,0,25,15,0,30]},
 lab4: {name:'1D03 · Lab TA4 (L35)',budgets:[45,20,20,15,0,30]},
 custom: {name:'New course · Lab',budgets:[0,0,0,0,0,0]}
};
export const uid = () => crypto.randomUUID();
export function fresh(){return {version:1,revision:0,assignments:['tutorial1','lab1'].map(k=>({id:uid(),name:PRESETS[k].name,term:'Fall 2026',preset:k,budgets:[...PRESETS[k].budgets]})),entries:[],timer:null};}
export function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function localStamp(d=new Date()){return `${localDate(d)}T${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}
export function validDate(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+'T12:00:00');return Number.isFinite(+d)&&localDate(d)===s;}
export function stampMinutes(s){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)||!validDate(s.slice(0,10)))throw Error('Enter a valid date and time.');const [h,m]=s.slice(11).split(':').map(Number);if(h>23||m>59)throw Error('Invalid time.');return Date.parse(s+'Z')/60000;}
export function duration(start,end,breakMinutes=0){const n=stampMinutes(end)-stampMinutes(start)-breakMinutes;if(!Number.isInteger(breakMinutes)||breakMinutes<0||n<=0||n>1440)throw Error('Work must be 1–1,440 minutes after breaks. Check the end date and time.');return n;}
export function fmt(minutes){const n=Math.round(minutes);return `${Math.floor(n/60)}h ${String(n%60).padStart(2,'0')}m`;}
export function hours(minutes){return (minutes/60).toFixed(2);}
export function total(entries){return entries.reduce((a,e)=>a+e.minutes,0);}
export function overlap(a,b){const range=e=>e.timerStartedAt!=null?[stampMinutes(localStamp(new Date(e.timerStartedAt))),stampMinutes(localStamp(new Date(e.timerStoppedAt)))]:e.start?[stampMinutes(e.start),stampMinutes(e.end)]:null;const ar=range(a),br=range(b);return !!(ar&&br&&ar[0]<br[1]&&br[0]<ar[1]);}
export function timerEntries(timer,stoppedAt){
 if(!Number.isFinite(stoppedAt)||stoppedAt<timer.startedAt)throw Error('Device clock moved backward. Correct the clock before stopping the timer.');
 const result=[];let at=timer.startedAt,remaining=Math.max(1,Math.round((stoppedAt-at)/60000));
 if(stoppedAt-at>31*86400000)throw Error('Timer exceeds 31 days. Discard it and enter the actual work manually.');
 while(at<stoppedAt||(!result.length&&remaining)){
 const d=new Date(at),boundary=new Date(d.getFullYear(),d.getMonth(),d.getDate()+1).getTime(),end=Math.min(boundary,stoppedAt);const minutes=end===stoppedAt?remaining:Math.min(remaining,Math.round((end-at)/60000));remaining-=minutes;
 if(minutes>0)result.push({id:uid(),assignment:timer.assignment,category:timer.category,activity:timer.activity,section:timer.section,date:localDate(d),minutes,start:null,end:null,breakMinutes:0,notes:`${timer.notes?timer.notes+'\n':''}Timer: ${new Date(at).toLocaleString()} to ${new Date(end).toLocaleString()}. Rounded to nearest minute (minimum 1 minute per session).`,timerStartedAt:at,timerStoppedAt:end,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
 if(end===stoppedAt)break;at=end;
 }return result;
}
const str=(s,max)=>typeof s==='string'&&s.length<=max;
export function validate(data){
 if(!data||data.version!==1||!Array.isArray(data.assignments)||!Array.isArray(data.entries)||data.assignments.length<1||data.assignments.length>500||data.entries.length>100000)throw Error('Not a supported TA Hours backup.');
 const ids=new Set();for(const a of data.assignments){if(!str(a.id,100)||!a.id||ids.has(a.id)||!str(a.name,100)||!a.name.trim()||!str(a.term,60)||!Array.isArray(a.budgets)||a.budgets.length!==6||a.budgets.some(x=>!Number.isFinite(x)||x<0||x>10000))throw Error('Invalid assignment in backup.');ids.add(a.id);}
 const eids=new Set();for(const e of data.entries){if(!str(e.id,100)||!e.id||eids.has(e.id)||!ids.has(e.assignment)||!validDate(e.date)||!Number.isInteger(e.category)||e.category<0||e.category>5||!Number.isInteger(e.minutes)||e.minutes<1||e.minutes>(e.timerStartedAt!=null?1500:1440)||!str(e.activity,160)||!str(e.notes,2000)||!str(e.section,80))throw Error('Invalid work entry in backup.');eids.add(e.id);if(e.timerStartedAt!=null&&(!Number.isFinite(e.timerStartedAt)||!Number.isFinite(e.timerStoppedAt)||e.timerStoppedAt<e.timerStartedAt))throw Error('Invalid timer timestamps.');if(e.start||e.end){if(e.date!==e.start?.slice(0,10)||duration(e.start,e.end,e.breakMinutes)!==e.minutes)throw Error('Inconsistent timed entry in backup.');}}
 if(data.timer!==null&&data.timer!==undefined){const t=data.timer;if(!ids.has(t.assignment)||!Number.isFinite(t.startedAt)||!Number.isInteger(t.category)||t.category<0||t.category>5||!str(t.activity,160)||!str(t.section,80))throw Error('Invalid timer in backup.');}
 return data;
}
export function csv(entries,assignments){const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';const rows=[['Date','Assignment','Term','Category','Activity','Section','Start','End','Break minutes','Worked minutes','Decimal hours','Notes'],...entries.map(e=>{const a=assignments.find(a=>a.id===e.assignment);return [e.date,a.name,a.term,CATEGORIES[e.category],e.activity,e.section,e.start||'',e.end||'',e.breakMinutes||0,e.minutes,hours(e.minutes),e.notes];})];return '\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n');}
