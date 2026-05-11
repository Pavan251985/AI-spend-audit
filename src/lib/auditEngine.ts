import { AITool, AuditInput, AuditRecommendation } from '@/types';

const PRICING = {
  cursor: {
    hobby: { price: 0, seats: 1 },
    pro: { price: 20, seats: 1 },
    business: { price: 40, seats: 1 },
    enterprise: { price: 100, seats: 1 },
  },
  github_copilot: {
    individual: { price: 10, seats: 1 },
    business: { price: 19, seats: 1 },
    enterprise: { price: 39, seats: 1 },
  },
  claude: {
    free: { price: 0, seats: 1 },
    pro: { price: 20, seats: 1 },
    max: { price: 100, seats: 1 },
    team: { price: 30, seats: 1 },
    enterprise: { price: 60, seats: 1 },
  },
  chatgpt: {
    plus: { price: 20, seats: 1 },
    team: { price: 30, seats: 1 },
    enterprise: { price: 60, seats: 1 },
  },
  gemini: {
    pro: { price: 20, seats: 1 },
    ultra: { price: 30, seats: 1 },
  },
  windsurf: {
    free: { price: 0, seats: 1 },
    pro: { price: 15, seats: 1 },
    team: { price: 35, seats: 1 },
  },
};

export function runAudit(input: AuditInput): AuditRecommendation[] {
  const recommendations: AuditRecommendation[] = [];

  for (const tool of input.tools) {
    const rec = evaluateTool(tool, input);
    if (rec) recommendations.push(rec);
  }

  return recommendations;
}

function evaluateTool(tool: AITool, input: AuditInput): AuditRecommendation {
  const { teamSize, useCase } = input;
  let recommendedAction = 'Keep current plan';
  let recommendedPlan = tool.plan;
  let estimatedCost = tool.monthlySpend;
  let reason = 'Your current plan is optimal for your usage.';
  let priority: 'high' | 'medium' | 'low' = 'low';

  // Cursor checks
  if (tool.name === 'cursor') {
    if (tool.plan === 'business' && tool.seats <= 2) {
      recommendedAction = 'Downgrade to Pro';
      recommendedPlan = 'pro';
      estimatedCost = 20 * tool.seats;
      reason = 'Business plan is overkill for teams of 2 or fewer. Pro has the same core features.';
      priority = 'high';
    } else if (tool.plan === 'enterprise' && tool.seats < 10) {
      recommendedAction = 'Downgrade to Business';
      recommendedPlan = 'business';
      estimatedCost = 40 * tool.seats;
      reason = 'Enterprise is designed for 10+ seat teams with compliance needs.';
      priority = 'high';
    } else if (useCase === 'writing' || useCase === 'research') {
      recommendedAction = 'Switch to Claude Pro';
      recommendedPlan = 'pro';
      estimatedCost = 20 * tool.seats;
      reason = 'Cursor is built for coding. Claude Pro is better suited for writing and research at a lower cost.';
      priority = 'medium';
    }
  }

  // GitHub Copilot checks
  if (tool.name === 'github_copilot') {
    if (tool.plan === 'enterprise' && tool.seats < 10) {
      recommendedAction = 'Downgrade to Business';
      recommendedPlan = 'business';
      estimatedCost = 19 * tool.seats;
      reason = 'Copilot Enterprise features like Copilot Chat in GitHub.com are only valuable for larger teams.';
      priority = 'high';
    } else if (tool.plan === 'business' && tool.seats === 1) {
      recommendedAction = 'Downgrade to Individual';
      recommendedPlan = 'individual';
      estimatedCost = 10;
      reason = 'Business plan is for teams. Individual plan has the same AI features for solo developers.';
      priority = 'high';
    }
  }

  // Claude checks
  if (tool.name === 'claude') {
    if (tool.plan === 'max' && tool.seats === 1 && useCase !== 'coding') {
      recommendedAction = 'Downgrade to Pro';
      recommendedPlan = 'pro';
      estimatedCost = 20;
      reason = 'Claude Max is for power users needing 5x more usage. Pro is sufficient for most individuals.';
      priority = 'high';
    } else if (tool.plan === 'team' && tool.seats <= 2) {
      recommendedAction = 'Switch to Pro (individual)';
      recommendedPlan = 'pro';
      estimatedCost = 20 * tool.seats;
      reason = 'Team plan minimum is 2 seats at $30/seat. Two individual Pro plans cost less.';
      priority = 'medium';
    }
  }

  // ChatGPT checks
  if (tool.name === 'chatgpt') {
    if (tool.plan === 'plus' && useCase === 'coding') {
      recommendedAction = 'Switch to Cursor Pro';
      recommendedPlan = 'pro';
      estimatedCost = 20 * tool.seats;
      reason = 'For coding use cases, Cursor Pro provides deeper IDE integration than ChatGPT Plus.';
      priority = 'medium';
    } else if (tool.plan === 'team' && tool.seats <= 2) {
      recommendedAction = 'Switch to Plus (individual)';
      recommendedPlan = 'plus';
      estimatedCost = 20 * tool.seats;
      reason = 'Team plan at $30/seat is more expensive than individual Plus at $20/seat for small teams.';
      priority = 'high';
    }
  }

  // Gemini checks
  if (tool.name === 'gemini') {
    if (tool.plan === 'ultra' && useCase === 'coding') {
      recommendedAction = 'Switch to Cursor Pro';
      estimatedCost = 20 * tool.seats;
      reason = 'Gemini Ultra is not optimized for coding workflows. Cursor Pro offers better code completion.';
      priority = 'medium';
    }
  }

  const monthlySavings = Math.max(0, tool.monthlySpend - estimatedCost);
  const annualSavings = monthlySavings * 12;

  return {
    toolId: tool.id,
    toolName: tool.name,
    currentSpend: tool.monthlySpend,
    recommendedAction,
    recommendedPlan,
    estimatedCost,
    monthlySavings,
    annualSavings,
    reason,
    priority,
  };
}