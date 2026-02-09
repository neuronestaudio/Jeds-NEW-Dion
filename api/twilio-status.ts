import type { VercelRequest, VercelResponse } from '@vercel/node';

// Twilio will POST delivery status updates to this endpoint.
// It typically uses application/x-www-form-urlencoded with fields like:
// MessageSid, MessageStatus, To, From, ErrorCode, Body, AccountSid, SmsSid
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const contentType = String(req.headers['content-type'] || '').toLowerCase();

    let data: Record<string, string> = {};
    // If framework parsed body as object
    if (req.body && typeof req.body === 'object') {
      for (const [k, v] of Object.entries(req.body as Record<string, any>)) {
        data[k] = typeof v === 'string' ? v : JSON.stringify(v);
      }
    } else if (req.body && typeof req.body === 'string' && contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(req.body as string);
      for (const [k, v] of params.entries()) data[k] = v;
    } else {
      // Attempt to read common Twilio query params if present
      const urlParams = new URLSearchParams((req as any).query || '');
      for (const [k, v] of urlParams.entries()) data[k] = v;
    }

    const payload = {
      MessageSid: data['MessageSid'] || '',
      MessageStatus: data['MessageStatus'] || '',
      To: data['To'] || '',
      From: data['From'] || '',
      ErrorCode: data['ErrorCode'] || '',
      AccountSid: data['AccountSid'] || '',
      SmsSid: data['SmsSid'] || '',
      Body: data['Body'] || '',
      ReceivedAt: new Date().toISOString(),
    };

    // Log for observability in Vercel
    console.log('[Twilio Status]', payload);

    // You could forward this to a logging service or store in a DB if desired.

    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error('Twilio status handler error:', err?.message || err);
    res.status(500).json({ error: 'Unexpected error' });
  }
}