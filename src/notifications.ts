// The Supabase publishable key is safe to use in the browser. Database RLS and
// narrowly scoped RPC functions enforce access; no service-role key is used.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const VISITOR_KEY = 'mindspark_notification_visitor';
const LAST_SEEN_KEY = 'mindspark_notifications_last_seen';

export interface NotificationMessage {
  id: string;
  title: string;
  text: string;
  createdAt: number;
  likes: number;
  liked: boolean;
}

export function getVisitorId(): string | null {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function getLastSeen(): number {
  try { return Number(localStorage.getItem(LAST_SEEN_KEY)) || 0; }
  catch { return 0; }
}

export function setLastSeen(time: number): void {
  try { localStorage.setItem(LAST_SEEN_KEY, String(time)); }
  catch { /* Notifications remain readable if browser storage is unavailable. */ }
}

async function rpc(name: string, body: Record<string, unknown>) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Notifications are not configured.');
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Could not connect to notifications. Please try again.');
  return response.json();
}

export async function fetchNotifications(visitorId: string | null): Promise<NotificationMessage[]> {
  const data = await rpc('mindspark_get_notifications', { p_visitor_id: visitorId });
  if (!Array.isArray(data)) throw new Error('Invalid notification response.');
  return data.map((item) => ({
    id: String(item.id),
    title: String(item.title || ''),
    text: String(item.body),
    createdAt: new Date(item.created_at).getTime(),
    likes: Number(item.likes) || 0,
    liked: Boolean(item.liked),
  }));
}

export async function setNotificationLike(messageId: string, visitorId: string, liked: boolean): Promise<void> {
  await rpc('mindspark_set_notification_like', { p_message_id: messageId, p_visitor_id: visitorId, p_liked: liked });
}
