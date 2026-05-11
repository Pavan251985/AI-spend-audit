'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AuditResult } from '@/types';
import { supabase } from '@/lib/supabase';

export default function AuditPage() {
  const params = useParams();
  const shareId = params.shareId as string;
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadAudit = async () => {
      const cached = localStorage.getItem('audit_' + shareId);
      if (cached) {
        setAudit(JSON.parse(cached));
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from('audits')
        .select('*')
        .eq('share_id', shareId)
        .single();
      if (data) {
        setAudit({
          shareId: data.share_id,
          recommendations: data.audit_results,
          totalMonthlySavings: data.total_monthly_savings,
          totalAnnualSavings: data.total_annual_savings,
          aiSummary: data.ai_summary,
          input: {
            tools: data.tools,
            teamSize: data.team_size,
            useCase: data.use_case,
          },
          createdAt: data.created_at,
        });
      }
      setLoading(false);
    };
    loadAudit();
  }, [shareId]);

  const handleLeadSubmit = async () => {
    // Honeypot check - if filled, it's a bot
    if (honeypot) return;

    if (!email) return alert('Please enter your email!');
    setSubmitting(true);
    try {
      const { data: auditData } = await supabase
        .from('audits')
        .select('id')
        .eq('share_id', shareId)
        .single();
      await supabase.from('leads').insert({
        audit_id: auditData?.id,
        email,
        company_name: company,
        role,
        team_size: audit?.input.teamSize,
      });
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, totalMonthlySavings: audit?.totalMonthlySavings }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading your audit...</div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Audit not found.</div>
      </div>
    );
  }

  const isHighSavings = audit.totalMonthlySavings > 500;
  const isOptimal = audit.totalMonthlySavings < 100;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="bg-gradient-to-b from-green-900/30 to-gray-950 py-12 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-2">Your AI Spend Audit</h1>
        <p className="text-gray-400">Here is where your money is going and how to keep more of it.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16">

        <div className="bg-gray-900 border border-green-700 rounded-2xl p-8 mb-6 text-center">
          <p className="text-gray-400 mb-2">Total Potential Savings</p>
          <div className="text-6xl font-bold text-green-400 mb-2">
            ${audit.totalMonthlySavings.toFixed(0)}<span className="text-2xl">/mo</span>
          </div>
          <div className="text-2xl text-green-300 font-semibold">
            ${audit.totalAnnualSavings.toFixed(0)} per year
          </div>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3 text-green-400">✨ Personalized Summary</h2>
          <p className="text-gray-300 leading-relaxed">{audit.aiSummary}</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📊 Tool-by-Tool Breakdown</h2>
          {audit.recommendations.map((rec, i) => (
            <div key={i} className="border border-gray-800 rounded-xl p-4 mb-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-semibold text-white capitalize">
                    {rec.toolName.replace('_', ' ')}
                  </span>
                  <span className={
                    'ml-2 text-xs px-2 py-0.5 rounded-full ' +
                    (rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400')
                  }>
                    {rec.priority} priority
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold">${rec.monthlySavings.toFixed(0)}/mo saved</div>
                  <div className="text-gray-500 text-sm line-through">${rec.currentSpend}/mo</div>
                </div>
              </div>
              <div className="text-green-300 font-medium text-sm mb-1">→ {rec.recommendedAction}</div>
              <div className="text-gray-400 text-sm">{rec.reason}</div>
            </div>
          ))}
        </div>

        {isHighSavings && (
          <div className="bg-gray-900 border border-green-500 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">💡 Save Even More with Credex</h2>
            <p className="text-gray-300 mb-4">
              You are leaving ${audit.totalMonthlySavings.toFixed(0)}/month on the table.
              Credex sells discounted AI credits at up to 40% off retail price.
            </p>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-xl"
            >
              Book a Free Credex Consultation →
            </a>
          </div>
        )}

        {isOptimal && (
          <div className="bg-gray-900 border border-green-700 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-2">✅ You are Spending Well!</h2>
            <p className="text-gray-300">Your AI tool spend looks optimized. We will notify you when new savings opportunities apply to your stack.</p>
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-3">🔗 Share Your Audit</h2>
          <div className="flex gap-3">
            <input
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="flex-1 bg-gray-800 rounded-xl px-4 py-2 text-gray-400 text-sm border border-gray-700"
            />
            <button
              onClick={copyLink}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-2 rounded-xl"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {!submitted ? (
          <div className="bg-gray-900 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-1">📩 Get Your Full Report</h2>
            <p className="text-gray-400 text-sm mb-4">We will email you this audit and notify you when new savings apply.</p>
            <div className="space-y-3">
              {/* Honeypot field - hidden from real users */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              <input
                type="email"
                placeholder="your@email.com *"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white border border-gray-700 outline-none"
              />
              <input
                type="text"
                placeholder="Company name (optional)"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white border border-gray-700 outline-none"
              />
              <input
                type="text"
                placeholder="Your role (optional)"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-gray-800 rounded-xl px-4 py-3 text-white border border-gray-700 outline-none"
              />
              <button
                onClick={handleLeadSubmit}
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 text-black font-bold py-3 rounded-xl"
              >
                {submitting ? 'Sending...' : '📨 Send Me the Report'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-green-700 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h2 className="text-xl font-bold mb-1">Report sent!</h2>
            <p className="text-gray-400">Check your inbox. We will be in touch if we spot more savings for you.</p>
          </div>
        )}

        <div className="text-center mt-6">
          <a href="/" className="text-green-400 hover:text-green-300 text-sm underline">
            ← Run a new audit
          </a>
        </div>

      </div>
    </main>
  );
}
