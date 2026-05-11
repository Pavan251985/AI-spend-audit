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
