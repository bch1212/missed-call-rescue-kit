# Missed-Call Rescue Kit

A same-day concierge setup for phone-driven local businesses that lose leads when staff are busy, on a job, or after hours.

## Revenue offer

**$249 one-time setup**: voicemail rewrite, missed-call auto-reply copy, 6 follow-up SMS/email templates, intake form questions, callback triage script, and a simple lead tracker.

**$499 concierge version**: everything above plus 10 custom responses for common inquiries, a branded Google Form/Sheet structure, and a 7-day callback SOP.

No guarantee of booked jobs, conversion lift, phone-system compatibility, or platform setup. This is administrative sales-ops copy and workflow material. Implementation in Twilio/Zapier/Google Voice/CRM is optional and quoted only after fit.

## Buyer

Owner-operated service businesses: car washes, salons, landscapers, cleaners, photographers, caterers, detailers, repair shops, and event venues.

## Trigger moment

They miss calls during jobs, evenings, lunch rush, or weekends and currently rely on generic voicemail, memory, or delayed manual callbacks.

## Files

- `bin/generate_rescue_plan.js` - creates a custom kit from a short intake JSON.
- `samples/sample-input.json` - sample business intake.
- `reports/sample-rescue-plan.md` - generated sample output.
- `templates/` - reusable voicemail, SMS, email, callback, and tracker templates.
- `sales/offer.md` - paid offer and guarantee boundaries.
- `gtm/outreach-drafts.md` - email drafts and positioning.
- `index.html` - static landing page for GitHub Pages.
- `data/prospects.csv/json` - ranked prospect list from public sources.

## Verify locally

```bash
node bin/generate_rescue_plan.js samples/sample-input.json reports/sample-rescue-plan.md
shasum -a 256 missed-call-rescue-kit.zip
```

## Fastest first-dollar path

Prospect replies `CALLS` with their current website/phone workflow. Send a one-page preview (voicemail + first auto-reply) and ask whether they want the $249 setup delivered within 48 hours. Use manual invoice/checkout after intent.
