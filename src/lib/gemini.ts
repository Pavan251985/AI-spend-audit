import { GoogleGenerativeAI } from '@google/generative-ai';
import { AuditResult } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAuditSummary(audit: Partial<AuditResult>): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a financial advisor specializing in AI tool costs for startups.
    
A user has completed an AI spend audit with these results:
- Total monthly savings opportunity: $${audit.totalMonthlySavings}
- Total annual savings opportunity: $${audit.totalAnnualSavings}
- Team size: ${audit.input?.teamSize}
- Primary use case: ${audit.input?.useCase}
- Tools audited: ${audit.input?.tools.map(t => t.name).join(', ')}

Write a 100-word personalized summary of their audit results. Be specific, actionable, and encouraging. 
Mention the biggest saving opportunity. Do not use bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Fallback if API fails
    return `Based on your audit, you could save $${audit.totalMonthlySavings}/month ($${audit.totalAnnualSavings}/year) on AI tools. 
    Your team of ${audit.input?.teamSize} is currently overspending on ${audit.input?.tools.length} tools. 
    By switching to more cost-effective plans and right-sizing your subscriptions, 
    you can significantly reduce costs without losing productivity. 
    Review the recommendations below to start saving today.`;
  }
}