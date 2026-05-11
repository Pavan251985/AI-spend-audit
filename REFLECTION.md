# Reflection

## 1. The hardest bug I hit this week

The hardest bug was the "Unterminated string constant" error in the audit results page. The file had over 270 lines of JSX and when I pasted it into VS Code, some lines got cut off mid-string — particularly the className attributes with long Tailwind class strings. The browser showed a build error pointing to line 117 but the actual problem was that the string had no closing quote.

My first hypothesis was that the JSX structure was wrong — mismatched opening and closing tags. I checked the div nesting carefully but that wasn't it. My second hypothesis was a missing bracket somewhere. I used Ctrl+G to jump to the exact line number and saw the className string ended abruptly without a closing quote or the closing `>` bracket.

What worked was downloading the file as a clean copy, selecting all content in the broken file, and replacing it entirely with the downloaded version. This avoided any copy-paste truncation issues. The lesson: for long files, always verify the last few lines after pasting.

## 2. A decision I reversed mid-week

I initially planned to use the Anthropic API for the AI summary feature since the assignment preferred it. I set up the account and integrated the SDK. But when I tried to get an API key, Anthropic required a paid account with a minimum deposit.

I reversed this decision and switched to the Gemini API which has a generous free tier. The switch was straightforward since both APIs follow a similar pattern — send a prompt, get a response. I updated the SDK, rewrote the client file, and the feature worked the same way. The lesson: always check pricing and access requirements before committing to a third-party service.

## 3. What I would build in week 2

In week 2 I would focus on three things. First, a PDF export of the full audit report so users can share it internally with their finance team. Second, a benchmark mode that shows how a user's AI spend per developer compares to companies of similar size — this would make the tool much more shareable on social media. Third, I would add a referral system where users get a discount on Credex credits for every person they refer who books a consultation. This creates a viral loop that directly benefits Credex's business model.

## 4. How I used AI tools

I used Claude as my primary coding assistant throughout the week. I used it for generating boilerplate code for components, writing the audit engine logic, setting up the Supabase schema, and creating the GitHub Actions workflow.

I did not trust Claude with the pricing data — I verified every number myself on the official vendor pricing pages because incorrect numbers would make the audit engine wrong and undermine the entire product.

One specific time Claude was wrong: it suggested using the Anthropic API with a model string that no longer existed. I caught this because the API returned a 404 error. I searched the Anthropic docs and found the correct current model string.

## 5. Self-rating

- **Discipline: 7/10** — I started on day one and committed code every day, but I could have planned the architecture better upfront to avoid debugging time.
- **Code quality: 7/10** — The code is readable and well-structured with TypeScript types throughout, but I would add more error handling and loading states in a production version.
- **Design sense: 8/10** — The UI looks clean and professional with a consistent dark theme and clear visual hierarchy. The results page is screenshot-worthy.
- **Problem-solving: 8/10** — I debugged issues systematically by forming hypotheses and testing them. I found workarounds quickly when blocked.
- **Entrepreneurial thinking: 7/10** — I understood the business model and built the Credex CTA into the right place. I would score higher if I had more time for the GTM and economics documents.