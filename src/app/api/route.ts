import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, company, totalMonthlySavings } = await req.json();

    await resend.emails.send({
      from: 'AI Spend Audit <onboarding@resend.dev>',
      to: 'pm9663683@gmail.com',
      subject: 'Your AI Spend Audit Report',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4ade80;">Your AI Spend Audit is Ready!</h1>
          <p>Hi${company ? ' from ' + company : ''},</p>
          <p>Your audit shows you could save <strong>$${totalMonthlySavings}/month</strong> on AI tools.</p>
          <p>If your savings are over $500/month, our team at Credex will reach out to help you capture even more savings through discounted AI credits.</p>
          <a href="https://credex.rocks" style="background: #4ade80; color: black; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 16px;">
            Learn About Credex →
          </a>
          <p style="color: #888; margin-top: 32px; font-size: 14px;">AI Spend Audit — Free tool by Credex</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}