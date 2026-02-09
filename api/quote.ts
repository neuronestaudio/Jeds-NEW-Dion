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

    // Optionally notify owner via SMS using Twilio if env vars are present
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER;
    const ownerToRaw = process.env.OWNER_SMS_TO;

    let smsError: string | undefined;
    if (twilioSid && twilioToken && twilioFrom && ownerToRaw) {
      const normalizeOwner = normalizeAuPhone(String(ownerToRaw));
      if (normalizeOwner) {
        try {
          const params = new URLSearchParams();
          params.append('To', normalizeOwner);
          params.append('From', twilioFrom);
          params.append(
            'Body',
            `New Quote\nName: ${name}\nEmail: ${email}\nPhone: ${normalizedPhone}\nService: ${serviceType}\nMessage: ${payload.message || ''}`
          );

          const twilioResp = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization:
                  'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
              },
              body: params.toString(),
            }
          );
          if (!twilioResp.ok) {
            smsError = `Twilio error: ${await twilioResp.text()}`;
          }
        } catch (e: any) {
          smsError = e?.message || String(e);
        }
      } else {
        smsError = 'OWNER_SMS_TO is not a valid AU number';
      }
    }

    // Optionally send confirmation SMS to the submitting customer's phone
    const sendCustomerFlag = (process.env.TWILIO_SEND_CUSTOMER_SMS || process.env.SEND_CUSTOMER_SMS || '').toString().toLowerCase();
    const shouldSendCustomer = ['true', '1', 'yes', 'on'].includes(sendCustomerFlag);
    let customerSmsError: string | undefined;
    if (twilioSid && twilioToken && twilioFrom && shouldSendCustomer && normalizedPhone) {
      try {
        const params = new URLSearchParams();
        params.append('To', normalizedPhone);
        params.append('From', twilioFrom);
        params.append(
          'Body',
          `Thanks ${name}, we received your request for "${serviceType}". We'll contact you shortly. - JED Air Conditioning`
        );

        const twilioResp = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization:
                'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
            },
            body: params.toString(),
          }
        );
        if (!twilioResp.ok) {
          customerSmsError = `Twilio customer SMS error: ${await twilioResp.text()}`;
        }
      } catch (e: any) {
        customerSmsError = e?.message || String(e);
      }
    }

    res.status(200).json({ ok: true, smsError, customerSmsError });
  } catch (err: any) {
    res.status(500).json({ error: 'Unexpected error', details: err?.message || String(err) });
  }
}
