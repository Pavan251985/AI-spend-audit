# Tests

## How to Run

```bash
npm test
```

## Test Files

### `src/__tests__/auditEngine.test.ts`

Covers the core audit engine logic.

| Test | What it covers |
|---|---|
| Cursor Business with 2 seats should recommend downgrade to Pro | Detects overkill plan for small team |
| Cursor Pro with writing use case should recommend Claude | Detects wrong tool for use case |
| GitHub Copilot Business with 1 seat should recommend Individual | Detects single user on team plan |
| Claude Max with 1 seat non-coding should recommend Pro | Detects overpaying for usage level |
| ChatGPT Team with 2 seats should recommend Plus | Detects cheaper individual plans |
| Gemini Ultra with coding use case should recommend Cursor | Detects wrong tool for coding |
| Optimal spend should return zero savings | Confirms no false positives |

## Setting Up Tests

Install Jest:

```bash
npm install --save-dev jest @types/jest ts-jest
```

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

## Test File

Create `src/__tests__/auditEngine.test.ts`:

```typescript
import { runAudit } from '@/lib/auditEngine';

describe('Audit Engine', () => {
  test('Cursor Business with 2 seats should recommend downgrade to Pro', () => {
    const result = runAudit({
      tools: [{ id: 'cursor', name: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }],
      teamSize: 2,
      useCase: 'coding',
    });
    expect(result[0].recommendedAction).toBe('Downgrade to Pro');
    expect(result[0].monthlySavings).toBeGreaterThan(0);
  });

  test('GitHub Copilot Business with 1 seat should recommend Individual', () => {
    const result = runAudit({
      tools: [{ id: 'github_copilot', name: 'github_copilot', plan: 'business', monthlySpend: 19, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    });
    expect(result[0].recommendedAction).toBe('Downgrade to Individual');
    expect(result[0].monthlySavings).toBeGreaterThan(0);
  });

  test('Claude Max with 1 seat non-coding should recommend Pro', () => {
    const result = runAudit({
      tools: [{ id: 'claude', name: 'claude', plan: 'max', monthlySpend: 100, seats: 1 }],
      teamSize: 1,
      useCase: 'writing',
    });
    expect(result[0].recommendedAction).toBe('Downgrade to Pro');
    expect(result[0].monthlySavings).toBeGreaterThan(0);
  });

  test('ChatGPT Team with 2 seats should recommend Plus', () => {
    const result = runAudit({
      tools: [{ id: 'chatgpt', name: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 }],
      teamSize: 2,
      useCase: 'mixed',
    });
    expect(result[0].recommendedAction).toBe('Switch to Plus (individual)');
    expect(result[0].monthlySavings).toBeGreaterThan(0);
  });

  test('Optimal plan should return zero savings', () => {
    const result = runAudit({
      tools: [{ id: 'cursor', name: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    });
    expect(result[0].monthlySavings).toBe(0);
  });
});
```