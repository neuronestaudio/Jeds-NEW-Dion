import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  // Accept multiple possible env var names to avoid casing mismatches
  const webhookUrl =
    process.env.GHL_WEBHOOK_URL ||
    // common alternate naming observed in projects
    process.env.GHL_webhook_url ||
    process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
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

    // Normalize Australian phone numbers to E.164 (+61...)
    const normalizeAuPhone = (input: string): string | null => {
      if (!input) return null;
      const raw = input.trim().replace(/[^\d+]/g, '');
      let candidate = raw;
      if (candidate.startsWith('+61')) {
        // already has country code
        candidate = '+61' + candidate.replace('+61', '');
      } else if (candidate.startsWith('61')) {
        candidate = '+' + candidate;
      } else if (candidate.startsWith('0')) {
        candidate = '+61' + candidate.slice(1);
      } else if (/^[23478]\d{8}$/.test(candidate) || /^4\d{8}$/.test(candidate)) {
        // likely missing country code, add +61
        candidate = '+61' + candidate;
      }
      // Validate AU formats: mobile +614XXXXXXXX or landline +612/3/7/8XXXXXXXX
      if (/^\+61[23478]\d{8}$/.test(candidate)) return candidate;
      return null;
    };

    const normalizedPhone = normalizeAuPhone(String(phone));
    if (!normalizedPhone) {
      res.status(400).json({ error: 'Invalid Australian phone number' });
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
        phone: normalizedPhone,
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
