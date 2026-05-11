export type PlanType = string;

export interface AITool {
  id: string;
  name: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: AITool[];
  teamSize: number;
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
}

export interface AuditRecommendation {
  toolId: string;
  toolName: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedTool?: string;
  recommendedPlan?: string;
  estimatedCost: number;
  monthlySavings: number;
  annualSavings: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AuditResult {
  shareId: string;
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary: string;
  input: AuditInput;
  createdAt: string;
}