const allowOrigin = (process.env.CORS_ALLOW_ORIGIN || process.env.ALLOWED_ORIGIN || '*')
  .split(',')[0]
  .trim();
const setCors = (res: any) => {
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

export default async function handler(req: any, res: any) {
  console.log('[Quote] handler start');
  try {
    if (typeof res?.setHeader === 'function') {
      setCors(res);
    }
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
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
    const skipForwardFlag = (process.env.SKIP_GHL_FORWARD || 'false').toString().toLowerCase();
    const shouldSkipForward = ['true', '1', 'yes', 'on'].includes(skipForwardFlag);

    let payload: any = req.body || {};
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (parseError: any) {
        console.error('[Quote] Invalid JSON body', parseError?.message || parseError);
        res.status(400).json({ error: 'Invalid JSON body' });
        return;
      }
    }

    // Basic validation
    const { name, phone, email, serviceType, address } = payload;
    if (!name || !phone || !email || !serviceType) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    if (!address || !String(address).trim()) {
      res.status(400).json({ error: 'Missing service address' });
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

    /**
     * Map the Google Places result onto the keys GoHighLevel's inbound webhook
     * recognises as *standard* contact fields. Sending `address1` / `city` /
     * `state` / `postal_code` / `country` lands the job address on the native
     * contact record, so it shows on the contact card, is usable in workflow
     * triggers and filters, and merges into SMS/email templates. A single
     * free-text blob would only ever sit in a custom field.
     *
     * `addressVerified` records whether the lead actually picked a Google
     * suggestion or typed it themselves — worth knowing before a truck is sent.
     */
    const details = payload.addressDetails || null;
    const addressText = String(address).trim();
    const ghlAddress = details
      ? {
          address1: details.addressLine1 || addressText,
          city: details.suburb || '',
          state: details.state || '',
          postal_code: details.postcode || '',
          country: details.countryCode || 'AU',
          // camelCase duplicates: GHL accepts either casing depending on how the
          // inbound webhook's field mapping was configured.
          postalCode: details.postcode || '',
          full_address: details.formatted || addressText,
          latitude: details.lat ?? '',
          longitude: details.lng ?? '',
          addressVerified: true,
          googlePlaceId: details.placeId || '',
        }
      : {
          address1: addressText,
          full_address: addressText,
          country: 'AU',
          addressVerified: false,
        };

    // Forward to GoHighLevel Inbound Webhook if configured
    if (webhookUrl && !shouldSkipForward) {
      const forward = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          ...ghlAddress,
          address: addressText,
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
    }

    // Optionally notify owner via SMS using Twilio if env vars are present
    const twilioSid = process.env.TWILIO_ACCOUNT_SID || process.env.twilio_account_sid;
    const twilioToken = process.env.TWILIO_AUTH_TOKEN || process.env.twilio_auth_token;
    const twilioFrom = process.env.TWILIO_FROM_NUMBER || process.env.twilio_from_number;
    const twilioFromClean = (twilioFrom || '').replace(/\s+/g, '').trim();
    const twilioServiceSid =
      (process.env.TWILIO_MESSAGING_SERVICE_SID || process.env.twilio_messaging_service_sid || '').trim();
    const ownerToRaw = process.env.OWNER_SMS_TO || process.env.owner_sms_to;

    const debugTwilio = (process.env.DEBUG_TWILIO || 'false').toString().toLowerCase() === 'true';
    let smsError: string | undefined;
    let ownerSmsSid: string | undefined;
    let ownerToNormalized: string | undefined;
    let ownerSmsRequest: Record<string, string> | undefined;
    let ownerSmsResponse: string | undefined;
    const statusCallbackUrlRaw =
      process.env.TWILIO_STATUS_CALLBACK_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/twilio-status` : undefined);
    const statusCallbackUrl = statusCallbackUrlRaw ? String(statusCallbackUrlRaw).trim() : undefined;
    if (twilioSid && twilioToken && twilioFromClean && ownerToRaw) {
      ownerToNormalized = normalizeAuPhone(String(ownerToRaw)) || undefined;
      if (ownerToNormalized) {
        try {
          const params = new URLSearchParams();
          params.append('To', ownerToNormalized);
          if (twilioServiceSid) {
            params.append('MessagingServiceSid', twilioServiceSid);
          } else {
            params.append('From', twilioFromClean);
          }
          if (statusCallbackUrl) {
            params.append('StatusCallback', statusCallbackUrl);
          }
          params.append(
            'Body',
            `New Quote\nName: ${name}\nEmail: ${email}\nPhone: ${normalizedPhone}\nService: ${serviceType}\nAddress: ${ghlAddress.full_address}${
              details ? '' : ' (unverified)'
            }\nMessage: ${payload.message || ''}`
          );
          if (debugTwilio) {
            ownerSmsRequest = {
              To: ownerToNormalized,
              From: twilioServiceSid ? '' : twilioFromClean,
              MessagingServiceSid: twilioServiceSid || '',
              StatusCallback: statusCallbackUrl || '',
            };
          }

          const twilioResp = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
              },
              body: params.toString(),
            }
          );
          if (twilioResp.ok) {
            const data = await twilioResp.json();
            ownerSmsSid = data?.sid;
          } else {
            ownerSmsResponse = await twilioResp.text();
            smsError = `Twilio error: ${ownerSmsResponse}`;
          }
        } catch (e: any) {
          smsError = e?.message || String(e);
        }
      } else {
        smsError = 'OWNER_SMS_TO is not a valid AU number';
      }
    }

    // Optionally send confirmation SMS to the submitting customer's phone
    const sendCustomerFlag = (
      process.env.TWILIO_SEND_CUSTOMER_SMS ||
      process.env.SEND_CUSTOMER_SMS ||
      'true'
    )
      .toString()
      .toLowerCase();
    const shouldSendCustomer = ['true', '1', 'yes', 'on'].includes(sendCustomerFlag);
    let customerSmsError: string | undefined;
    let customerSmsSid: string | undefined;
    let customerSmsRequest: Record<string, string> | undefined;
    let customerSmsResponse: string | undefined;
    if (twilioSid && twilioToken && twilioFromClean && shouldSendCustomer && normalizedPhone) {
      try {
        const params = new URLSearchParams();
        params.append('To', normalizedPhone);
        if (twilioServiceSid) {
          params.append('MessagingServiceSid', twilioServiceSid);
        } else {
          params.append('From', twilioFromClean);
        }
        if (statusCallbackUrl) {
          params.append('StatusCallback', statusCallbackUrl);
        }
        params.append(
          'Body',
          `Thanks ${name}, we received your request for "${serviceType}". We'll contact you shortly. - JED Air Conditioning`
        );
        if (debugTwilio) {
          customerSmsRequest = {
            To: normalizedPhone,
            From: twilioServiceSid ? '' : twilioFromClean,
            MessagingServiceSid: twilioServiceSid || '',
            StatusCallback: statusCallbackUrl || '',
          };
        }

        const twilioResp = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: 'Basic ' + Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64'),
            },
            body: params.toString(),
          }
        );
        if (twilioResp.ok) {
          const data = await twilioResp.json();
          customerSmsSid = data?.sid;
        } else {
          customerSmsResponse = await twilioResp.text();
          customerSmsError = `Twilio customer SMS error: ${customerSmsResponse}`;
        }
      } catch (e: any) {
        customerSmsError = e?.message || String(e);
      }
    }

    const shouldIncludeDebug = debugTwilio || Boolean(smsError || customerSmsError);
    res.status(200).json({
      ok: true,
      smsError,
      customerSmsError,
      ownerSmsSid,
      customerSmsSid,
      ...(shouldIncludeDebug
        ? {
            debugEnabled: debugTwilio,
            debug: {
              ownerSmsRequest: ownerSmsRequest || {
                To: ownerToNormalized || '',
                From: twilioServiceSid ? '' : twilioFromClean,
                MessagingServiceSid: twilioServiceSid || '',
                StatusCallback: statusCallbackUrl || '',
              },
              ownerSmsResponse,
              customerSmsRequest: customerSmsRequest || {
                To: normalizedPhone || '',
                From: twilioServiceSid ? '' : twilioFromClean,
                MessagingServiceSid: twilioServiceSid || '',
                StatusCallback: statusCallbackUrl || '',
              },
              customerSmsResponse,
            },
          }
        : {}),
    });
  } catch (err: any) {
    console.error('[Quote] Unexpected error', err?.message || err);
    try {
      res.status(500).json({ error: 'Unexpected error', details: err?.message || String(err) });
    } catch {
      // noop
    }
  }
}
