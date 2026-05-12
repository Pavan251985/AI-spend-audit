'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { AITool, AuditInput } from '@/types';
import { runAudit } from '@/lib/auditEngine';
import { supabase } from '@/lib/supabase';
import { generateAuditSummary } from '@/lib/gemini';

const TOOLS = [
  { id: 'cursor', name: 'Cursor', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { id: 'github_copilot', name: 'GitHub Copilot', plans: ['Individual', 'Business', 'Enterprise'] },
  { id: 'claude', name: 'Claude', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise'] },
  { id: 'chatgpt', name: 'ChatGPT', plans: ['Plus', 'Team', 'Enterprise'] },
  { id: 'gemini', name: 'Gemini', plans: ['Pro', 'Ultra'] },
  { id: 'windsurf', name: 'Windsurf', plans: ['Free', 'Pro', 'Team'] },
];

const USE_CASES = ['coding', 'writing', 'data', 'research', 'mixed'];

export default function Home() {
  const router = useRouter();
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState('mixed');
  const [selectedTools, setSelectedTools] = useState<AITool[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('auditInput');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTeamSize(parsed.teamSize || 1);
      setUseCase(parsed.useCase || 'mixed');
      setSelectedTools(parsed.tools || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('auditInput', JSON.stringify({ teamSize, useCase, tools: selectedTools }));
  }, [teamSize, useCase, selectedTools]);

  const toggleTool = (toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId)!;
    if (selectedTools.find(t => t.id === toolId)) {
      setSelectedTools(selectedTools.filter(t => t.id !== toolId));
    } else {
      setSelectedTools([...selectedTools, {
        id: toolId,
        name: toolId,
        plan: tool.plans[0].toLowerCase(),
        monthlySpend: 0,
        seats: 1,
      }]);
    }
  };

  const updateTool = (toolId: string, field: string, value: string | number) => {
    setSelectedTools(selectedTools.map(t =>
      t.id === toolId ? { ...t, [field]: value } : t
    ));
  };

  const handleSubmit = async () => {
    if (selectedTools.length === 0) return alert('Please select at least one tool!');
    setLoading(true);

    try {
      const input: AuditInput = {
        tools: selectedTools,
        teamSize,
        useCase: useCase as AuditInput['useCase'],
      };
      const recommendations = runAudit(input);
      const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);
      const totalAnnualSavings = totalMonthlySavings * 12;
      const shareId = nanoid(10);

      const auditData = {
        input,
        recommendations,
        totalMonthlySavings,
        totalAnnualSavings,
        shareId,
        aiSummary: '',
        createdAt: new Date().toISOString(),
      };

      const aiSummary = await generateAuditSummary(auditData);
      auditData.aiSummary = aiSummary;

      await supabase.from('audits').insert({
        share_id: shareId,
        tools: selectedTools,
        team_size: teamSize,
        use_case: useCase,
        total_monthly_savings: totalMonthlySavings,
        total_annual_savings: totalAnnualSavings,
        audit_results: recommendations,
        ai_summary: aiSummary,
      });

      localStorage.setItem('audit_' + shareId, JSON.stringify(auditData));
      router.push('/audit/' + shareId);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="bg-gradient-to-b from-green-900/30 to-gray-950 py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Are You <span className="text-green-400">Overpaying</span> for AI Tools?
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Get a free instant audit of your AI subscriptions. See exactly where you are wasting money and how much you could save.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-8">
        {/* Team Info */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Team</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Team Size</label>
              <input
                type="number"
                min={1}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Primary Use Case</label>
              <select
                value={useCase}
                onChange={e => setUseCase(e.target.value)}
                className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white border border-gray-700 focus:border-green-500 outline-none"
              >
                {USE_CASES.map(uc => (
                  <option key={uc} value={uc}>{uc.charAt(0).toUpperCase() + uc.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tool Selection */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Your AI Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {TOOLS.map(tool => (
              <button
                key={tool.id}
                onClick={() => toggleTool(tool.id)}
                className={
                  'p-3 rounded-xl border text-sm font-medium transition-all ' +
                  (selectedTools.find(t => t.id === tool.id)
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500')
                }
              >
                {tool.name}
              </button>
            ))}
          </div>

          {selectedTools.map(tool => {
            const toolConfig = TOOLS.find(t => t.id === tool.id)!;
            return (
              <div key={tool.id} className="bg-gray-800 rounded-xl p-4 mb-3">
                <h3 className="font-semibold text-green-400 mb-3">{toolConfig.name}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Plan</label>
                    <select
                      value={tool.plan}
                      onChange={e => updateTool(tool.id, 'plan', e.target.value)}
                      className="w-full bg-gray-700 rounded-lg px-2 py-1.5 text-white text-sm border border-gray-600 outline-none"
                    >
                      {toolConfig.plans.map(p => (
                        <option key={p} value={p.toLowerCase()}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Monthly Spend ($)</label>
                    <input
                      type="number"
                      min={0}
                      value={tool.monthlySpend}
                      onChange={e => updateTool(tool.id, 'monthlySpend', Number(e.target.value))}
                      className="w-full bg-gray-700 rounded-lg px-2 py-1.5 text-white text-sm border border-gray-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">Seats</label>
                    <input
                      type="number"
                      min={1}
                      value={tool.seats}
                      onChange={e => updateTool(tool.id, 'seats', Number(e.target.value))}
                      className="w-full bg-gray-700 rounded-lg px-2 py-1.5 text-white text-sm border border-gray-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || selectedTools.length === 0}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:cursor-not-allowed text-black font-bold py-4 rounded-2xl text-lg transition-all"
        >
          {loading ? 'Analyzing your spend...' : '🔍 Run My Free Audit'}
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 px-4 text-center mt-8">
        <p className="text-gray-500 text-sm">
          Built by{' '}
          <a href="https://credex.rocks" target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">
            Credex
          </a>
          {' '}— Discounted AI credits for startups
        </p>
        <p className="text-gray-600 text-xs mt-1">
          Pricing data verified weekly from official vendor pages
        </p>
      </footer>
    </main>
  );
}
