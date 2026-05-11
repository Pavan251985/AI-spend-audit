# Prompts

## AI Summary Prompt

Used in `src/lib/gemini.ts` to generate a personalized audit summary.

### Final Prompt

### Why I wrote it this way

- Giving the model a clear role ("financial advisor") produces more confident, professional output
- Including specific numbers forces the model to reference real data instead of being generic
- Explicitly saying "do not use bullet points" keeps the output as a readable paragraph
- Keeping it to 100 words ensures it fits cleanly in the UI without overflow

### What I tried that didn't work

- **No role prompt** — Output was too generic and didn't reference the actual numbers
- **Asking for markdown formatting** — Produced bullet points that looked messy in the UI
- **Asking for 200+ words** — Too long for the results page, overwhelming for users

### Fallback

If the Gemini API fails, the app falls back to a templated summary:
This ensures the app never breaks even if the AI API is down.