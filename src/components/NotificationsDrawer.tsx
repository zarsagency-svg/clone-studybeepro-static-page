import { useEffect, useState } from 'react';
import { Heart, Sparkles, X, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GlassChatBubbleIcon } from './GlassIcons3D';
import type { NotificationItem } from '../types/notifications';

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
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const visible = isVisible && entered;

  return (
        <div
          id="inbox-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="updates-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className={`fixed inset-0 z-[60] flex justify-end p-0 sm:p-4 transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'rgba(7, 16, 57, 0.68)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <div
            id="inbox-content"
            className={`relative w-full sm:w-[430px] h-full sm:rounded-[28px] overflow-hidden flex flex-col transform transition-all duration-300 ${
              visible ? 'translate-x-0 scale-100' : 'translate-x-full sm:scale-95'
            }`}
            style={{
              background:
                'linear-gradient(165deg, rgba(15,34,112,0.88) 0%, rgba(7,16,57,0.95) 60%, rgba(7,16,57,0.98) 100%)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1.5px solid rgba(175,197,248,0.35)',
              boxShadow:
                '-20px 0 60px rgba(7,16,57,0.9), 0 0 40px rgba(46,93,230,0.28), inset 0 1.5px 2px rgba(230,237,253,0.35)',
            }}
          >
            {/* Ambient decorative Ultramarine orb inside drawer */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[70px]"
              style={{ background: 'rgba(46, 93, 230, 0.38)' }}
            />
            <div
              className="pointer-events-none absolute bottom-10 -left-20 w-56 h-56 rounded-full blur-[80px]"
              style={{ background: 'rgba(110, 146, 242, 0.22)' }}
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
                      MIND SPARK Updates
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
                  <p className="text-xs text-[#AFC5F8] mt-0.5">
                    Official Broadcasts · Free Education Ecosystem
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onRefresh}
                  title="Refresh Updates"
                  className="p-2 rounded-full text-[#AFC5F8] hover:text-[#E6EDFD] hover:bg-[#E6EDFD]/10 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
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

            {/* Messages Container */}
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
                      className="group relative pt-3 transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      {/* BACK LAYER OF THE DUAL-GLASS CARD (Replicates ref2.jpg / ref3_real.png tilted accent plate peeking from behind the frosted front!) */}
                      <div
                        className="pointer-events-none absolute top-0 left-3 right-6 h-10 rounded-t-2xl transition-transform duration-300 group-hover:-translate-y-0.5"
                        style={{
                          transform: index % 2 === 0 ? 'rotate(-1.2deg)' : 'rotate(1.2deg)',
                          background:
                            'linear-gradient(90deg, #2E5DE6 0%, #6E92F2 55%, #1A3BB0 100%)',
                          boxShadow: '0 4px 16px rgba(46,93,230,0.45)',
                          border: '1px solid rgba(230,237,253,0.45)',
                        }}
                      >
                        <div className="px-3.5 py-1 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#E6EDFD] flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            {msg.tag || 'Admin Broadcast'}
                          </span>
                          <span className="text-[10px] font-medium text-[#E6EDFD]/90">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* FRONT LAYER: FROSTED GLASSMORPHISM POCKET CARD */}
                      <div
                        className="relative rounded-[22px] p-4 sm:p-5 overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(155deg, rgba(175,197,248,0.24) 0%, rgba(110,146,242,0.16) 45%, rgba(15,34,112,0.72) 100%)',
                          backdropFilter: 'blur(16px) saturate(170%)',
                          WebkitBackdropFilter: 'blur(16px) saturate(170%)',
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
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#AFC5F8] font-bold text-xs tracking-wider uppercase">
                                Mr Sad · Admin
                              </span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#6E92F2] shrink-0" />
                            </div>
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
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
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

            {/* Drawer Footer */}
            <div
              className="relative z-10 p-4 text-center"
              style={{
                background: 'rgba(7,16,57,0.75)',
                borderTop: '1px solid rgba(175,197,248,0.18)',
              }}
            >
              <a
                href="https://t.me/zarsstudy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#AFC5F8] hover:text-[#E6EDFD] transition-colors"
              >
                <span>Join @zarsstudy on Telegram for instant alerts</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
  );
}
