// Serverless endpoint: GET /api/subscribers -> real member count of @zarsstudy.
//
// Why a server-side endpoint? Telegram does not expose subscriber counts through
// a browser-readable CORS API. This function runs on the host (Vercel / any
// Node serverless platform) and the browser only ever calls the same-origin
// /api/subscribers route, so no secret is ever sent to the client.
//
// Two sources, in order:
//   1. Official Bot API `getChatMemberCount`  - used when TELEGRAM_BOT_TOKEN is set.
//   2. The public channel preview page        - no credentials required.

const CHANNEL = 'zarsstudy';
const PREVIEW_URL = `https://t.me/${CHANNEL}`;
const USER_AGENT = 'Mozilla/5.0 (compatible; MindSparkSubscriberCount/1.0)';

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader(
    'Cache-Control',
    status === 200
      ? 'public, s-maxage=300, stale-while-revalidate=600'
      : 'no-store'
  );
  res.end(JSON.stringify(payload));
}

async function fromBotApi(token) {
  const url = `https://api.telegram.org/bot${token}/getChatMemberCount?chat_id=@${CHANNEL}`;
  const response = await fetch(url);
  const data = await response.json();
  return data && data.ok && Number.isFinite(data.result) ? data.result : null;
}

async function fromPublicPreview() {
  const response = await fetch(PREVIEW_URL, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!response.ok) return null;

  const html = await response.text();
  // e.g. <div class="tgme_page_extra">10 subscribers</div>
  const match = html.match(
    /tgme_page_extra[^>]*>\s*([\d\s.,\u00a0]+?)\s*(?:subscribers|members)/i
  );
  if (!match) return null;

  const count = parseInt(match[1].replace(/[^\d]/g, ''), 10);
  return Number.isFinite(count) ? count : null;
}

export default async function handler(_req, res) {
  let count = null;
  let source = null;
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (token) {
    try {
      count = await fromBotApi(token);
      if (count !== null) source = 'bot-api';
    } catch {
      // Fall through to the public preview page.
    }
  }

  if (count === null) {
    try {
      count = await fromPublicPreview();
      if (count !== null) source = 'public-preview';
    } catch {
      // Leave count as null; the client shows its neutral fallback.
    }
  }

  if (count === null) {
    send(res, 503, { count: null, error: 'Subscriber count unavailable' });
    return;
  }

  send(res, 200, {
    count,
    source,
    channel: `@${CHANNEL}`,
    link: `https://t.me/${CHANNEL}`,
  });
}
