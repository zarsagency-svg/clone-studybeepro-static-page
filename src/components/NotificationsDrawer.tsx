import { lazy, Suspense, useState } from 'react';
import { Heart, X, CheckCircle2, MessageCircle } from 'lucide-react';
import { GlassChatBubbleIcon } from './GlassIcons3D';
import type { NotificationItem } from '../types/notifications';

let chatModule: Promise<typeof import('./ChatWithAdmin')> | null = null;
function loadChat() {
  chatModule ??= import('./ChatWithAdmin').catch((error) => {
    chatModule = null;
    throw error;
  });
  return chatModule;
}
const ChatWithAdmin = lazy(loadChat);

type DrawerTab = 'updates' | 'chat';

interface NotificationsDrawerProps {
  isVisible: boolean;
  isLoading: boolean;
  messages: NotificationItem[];
  errorMsg: string;
  isLiking: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onToggleLike: (item: NotificationItem) => Promise<void>;
}

const formatTime = (ts: number) => {
    if (!ts) return 'Just now';
    try {
      return new Date(ts).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Just now';
    }
  };

export default function NotificationsDrawer({
  isVisible,
  isLoading,
  messages,
  errorMsg,
  isLiking,
  onClose,
  onRefresh,
  onToggleLike,
}: NotificationsDrawerProps) {
  const visible = isVisible;
  const [activeTab, setActiveTab] = useState<DrawerTab>('updates');
  const [chatUnread, setChatUnread] = useState(0);

  return (
        <div
          id="inbox-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="updates-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className={`drawer-overlay fixed inset-0 z-[60] flex justify-end p-0 sm:p-4 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'rgba(7, 16, 57, 0.68)',
            backdropFilter: 'var(--glass-overlay-filter)',
            WebkitBackdropFilter: 'var(--glass-overlay-filter)',
          }}
        >
          <div
            id="inbox-content"
            className={`drawer-panel relative w-full sm:w-[430px] h-full sm:rounded-[28px] overflow-hidden flex flex-col ${
              visible ? 'translate-x-0 scale-100' : 'translate-x-full sm:scale-95'
            }`}
            style={{
              background:
                'linear-gradient(165deg, rgba(15,34,112,0.88) 0%, rgba(7,16,57,0.95) 60%, rgba(7,16,57,0.98) 100%)',
              border: '1.5px solid rgba(175,197,248,0.35)',
              boxShadow:
                '-20px 0 60px rgba(7,16,57,0.9), 0 0 40px rgba(46,93,230,0.28), inset 0 1.5px 2px rgba(230,237,253,0.35)',
            }}
          >
            {/* Ambient decorative Ultramarine orb inside drawer */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(46,93,230,0.38) 0%, transparent 72%)' }}
            />
            <div
              className="pointer-events-none absolute bottom-10 -left-20 w-56 h-56 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(110,146,242,0.22) 0%, transparent 72%)' }}
            />

            {/* Drawer Header with Dual-Layer Frosted Glass */}
            <div
              className="relative z-10 p-5 flex items-center justify-between"
              style={{
                background:
                  'linear-gradient(180deg, rgba(175,197,248,0.16) 0%, rgba(26,59,176,0.12) 100%)',
                borderBottom: '1px solid rgba(175,197,248,0.22)',
              }}
            >
              <div className="flex items-center gap-3.5">
                <GlassChatBubbleIcon className="w-12 h-12" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="updates-title" className="text-[#E6EDFD] font-display font-bold text-lg tracking-tight">
                      {activeTab === 'chat' ? 'Chat with Admin' : 'Updates'}
                    </h2>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#E6EDFD]"
                      style={{
                        background: 'rgba(46,93,230,0.45)',
                        border: '1px solid rgba(175,197,248,0.4)',
                      }}
                    >
                      Live
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close Inbox"
                  className="p-2 rounded-full text-[#AFC5F8] hover:text-[#E6EDFD] hover:bg-[#E6EDFD]/15 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab bar: announcements feed vs. direct chat with the admin */}
            <div
              className="relative z-10 px-4 sm:px-5 pt-3.5 pb-3 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(175,197,248,0.22)' }}
            >
              {(
                [
                  { id: 'updates' as const, label: 'Updates', badge: 0 },
                  { id: 'chat' as const, label: 'Chat with Admin', badge: chatUnread },
                ]
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-pressed={active}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-ui duration-200 cursor-pointer ${
                      active ? 'text-[#E6EDFD]' : 'text-[#AFC5F8] hover:text-[#E6EDFD]'
                    }`}
                    style={{
                      background: active
                        ? 'linear-gradient(135deg, #2E5DE6 0%, #6E92F2 100%)'
                        : 'rgba(15,34,112,0.5)',
                      border: active
                        ? '1px solid rgba(230,237,253,0.6)'
                        : '1px solid rgba(175,197,248,0.28)',
                      boxShadow: active ? '0 4px 14px rgba(46,93,230,0.5)' : 'none',
                    }}
                  >
                    {tab.id === 'chat' && <MessageCircle className="w-3.5 h-3.5" />}
                    <span>{tab.label}</span>
                    {tab.badge > 0 && (
                      <span
                        className="min-w-[18px] h-[18px] px-1 rounded-full grid place-items-center text-[10px] font-bold text-[#071039]"
                        style={{ background: '#AFC5F8', border: '1px solid rgba(230,237,253,0.7)' }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Messages Container */}
            <div
              className={activeTab === 'updates' ? 'relative z-10 flex-1 flex flex-col min-h-0' : 'hidden'}
            >
            <div
              id="messages-container"
              className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 no-scrollbar"
            >
              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-2xl p-3.5 text-sm text-[#E6EDFD] flex items-center justify-between"
                  style={{
                    background: 'rgba(46,93,230,0.25)',
                    border: '1px solid rgba(175,197,248,0.4)',
                  }}
                >
                  <span>{errorMsg}</span>
                  <button
                    type="button"
                    onClick={onRefresh}
                    className="underline font-semibold ml-2 cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              )}

              {isLoading && messages.length === 0 ? (
                <div id="loading-indicator" className="flex flex-col gap-4">
                  <div className="w-full h-36 rounded-3xl bg-[#1A3BB0]/30 border border-[#6E92F2]/25 animate-pulse" />
                  <div className="w-full h-28 rounded-3xl bg-[#1A3BB0]/20 border border-[#6E92F2]/20 animate-pulse" />
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isLiked = msg.liked;
                  return (
                    <div
                      key={msg.id}
                      className="group relative pt-3 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      {/* BACK LAYER OF THE DUAL-GLASS CARD (Replicates ref2.jpg / ref3_real.png tilted accent plate peeking from behind the frosted front!) */}
                      <div
                        className="pointer-events-none absolute top-0 left-3 right-6 h-10 rounded-t-2xl transition-transform duration-200 group-hover:-translate-y-0.5"
                        style={{
                          transform: index % 2 === 0 ? 'rotate(-1.2deg)' : 'rotate(1.2deg)',
                          background:
                            'linear-gradient(90deg, #2E5DE6 0%, #6E92F2 55%, #1A3BB0 100%)',
                          boxShadow: '0 4px 16px rgba(46,93,230,0.45)',
                          border: '1px solid rgba(230,237,253,0.45)',
                        }}
                      />

                      {/* FRONT LAYER: FROSTED GLASSMORPHISM POCKET CARD */}
                      <div
                        className="relative z-10 rounded-[22px] p-4 sm:p-5 overflow-hidden"
                        style={{
                          background:
                            'var(--notification-card-background)',
                          backdropFilter: 'var(--glass-soft-filter)',
                          WebkitBackdropFilter: 'var(--glass-soft-filter)',
                          borderTop: '1.5px solid rgba(230,237,253,0.55)',
                          borderLeft: '1px solid rgba(230,237,253,0.35)',
                          borderRight: '1px solid rgba(175,197,248,0.25)',
                          borderBottom: '1.5px solid rgba(7,16,57,0.8)',
                          boxShadow:
                            '0 14px 30px -8px rgba(7,16,57,0.7), inset 0 1.5px 2px rgba(230,237,253,0.35)',
                        }}
                      >
                        {/* Admin Identity Row */}
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-display font-bold text-xs text-[#E6EDFD]"
                            style={{
                              background:
                                'linear-gradient(135deg, #2E5DE6 0%, #1A3BB0 100%)',
                              border: '1px solid rgba(230,237,253,0.5)',
                              boxShadow: '0 4px 10px rgba(46,93,230,0.45)',
                            }}
                          >
                            MS
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#AFC5F8] font-bold text-xs tracking-wider uppercase">
                                Mr Sad · Admin
                              </span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#6E92F2] shrink-0" />
                            </div>
                            <time className="block mt-0.5 text-[10px] sm:text-[11px] font-medium text-[#AFC5F8]">
                              {formatTime(msg.createdAt)}
                            </time>
                          </div>
                        </div>

                        {msg.title && (
                          <h3 className="text-[#E6EDFD] font-display font-bold text-[15px] mb-1.5 leading-snug">
                            {msg.title}
                          </h3>
                        )}

                        <p className="text-[#E6EDFD]/85 text-[13.5px] leading-relaxed whitespace-pre-wrap">
                          {msg.text}
                        </p>

                        {msg.imageUrl && (
                          <img src={msg.imageUrl} alt="Image attached to notification" loading="lazy" decoding="async"
                            className="notification-image mt-3 w-full h-auto rounded-xl border border-white/20" />
                        )}

                        {/* Action Bar */}
                        <div
                          className="mt-4 pt-3 flex items-center justify-between"
                          style={{
                            borderTop: '1px solid rgba(175,197,248,0.2)',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => onToggleLike(msg)}
                            disabled={isLiking}
                            aria-pressed={isLiked}
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-ui duration-200 cursor-pointer ${
                              isLiked
                                ? 'text-[#E6EDFD] scale-105'
                                : 'text-[#AFC5F8] hover:text-[#E6EDFD]'
                            }`}
                            style={{
                              background: isLiked
                                ? 'linear-gradient(135deg, #2E5DE6 0%, #6E92F2 100%)'
                                : 'rgba(15,34,112,0.55)',
                              border: isLiked
                                ? '1px solid rgba(230,237,253,0.65)'
                                : '1px solid rgba(175,197,248,0.28)',
                              boxShadow: isLiked
                                ? '0 4px 14px rgba(46,93,230,0.55)'
                                : 'none',
                            }}
                          >
                            <Heart
                              className={`w-3.5 h-3.5 transition-transform ${
                                isLiked ? 'fill-current scale-110' : ''
                              }`}
                            />
                            <span>{msg.likes || 0} Likes</span>
                          </button>

                          <span className="text-[11px] font-medium text-[#AFC5F8]/75">
                            MIND SPARK Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            </div>

            {/* WhatsApp-style chat with the admin (Google sign-in required) */}
            <div
              className={
                activeTab === 'chat'
                  ? 'relative z-10 flex-1 flex flex-col min-h-0'
                  : 'hidden'
              }
            >
              <Suspense
                fallback={
                  <div className="p-6 space-y-3">
                    <div className="h-14 w-2/3 rounded-2xl bg-[#1A3BB0]/30 border border-[#6E92F2]/25 animate-pulse" />
                    <div className="h-12 w-1/2 ml-auto rounded-2xl bg-[#1A3BB0]/20 border border-[#6E92F2]/20 animate-pulse" />
                  </div>
                }
              >
                <ChatWithAdmin
                  isActive={activeTab === 'chat'}
                  onUnreadChange={setChatUnread}
                />
              </Suspense>
            </div>
          </div>
        </div>
  );
}
