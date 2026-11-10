// Validate each Turnstile token server-side; never expose the secret to the browser.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false });
  const token = req.body?.token;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (typeof token !== 'string' || !token || token.length > 2048 || !secret) {
    return res.status(400).json({ success: false });
  }
  try {
    const body = new URLSearchParams({ secret, response: token });
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body, signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    const success = response.ok && result.success === true && result.hostname === 'mindspark-all.vercel.app';
    return res.status(success ? 200 : 403).json({ success });
  } catch {
    return res.status(503).json({ success: false });
  }
}
