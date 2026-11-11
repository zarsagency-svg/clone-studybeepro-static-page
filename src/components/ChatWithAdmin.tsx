import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, CheckCheck, LogOut, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import {
  consumeAuthRedirect,
  getSession,
  rpc,
  signInWithGoogle,
  signOut,
  type GoogleSession,
} from '../lib/supabase';

interface ChatConversation {
  id: string;
  googleEmail: string;
  googleName: string;
  googleAvatar: string;
  googleAvatarInitials: string;
  lastMessagePreview: string;
  lastSender: 'visitor' | 'admin';
  unreadByAdmin: number;
  unreadByVisitor: number;
  lastMessageAt: number;
  createdAt: number;
}

interface ChatMessage {
  id: number;
  conversationId: string;
  sender: 'visitor' | 'admin';
  body: string;
  createdAt: number;
}

interface ChatWithAdminProps {
  /** True while the chat tab is on screen — drives background polling. */
  isActive: boolean;
  /** Reports how many admin replies are unread, for the tab badge. */
  onUnreadChange?: (unread: number) => void;
  /** Reports the signed-in Google user so the drawer can greet them. */
  onIdentityChange?: (user: GoogleSession['user'] | null) => void;
}

const POLL_MS = 6_000;
const MAX_CHARS = 2000;

const timeFormatter = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const dayFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const dayKey = (epochMs: number) => {
  const d = new Date(epochMs);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const formatClock = (epochMs: number) => (epochMs ? timeFormatter.format(new Date(epochMs)) : '');

const formatDayLabel = (epochMs: number) => {
  const today = Date.now();
  if (dayKey(epochMs) === dayKey(today)) return 'Today';
  if (dayKey(epochMs) === dayKey(today - 86_400_000)) return 'Yesterday';
  return dayFormatter.format(new Date(epochMs));
};

/** Inline Google "G" so the drawer never depends on an external asset. */
function GoogleG({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/**
 * WhatsApp-style chat with the MIND SPARK admin, living inside the notification
 * drawer. Requires a real Google sign-in: the database derives the sender from
 * the verified Supabase auth record, so the identity cannot be spoofed.
 */
export default function ChatWithAdmin({
  isActive,
  onUnreadChange,
  onIdentityChange,
}: ChatWithAdminProps) {
  const [session, setSession] = useState<GoogleSession | null>(() => getSession());
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const sessionRef = useRef<GoogleSession | null>(session);
  sessionRef.current = session;

  const publishIdentity = useCallback(
    (user: GoogleSession['user'] | null) => {
      onIdentityChange?.(user);
    },
    [onIdentityChange],
  );

  const loadThread = useCallback(
    async (silent = false) => {
      if (!sessionRef.current) return;
      if (!silent) setIsLoading(true);
      try {
        const data = await rpc<{ conversation: ChatConversation; messages: ChatMessage[] }>(
          'chat_my_conversation',
          {},
          { requireSignIn: true },
        );
        setConversation(data.conversation ?? null);
        setMessages(Array.isArray(data.messages) ? data.messages : []);
        onUnreadChange?.(data.conversation?.unreadByVisitor ?? 0);
        setError('');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Could not load the chat';
        if (!silent) setError(message);
        if (/sign in/i.test(message)) {
          setSession(null);
          publishIdentity(null);
        }
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [onUnreadChange, publishIdentity],
  );

  // Boot: finish any OAuth redirect, then load the thread.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const redirected = await consumeAuthRedirect();
        if (cancelled) return;
        if (redirected) {
          setSession(redirected);
          publishIdentity(redirected.user);
          setNotice(`Signed in as ${redirected.user.email}`);
        } else {
          const existing = getSession();
          setSession(existing);
          publishIdentity(existing?.user ?? null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Google sign-in failed');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [publishIdentity]);

  useEffect(() => {
    if (session) void loadThread();
    else {
      setConversation(null);
      setMessages([]);
      onUnreadChange?.(0);
    }
  }, [session, loadThread, onUnreadChange]);

  // Poll for admin replies while the tab is visible.
  useEffect(() => {
    if (!session || !isActive) return;
    const timer = setInterval(() => void loadThread(true), POLL_MS);
    const onFocus = () => void loadThread(true);
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [session, isActive, loadThread]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, isLoading]);

  const handleSignIn = async () => {
    setError('');
    try {
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start Google sign-in');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setSession(null);
    setConversation(null);
    setMessages([]);
    publishIdentity(null);
    onUnreadChange?.(0);
    setNotice('Signed out of Google');
  };

  const handleSend = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const body = draft.trim();
    if (!body || isSending || !session) return;

    setIsSending(true);
    setError('');
    const optimisticId = -Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: optimisticId,
        conversationId: conversation?.id ?? '',
        sender: 'visitor',
        body,
        createdAt: Date.now(),
      },
    ]);
    setDraft('');

    try {
      const result = await rpc<{ message: ChatMessage; conversation: ChatConversation }>(
        'chat_send',
        { p_body: body },
        { requireSignIn: true },
      );
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== optimisticId)
          .concat(result.message ? [result.message] : []),
      );
      if (result.conversation) setConversation(result.conversation);
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setDraft(body);
      setError(e instanceof Error ? e.message : 'Message not sent');
    } finally {
      setIsSending(false);
    }
  };

  const grouped = useMemo(() => {
    const out: { label: string; items: ChatMessage[] }[] = [];
    for (const msg of messages) {
      const label = formatDayLabel(msg.createdAt);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(msg);
      else out.push({ label, items: [msg] });
    }
    return out;
  }, [messages]);

  /* ---------------- Signed-out: Google sign-in gate ---------------- */
  if (!session) {
    return (
      <div className="relative z-10 flex-1 overflow-y-auto p-5 no-scrollbar">
        <div
          className="rounded-[24px] p-6 text-center space-y-4"
          style={{
            background: 'var(--notification-card-background)',
            backdropFilter: 'var(--glass-soft-filter)',
            WebkitBackdropFilter: 'var(--glass-soft-filter)',
            borderTop: '1.5px solid rgba(230,237,253,0.55)',
            borderLeft: '1px solid rgba(230,237,253,0.35)',
            borderRight: '1px solid rgba(175,197,248,0.25)',
            borderBottom: '1.5px solid rgba(7,16,57,0.8)',
            boxShadow: '0 14px 30px -8px rgba(7,16,57,0.7)',
          }}
        >
          <div
            className="w-14 h-14 mx-auto rounded-2xl grid place-items-center"
            style={{
              background: 'linear-gradient(135deg, #2E5DE6 0%, #1A3BB0 100%)',
              border: '1px solid rgba(230,237,253,0.5)',
              boxShadow: '0 8px 20px rgba(46,93,230,0.5)',
            }}
          >
            <Send className="w-6 h-6 text-[#E6EDFD]" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[#E6EDFD] font-display font-bold text-lg">Chat with the Admin</h3>
            <p className="text-[13px] leading-relaxed text-[#AFC5F8]">
              Talk to Mr Sad directly, WhatsApp style. Sign in with a real Google
              account so the admin knows who is writing and can reply to you here.
            </p>
          </div>

          <ul className="text-left space-y-2 text-[12.5px] text-[#AFC5F8]">
            {[
              'Two-way thread — replies appear in this same drawer',
              'Your Google name and photo identify the conversation',
              'No passcodes, no fake demo accounts',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-[#6E92F2]" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          {error && (
            <p role="alert" className="text-[12px] text-[#F8AFC5]">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignIn}
            className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl font-display font-bold text-sm text-[#071039] transition-ui cursor-pointer hover:brightness-105"
            style={{
              background: 'linear-gradient(135deg, #E6EDFD 0%, #AFC5F8 100%)',
              border: '1.5px solid rgba(230,237,253,0.85)',
              boxShadow: '0 12px 26px -8px rgba(7,16,57,0.85)',
            }}
          >
            <GoogleG className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-[11px] text-[#AFC5F8]/70">
            Signing in creates a private conversation visible only to you and the
            MIND SPARK admin.
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- Signed-in: live thread ---------------- */
  return (
    <div className="relative z-10 flex-1 flex flex-col min-h-0">
      {/* Thread header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{
          background: 'linear-gradient(180deg, rgba(175,197,248,0.14) 0%, rgba(26,59,176,0.1) 100%)',
          borderBottom: '1px solid rgba(175,197,248,0.22)',
        }}
      >
        <div
          className="w-9 h-9 rounded-xl grid place-items-center shrink-0 font-display font-bold text-xs text-[#E6EDFD]"
          style={{
            background: 'linear-gradient(135deg, #2E5DE6 0%, #1A3BB0 100%)',
            border: '1px solid rgba(230,237,253,0.5)',
            boxShadow: '0 4px 10px rgba(46,93,230,0.45)',
          }}
        >
          MS
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[#E6EDFD] font-display font-bold text-sm truncate">Mr Sad · Admin</p>
          <p className="text-[11px] text-[#AFC5F8]/85 truncate flex items-center gap-1.5">
            {session.user.avatar ? (
              <img
                src={session.user.avatar}
                alt=""
                referrerPolicy="no-referrer"
                className="w-3.5 h-3.5 rounded-full object-cover"
              />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-[#6E92F2] shrink-0" />
            )}
            <span className="truncate">{session.user.email}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadThread()}
          aria-label="Refresh chat"
          className="p-2 rounded-xl text-[#AFC5F8] hover:text-[#E6EDFD] hover:bg-[#E6EDFD]/15 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          aria-label="Sign out of Google"
          className="p-2 rounded-xl text-[#AFC5F8] hover:text-[#E6EDFD] hover:bg-[#E6EDFD]/15 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {notice && (
        <p className="px-4 pt-2 text-[11px] text-[#AFC5F8]/85">{notice}</p>
      )}
      {error && (
        <p role="alert" className="px-4 pt-2 text-[12px] text-[#F8AFC5]">
          {error}
        </p>
      )}

      {/* Bubbles */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 px-4 py-4 space-y-3 no-scrollbar"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(110,146,242,0.14), transparent 45%), radial-gradient(circle at 80% 80%, rgba(46,93,230,0.16), transparent 48%)',
        }}
      >
        {isLoading && messages.length === 0 ? (
          <div className="space-y-3">
            <div className="h-16 w-3/4 rounded-2xl bg-[#1A3BB0]/30 border border-[#6E92F2]/25 animate-pulse" />
            <div className="h-14 w-2/3 ml-auto rounded-2xl bg-[#1A3BB0]/20 border border-[#6E92F2]/20 animate-pulse" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center space-y-2 pt-8">
            <p className="text-[#E6EDFD] font-display font-bold text-sm">Start the conversation</p>
            <p className="text-[12.5px] text-[#AFC5F8]/85 max-w-[16rem] mx-auto">
              Send the first message — it lands instantly in the admin console and
              Mr Sad replies right here.
            </p>
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="flex justify-center">
                <span
                  className="px-3 py-1 rounded-full text-[10px] font-semibold text-[#AFC5F8]"
                  style={{ background: 'rgba(7,16,57,0.7)', border: '1px solid rgba(175,197,248,0.25)' }}
                >
                  {group.label}
                </span>
              </div>
              {group.items.map((msg) => {
                const mine = msg.sender === 'visitor';
                const pending = msg.id < 0;
                return (
                  <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-[18px] px-3.5 py-2.5 ${
                        mine ? 'rounded-br-[6px]' : 'rounded-bl-[6px]'
                      }`}
                      style={
                        mine
                          ? {
                              background: 'linear-gradient(150deg, rgba(46,93,230,0.95) 0%, rgba(15,34,112,0.95) 100%)',
                              border: '1px solid rgba(230,237,253,0.42)',
                              boxShadow: '0 8px 18px -10px rgba(7,16,57,0.9)',
                            }
                          : {
                              background: 'rgba(175,197,248,0.14)',
                              border: '1px solid rgba(230,237,253,0.28)',
                            }
                      }
                    >
                      {!mine && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6E92F2] mb-1">
                          Mr Sad · Admin
                        </p>
                      )}
                      <p className="text-[13px] leading-relaxed text-[#E6EDFD] whitespace-pre-wrap break-words">
                        {msg.body}
                      </p>
                      <p className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#AFC5F8]/75">
                        {pending ? 'Sending…' : formatClock(msg.createdAt)}
                        {mine && !pending && <CheckCheck className="w-3 h-3" />}
                        {!mine && !pending && <Check className="w-3 h-3" />}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSend}
        className="px-3 py-3 flex items-end gap-2"
        style={{ borderTop: '1px solid rgba(175,197,248,0.22)', background: 'rgba(7,16,57,0.5)' }}
      >
        <textarea
          ref={composerRef}
          value={draft}
          rows={1}
          maxLength={MAX_CHARS}
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Type a message…"
          className="flex-1 resize-none px-3.5 py-2.5 rounded-2xl text-[13px] text-[#E6EDFD] placeholder-[#AFC5F8]/60 focus:outline-none focus:ring-2 focus:ring-[#6E92F2] max-h-[120px]"
          style={{ background: 'rgba(7,16,57,0.8)', border: '1px solid rgba(175,197,248,0.35)' }}
        />
        <button
          type="submit"
          disabled={isSending || !draft.trim()}
          aria-label="Send message"
          className="shrink-0 p-3 rounded-2xl text-[#E6EDFD] transition-ui cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #2E5DE6 0%, #6E92F2 100%)',
            border: '1px solid rgba(230,237,253,0.5)',
            boxShadow: '0 8px 18px -8px rgba(46,93,230,0.8)',
          }}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
