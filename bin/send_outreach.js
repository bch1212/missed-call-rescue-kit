const fs = require('fs');
const cp = require('child_process');

const prospects = JSON.parse(fs.readFileSync('data/prospects.json','utf8'));
const logPath = 'logs/outreach.jsonl';
fs.mkdirSync('logs', {recursive:true});
const sentLines = fs.existsSync(logPath) ? fs.readFileSync(logPath,'utf8').trim().split(/\n+/).filter(Boolean).map(l=>{try{return JSON.parse(l)}catch{return null}}).filter(Boolean) : [];
const already = new Set(sentLines.filter(r => r.status === 'sent').map(r => r.email));
const badEmail = e => !e || /jobs@|careers@|noreply|no-reply|blync\.io|goappr|brigantine|fogo\.com|you@email\.com|support@phlox\.com|contact@imenu4u\.com|example\.com|test@/i.test(e);
const selected = prospects
  .filter(p => !badEmail(p.email) && !already.has(p.email))
  .filter(p => !/college|autozone|valvoline|european wax|fogo/i.test(p.name))
  .slice(0, 10);

function firstName(p) { return `${p.name} team`; }
function category(p) { return (p.category || 'service business').replace('_',' '); }
function body(p) { return `Hi ${firstName(p)},

I’m testing a small $249 setup for ${category(p)} teams that miss calls while serving customers: a better voicemail, missed-call text, callback script, inquiry questions, and a simple lead tracker.

The goal is not more software - just making sure a high-intent caller does not disappear before someone can respond.

For ${p.name}, I’d start with a simple missed-call text like:

“Thanks for calling ${p.name} - sorry we missed you. What can we help with today? Send the service/event needed, preferred timing, location, and any useful details. We’ll reply with next steps.”

If useful, reply CALLS with your current phone/website and I’ll send a free one-page preview. The full 48-hour setup is $249; no pressure if it’s not relevant. Reply “not a fit” and I won’t follow up.

Best,
Brett
Missed-Call Rescue Kit: https://bch1212.github.io/missed-call-rescue-kit/`; }

for (const p of selected) {
  const subject = `quick missed-call setup for ${p.name}`;
  const rec = {ts:new Date().toISOString(), prospect:p.name, email:p.email, subject, status:'pending', source:p.source};
  try {
    const template = cp.execFileSync('himalaya', ['template','write','-a','gmail','-H',`To:${p.email}`,'-H',`Subject:${subject}`, body(p)], {encoding:'utf8'});
    const sent = cp.spawnSync('himalaya', ['template','send','-a','gmail'], {input: template, encoding:'utf8'});
    if (sent.status !== 0) throw Object.assign(new Error(sent.stderr || sent.stdout || `exit ${sent.status}`), {stdout: sent.stdout, stderr: sent.stderr});
    rec.status='sent'; rec.stdout=(sent.stdout || '').trim();
    console.log(`sent ${p.email}: ${rec.stdout}`);
  } catch (e) {
    rec.status='error'; rec.stdout=(e.stdout||'').toString(); rec.stderr=(e.stderr||e.message||'').toString();
    console.error(`error ${p.email}: ${rec.stderr}`);
  }
  fs.appendFileSync(logPath, JSON.stringify(rec)+'\n');
}
console.log(`attempted ${selected.length}`);
