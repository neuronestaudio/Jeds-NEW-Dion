import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    res.status(500).json({ error: 'Missing GHL_WEBHOOK_URL environment variable' });
    return;
  }

  try {
    const payload = req.body || {};

    // Basic validation
    const { name, phone, email, serviceType } = payload;
    if (!name || !phone || !email || !serviceType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Forward to GoHighLevel Inbound Webhook
    const forward = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        source: payload.source || 'website',
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!forward.ok) {
      const text = await forward.text();
      res.status(forward.status).json({ error: 'Forward failed', details: text });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Unexpected error', details: err?.message || String(err) });
  }
}
