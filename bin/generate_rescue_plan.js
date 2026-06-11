const fs = require('fs');
const path = require('path');

const [,, inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error('Usage: node bin/generate_rescue_plan.js samples/sample-input.json reports/output.md');
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const services = (data.topServices || []).map(s => `- ${s}`).join('\n');
const firstName = data.ownerName || 'Owner';
const biz = data.businessName || 'Your Business';
const category = data.category || 'local service business';
const booking = data.bookingLink || '{{booking_link}}';
const phone = data.primaryPhone || '{{phone}}';
const tone = data.tone || 'friendly and professional';
const moment = data.missedCallMoment || 'when the team is busy with customers';

const doc = `# Missed-Call Rescue Plan — ${biz}

Prepared for: ${firstName} / ${category}  
Primary phone: ${phone}  
Tone: ${tone}

## 1. Lead-loss diagnosis

The risky moment is **${moment}**. A prospect who calls right then is usually high intent. If they only hear a generic voicemail, they may call the next provider before you can respond.

## 2. Replacement voicemail

“Hi, you’ve reached ${biz}. We’re likely helping another customer right now, but we do call back quickly. Please leave your name, the service you need, your preferred day, and the best number to text. If you want the fastest response, text this same number with a photo or short note and we’ll reply with next steps. Thanks — we appreciate the chance to help.”

## 3. Missed-call text auto-reply

“Thanks for calling ${biz} — sorry we missed you. We’re probably ${moment}. What can we help with today? If useful, send: 1) service needed, 2) preferred timing, 3) your neighborhood, and 4) any photos/details. You can also book/request a slot here: ${booking}”

## 4. Two-minute callback script

1. “Thanks for calling ${biz}; did I catch you at an okay time?”
2. “What are you hoping to get handled?”
3. “What timing are you aiming for?”
4. “Where is the job located?”
5. “Any photos, dimensions, or details I should look at before quoting?”
6. “Great — next step is ____. I’ll text/email that now so it’s easy to find.”

## 5. Qualification questions

${services || '- Primary service needed\n- Timeline\n- Location\n- Budget/priority\n- Photos/details'}

## 6. Follow-up templates

### Same-day no-answer text
“Hi {{first_name}}, this is ${firstName} from ${biz}. I’m returning your call about {{service}}. Want to send me a quick note/photo here, or should I try you again later today?”

### Quote-ready text
“Thanks — based on that, the next step is {{next_step}}. I can {{availability}}. Does that work?”

### 24-hour gentle follow-up
“Hi {{first_name}}, just checking whether you still need help with {{service}}. No pressure either way — if timing changed, reply STOP/close and I won’t keep following up.”

## 7. Simple lead tracker columns

Date | Name | Phone | Service | Source | Urgency | Next step | Owner | Follow-up date | Status | Notes

## 8. Setup checklist

- Record the voicemail above.
- Add missed-call text in phone/CRM tool if available.
- Save the callback script near the phone.
- Use the lead tracker for every missed call for 7 days.
- Review status column daily: New, Contacted, Quoted, Booked, Lost, Not fit.

## 9. Boundaries

This kit improves speed and consistency of follow-up. It does not guarantee bookings, revenue, platform compatibility, or response rates.
`;
fs.mkdirSync(path.dirname(outputPath), {recursive:true});
fs.writeFileSync(outputPath, doc);
console.log(`wrote ${outputPath}`);
