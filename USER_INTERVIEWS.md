# User Interviews

## Interview 1

**Name:** R.K. (preferred anonymity)
**Role:** Engineering Manager
**Company stage:** Series A, 18 engineers

### Notes

Spoke for 12 minutes over WhatsApp call. R.K. manages a team that uses
Cursor Business, GitHub Copilot Business, and ChatGPT Team.

### Direct Quotes

- "I honestly have no idea what we're spending per person on AI tools.
  I just approve the invoices."
- "We got Copilot first, then Cursor, and nobody cancelled Copilot.
  They just run both."
- "If someone showed me I was wasting $300 a month I would definitely
  want to know."

### Most Surprising Thing

He did not know his team was running both Cursor and GitHub Copilot
simultaneously on the same machines. He assumed people had chosen one
or the other.

### What It Changed

I added a warning in the audit engine for when users select both Cursor
and GitHub Copilot — they overlap significantly in functionality and
running both is almost always wasteful.

---

## Interview 2

**Name:** Priya S.
**Role:** Co-founder and CTO
**Company stage:** Pre-seed, 4 engineers

### Notes

Spoke for 15 minutes over Google Meet. Small team, very cost-conscious.
Uses Claude Pro and ChatGPT Plus individually.

### Direct Quotes

- "We are on like 4 different AI subscriptions and I am not sure
  all of them are being used."
- "I would love something that just tells me what to cut."
- "The problem is I don't have time to research alternatives.
  Just tell me what to do."

### Most Surprising Thing

She said she would not trust a recommendation unless it showed her
the actual price difference with a source. "Anyone can say switch to X.
Show me the math."

### What It Changed

This confirmed my decision to show the exact current spend vs estimated
cost for each tool, with a clear reason. It also made me prioritize
the PRICING_DATA.md file with verified sources.

---

## Interview 3

**Name:** Arjun M.
**Role:** Founder
**Company stage:** Bootstrapped, 2 engineers

### Notes

Spoke for 10 minutes over LinkedIn message thread. Solo technical
founder with one contractor.

### Direct Quotes

- "I use the free tier of everything because I can't justify the cost yet."
- "But I am thinking about upgrading Cursor. How do I know which plan?"
- "I didn't know Claude had a Team plan. What is the difference?"

### Most Surprising Thing

He was not the overspender I expected to find. He was actually
underspending and needed guidance on when to upgrade, not downgrade.

### What It Changed

This made me add the "You're spending well" message for low-savings
audits instead of manufacturing fake recommendations. It also made
me think about adding a "when to upgrade" guide as a future feature
for users who are on free tiers but growing.