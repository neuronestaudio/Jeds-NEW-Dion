const allowOrigin = (process.env.CORS_ALLOW_ORIGIN || process.env.ALLOWED_ORIGIN || '*')
  .split(',')[0]
  .trim();
const setCors = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const contentType = String(req.headers['content-type'] || '').toLowerCase();
    const params: Record<string, string> = {};
    if (req.body && typeof req.body === 'object') {
      for (const [k, v] of Object.entries(req.body as Record<string, any>)) {
        params[k] = typeof v === 'string' ? v : JSON.stringify(v);
      }
    } else if (
      req.body &&
      typeof req.body === 'string' &&
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      const search = new URLSearchParams(req.body as string);
      for (const [k, v] of search.entries()) params[k] = v;
    }

    const payload = {
      From: params['From'] || '',
      To: params['To'] || '',
      Body: params['Body'] || '',
      MessageSid: params['MessageSid'] || params['SmsSid'] || '',
      AccountSid: params['AccountSid'] || '',
      ReceivedAt: new Date().toISOString(),
    };
    console.log('[Twilio Inbound]', payload);

    const autoReplyEnabled = (process.env.TWILIO_AUTO_REPLY_ENABLED || 'false')
      .toString()
      .toLowerCase();
    const shouldAutoReply = ['true', '1', 'yes', 'on'].includes(autoReplyEnabled);
    const replyText =
      process.env.TWILIO_AUTO_REPLY_BODY ||
      "Thanks, we received your message. We'll contact you shortly.";

    if (shouldAutoReply) {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${replyText}</Message></Response>`;
      res.setHeader('Content-Type', 'text/xml');
      res.status(200).send(twiml);
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('Twilio inbound handler error:', err?.message || err);
    res.status(500).json({ error: 'Unexpected error' });
  }
}
