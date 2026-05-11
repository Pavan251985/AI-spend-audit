# Metrics

## North Star Metric

**Consultations booked per week**

This is the single metric that matters for Credex. The tool exists
to generate qualified leads. An audit completed but no consultation
booked is interesting but not valuable. A consultation booked means
a real person with real overspend talked to the Credex team — that
is the moment value is created for the business.

DAU would be wrong here — people use this tool once every few months
when they review budgets. Weekly consultations booked captures the
business outcome directly.

## 3 Input Metrics

1. **Audits completed per week**
   The top of the funnel. If this drops, everything downstream drops.
   Target: 100 audits/week by month 2.

2. **Email capture rate (emails / audits)**
   Measures how compelling the results page is. If people complete
   audits but don't share their email, the results aren't valuable
   enough or the CTA is weak.
   Target: 30% capture rate.

3. **Consultation rate (consultations / emails captured)**
   Measures how well the Credex offer resonates with high-savings users.
   If this is low, either the savings threshold is wrong or the CTA
   copy needs work.
   Target: 10% consultation rate.

## What to Instrument First

1. Audit completed event (with total savings amount)
2. Email captured event (with savings bucket: <$100, $100-500, >$500)
3. Consultation CTA clicked event
4. Share URL copied event (measures viral potential)

## Pivot Trigger

If after 500 audits completed the consultation rate is below 3%,
that is a signal to pivot. Either:
- The savings amounts are too low (wrong audience)
- The Credex offer is not compelling enough (pricing or messaging)
- Users do not trust the recommendations (audit engine quality)

At 3% consultation rate on 500 audits = 15 consultations.
If Credex cannot close 5 of those into purchases, the unit economics
do not work and the tool needs a fundamental rethink.