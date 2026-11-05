import { useEffect, useState } from 'react';
import {
  Bell,
  X,
  Send,
  ArrowRight,
  Heart,
  Inbox,
} from 'lucide-react';

interface PlatformItem {
  id: number;
  name: string;
  href?: string;
  title: string;
  imgSrc: string;
  imgAlt: string;
  objectFit: 'contain' | 'cover';
  overflowHidden?: boolean;
  delayMs: number;
}

interface AdminMessage {
  id: string;
  title?: string;
  text: string;
  createdAt: number;
  likes: number;
}

const MIND_SPARK_LOGO = '/mind-spark-logo.jpeg';

const PLATFORMS: PlatformItem[] = [
  {
    id: 1,
    name: 'Next Toppers',
    href: 'https://xhashikstudy-nt.vercel.app/',
    title: 'Next Toppers - MIND SPARK',
    imgSrc: 'https://i.ibb.co/Lzkbgnhz/IMG-4138.png',
    imgAlt: 'Next Toppers Logo',
    objectFit: 'contain',
    delayMs: 500,
  },
  {
    id: 2,
    name: 'Vidyagram',
    title: 'Vidyagram on MIND SPARK Ecosystem',
    imgSrc: 'https://i.ibb.co/jkHpx8mY/IMG-5932.png',
    imgAlt: 'Vidyagram Logo',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 550,
  },
  {
    id: 3,
    name: 'Mission Jeet',
    title: 'Mission Jeet on MIND SPARK',
    imgSrc: 'https://i.ibb.co/R4gdNrGJ/IMG-4136.png',
    imgAlt: 'Mission Jeet - MIND SPARK',
    objectFit: 'contain',
    delayMs: 600,
  },
  {
    id: 4,
    name: 'S & F',
    title: 'S & F on MIND SPARK',
    imgSrc: 'https://i.ibb.co/Hf3Q02xR/IMG-5991.jpg',
    imgAlt: 'S & F Logo',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 650,
  },
  {
    id: 5,
    name: 'Yes Officer',
    title: 'Yes Officer on MIND SPARK',
    imgSrc: 'https://i.ibb.co/8gVcx0RF/IMG-5939.webp',
    imgAlt: 'Yes Officer Logo',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 700,
  },
  {
    id: 6,
    name: 'Bee Books',
    title: 'Bee Books by MIND SPARK',
    imgSrc: 'https://i.ibb.co/S4NNmf24/IMG-4274.png',
    imgAlt: 'Bee Books - MIND SPARK Edu',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 750,
  },
  {
    id: 7,
    name: 'Futurekul',
    title: 'Futurekul available on MIND SPARK',
    imgSrc: 'https://i.ibb.co/676BfqX6/IMG-4571.jpg',
    imgAlt: 'Futurekul - MIND SPARK',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 850,
  },
  {
    id: 8,
    name: 'Master Sahab',
    title: 'Master Sahab on MIND SPARK Ecosystem',
    imgSrc: 'https://i.ibb.co/JRNh3xd3/IMG-4611.webp',
    imgAlt: 'Master Sahab - MIND SPARK Aura',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 900,
  },
  {
    id: 9,
    name: 'UNC Offline',
    title: 'UNC Offline via MIND SPARK Mod',
    imgSrc: MIND_SPARK_LOGO,
    imgAlt: 'UNC Offline - MIND SPARK Mod',
    objectFit: 'cover',
    delayMs: 950,
  },
  {
    id: 10,
    name: 'UNC',
    title: 'UNC available on MIND SPARK',
    imgSrc: MIND_SPARK_LOGO,
    imgAlt: 'UNC - MIND SPARK',
    objectFit: 'cover',
    delayMs: 1000,
  },
  {
    id: 11,
    name: 'Rojgar W/ Ankit',
    title: 'Rojgar With Ankit on MIND SPARK',
    imgSrc: 'https://i.ibb.co/rPSSc1D/IMG-4132.png',
    imgAlt: 'Rojgar With Ankit - MIND SPARK Platform',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 1050,
  },
  {
    id: 12,
    name: 'Selection Bee',
    title: 'Selection Bee by MIND SPARK',
    imgSrc: 'https://i.ibb.co/F4yHhxyF/IMG-4135.png',
    imgAlt: 'Selection Bee - MIND SPARK Edu',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 1100,
  },
  {
    id: 13,
    name: 'Vibrant Academy',
    title: 'Vibrant Academy in MIND SPARK Aura',
    imgSrc: 'https://i.ibb.co/LdRFR4WG/IMG-4218.png',
    imgAlt: 'Vibrant Academy - MIND SPARK',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 1150,
  },
  {
    id: 14,
    name: 'Physics Wallah',
    title: 'Physics Wallah on MIND SPARK Platform',
    imgSrc: 'https://i.ibb.co/h1YdY795/IMG-4134.png',
    imgAlt: 'Physics Wallah - MIND SPARK Mod',
    objectFit: 'contain',
    delayMs: 1200,
  },
  {
    id: 15,
    name: 'Sachin Academy',
    title: 'Sachin Academy on MIND SPARK Platform',
    imgSrc: 'https://i.ibb.co/bj3D47PC/IMG-5822.jpg',
    imgAlt: 'Sachin Academy - MIND SPARK',
    objectFit: 'cover',
    overflowHidden: true,
    delayMs: 1250,
  },
];

const FALLBACK_MESSAGES: AdminMessage[] = [
  {
    id: '0VKP1ayzTJyARgKRrkls',
    title: 'Kesa hai mere bacha',
    text: 'padhai achi chal rhi hai nah baby 💋🤭',
    createdAt: 1786880487809,
    likes: 12310,
  },
];

export function App() {
  const [unreadCount, setUnreadCount] = useState<number>(1);
  const [subscribersCount, setSubscribersCount] = useState<number | null>(null);
  const [isInboxMounted, setIsInboxMounted] = useState(false);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [hasLoadedMessages, setHasLoadedMessages] = useState(false);
  const [messages, setMessages] = useState<AdminMessage[]>(FALLBACK_MESSAGES);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>(() => {
    try {
      const initial: Record<string, boolean> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('liked_')) {
          const docId = key.replace('liked_', '');
          initial[docId] = true;
        }
      }
      return initial;
    } catch {
      return {};
    }
  });

  // Check notifications from noti.json on load (matching the live site)
  useEffect(() => {
    async function checkNotifications() {
      try {
        const response = await fetch('noti.json?v=' + new Date().getTime());
        if (response.ok) {
          const data = await response.json();
          const count = parseInt(data.count, 10) || 0;
          setUnreadCount(count);
        }
      } catch {
        // Keep default unread badge of 1 matching live site
      }
    }
    checkNotifications();
  }, []);

  // Fetch the real MIND SPARK Telegram subscriber count from our own endpoint.
  // Kept server-side: Telegram blocks browser requests to t.me (CORS), and any
  // bot token must never be shipped to the client.
  useEffect(() => {
    async function fetchLiveSubscribers() {
      try {
        const res = await fetch('/api/subscribers');
        if (res.ok) {
          const data = await res.json();
          if (Number.isFinite(data.count)) {
            setSubscribersCount(data.count as number);
          }
        }
      } catch {
        // Static hosting without /api: show the neutral fallback below.
      }
    }
    fetchLiveSubscribers();
  }, []);

  // Fetch live adminMessages from Firestore REST API when inbox opens
  const loadFirestoreMessages = async () => {
    if (hasLoadedMessages) return;
    setMessagesLoading(true);
    try {
      const res = await fetch(
        'https://firestore.googleapis.com/v1/projects/omni-xx/databases/(default)/documents/adminMessages'
      );
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.documents) && data.documents.length > 0) {
          const parsed: AdminMessage[] = data.documents.map((docSnap: any) => {
            const parts = String(docSnap.name || '').split('/');
            const id = parts[parts.length - 1] || 'msg';
            const fields = docSnap.fields || {};
            const title = fields.title?.stringValue || '';
            const text =
              fields.message?.stringValue || fields.text?.stringValue || '';
            const createdAt = Number(
              fields.createdAt?.integerValue ||
                fields.createdAt?.stringValue ||
                Date.now()
            );
            const likes = Number(
              fields.likes?.integerValue || fields.likes?.doubleValue || 0
            );
            return { id, title, text, createdAt, likes };
          });
          parsed.sort((a, b) => b.createdAt - a.createdAt);
          setMessages(parsed);
        }
      }
    } catch {
      // Keep fallback messages
    } finally {
      setMessagesLoading(false);
      setHasLoadedMessages(true);
    }
  };

  const toggleInbox = () => {
    if (!isInboxMounted) {
      loadFirestoreMessages();
      setIsInboxMounted(true);
      setUnreadCount(0);
      setTimeout(() => {
        setIsInboxOpen(true);
      }, 10);
    } else {
      setIsInboxOpen(false);
      setTimeout(() => {
        setIsInboxMounted(false);
      }, 300);
    }
  };

  const handleToggleLike = (msgId: string) => {
    const currentlyLiked = !!likedIds[msgId];
    const nextLiked = !currentlyLiked;

    setLikedIds((prev) => {
      const updated = { ...prev };
      if (nextLiked) {
        updated[msgId] = true;
      } else {
        delete updated[msgId];
      }
      return updated;
    });

    try {
      if (nextLiked) {
        localStorage.setItem(`liked_${msgId}`, 'true');
      } else {
        localStorage.removeItem(`liked_${msgId}`);
      }
    } catch {
      // ignore storage errors
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, likes: Math.max(0, m.likes + (nextLiked ? 1 : -1)) }
          : m
      )
    );
  };

  const formatMessageDate = (createdAt?: number) => {
    if (!createdAt) return 'Just now';
    try {
      return new Date(createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="min-h-[100dvh] selection:bg-red-500/40 selection:text-white relative flex flex-col items-center pb-10">
      {/* Hidden SEO Content to boost rankings for specific keywords */}
      <div className="seo-hidden-text">
        <h1>MIND SPARK - The Ultimate Free Education Platform</h1>
        <p>
          Welcome to MIND SPARK, where education must be free for everyone.
          MIND SPARK brings together premium batches, live classes, notes and
          study resources in one place. Explore the MIND SPARK ecosystem and
          learn from the best teachers, completely free.
        </p>
        <h2>Why Choose MIND SPARK?</h2>
        <p>
          MIND SPARK offers comprehensive study material for every stream and
          every competitive exam. Whether you are preparing for board exams,
          CUET or competitive tests, MIND SPARK keeps quality content free and
          accessible. Join the MIND SPARK community today.
        </p>
        <h3>Platforms in the MIND SPARK Ecosystem</h3>
        <ul>
          <li>MIND SPARK Next Toppers - Ultimate exam preparation.</li>
          <li>Vidyagram - Free learning platform.</li>
          <li>Yes Officer - Premium preparation.</li>
          <li>Mission Jeet, Bee Books, Futurekul and Master Sahab.</li>
          <li>UNC Offline, Rojgar With Ankit and Selection Bee.</li>
          <li>Vibrant Academy, Physics Wallah and Sachin Academy.</li>
        </ul>
        <p>
          Whenever you need free education, think MIND SPARK. All your favourite
          educators and platforms, together under one roof.
        </p>
      </div>

      {/* Red ambient glow (top & center) */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[300px] sm:h-[400px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none z-[-1]" />
      <div className="fixed top-[40%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[800px] h-[400px] sm:h-[600px] bg-red-700/10 rounded-full blur-[150px] pointer-events-none z-[-1]" />

      {/* Admin Inbox Button (Top Right) */}
      <button
        onClick={toggleInbox}
        className="fixed top-5 right-4 sm:top-8 sm:right-8 z-40 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-3 rounded-full shadow-lg hover:bg-zinc-800 transition-colors group cursor-pointer"
        aria-label="Admin Notifications"
      >
        <Bell
          id="notification-bell-icon"
          className={`w-6 h-6 text-red-500 group-hover:scale-110 transition-transform ${
            unreadCount > 0 ? 'animate-bell-ring' : ''
          }`}
        />
        {/* Notification Badge (Red Dot with Number) */}
        {unreadCount > 0 && (
          <span
            id="unread-badge"
            className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-[0_0_8px_rgba(239,68,68,0.8)] border border-black px-1"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Admin Inbox Modal */}
      {isInboxMounted && (
        <div
          id="inbox-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) toggleInbox();
          }}
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 flex justify-end ${
            isInboxOpen ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            id="inbox-content"
            className={`w-full sm:w-[400px] h-full bg-[#0a0a0a] border-l border-red-500/20 shadow-2xl flex flex-col transform transition-transform duration-300 ${
              isInboxOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#121212]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-red-400/30 bg-zinc-950 p-0.5 overflow-hidden flex items-center justify-center">
                  <img
                    src={MIND_SPARK_LOGO}
                    alt="MIND SPARK Official Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h2 className="text-white font-display font-bold text-lg">
                  MIND SPARK Updates
                </h2>
              </div>
              <button
                onClick={toggleInbox}
                className="text-zinc-400 hover:text-white p-2 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                aria-label="Close Inbox"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages List */}
            <div
              id="messages-container"
              className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar"
            >
              {messagesLoading ? (
                <div id="loading-indicator" className="flex flex-col gap-4">
                  <div className="w-full h-24 bg-zinc-800/50 rounded-xl animate-pulse" />
                  <div className="w-full h-24 bg-zinc-800/50 rounded-xl animate-pulse" />
                  <div className="w-full h-24 bg-zinc-800/50 rounded-xl animate-pulse" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  <Inbox className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No new messages from MIND SPARK Admin</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isLiked = !!likedIds[msg.id];
                  return (
                    <div
                      key={msg.id}
                      className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 hover:bg-zinc-800/80 transition-colors flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full border border-red-400/30 overflow-hidden shrink-0 bg-zinc-950">
                          <img
                            src={MIND_SPARK_LOGO}
                            alt="MIND SPARK Admin Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-red-400 font-semibold text-xs tracking-wider uppercase">
                          MIND SPARK Admin
                        </span>
                        <span className="text-zinc-600 text-[10px] ml-auto">
                          {formatMessageDate(msg.createdAt)}
                        </span>
                      </div>

                      {msg.title ? (
                        <h3 className="text-white font-medium text-sm mb-1">
                          {msg.title}
                        </h3>
                      ) : null}

                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>

                      <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center">
                        <button
                          onClick={() => handleToggleLike(msg.id)}
                          className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            isLiked
                              ? 'text-red-500'
                              : 'text-zinc-400 hover:text-red-400'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isLiked ? 'fill-current' : ''
                            }`}
                          />
                          <span>{msg.likes || 0} Likes</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-5xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center relative z-10 flex-1">
        {/* Header Section */}
        <header className="text-center mb-6 w-full flex-shrink-0 relative">
          {/* Logo */}
          <div
            className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 animate-pop-in"
            style={{ animationDelay: '50ms' }}
          >
            <div className="animate-levitate w-full h-full relative">
              <div className="absolute inset-[-4px] rounded-full bg-red-500/40 blur-[14px]" />
              <div className="relative w-full h-full bg-zinc-950 rounded-full p-1 z-10 border border-red-500/40">
                <img
                  src={MIND_SPARK_LOGO}
                  alt="MIND SPARK Official Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
          </div>

          {/* Welcome Title */}
          <h1
            className="text-[2.5rem] sm:text-[3.5rem] font-display font-bold text-white mb-2 leading-[1.1] flex flex-col items-center justify-center animate-pop-in drop-shadow-2xl"
            style={{ animationDelay: '150ms' }}
          >
            <span>Welcome to</span>
            <span className="text-red-500 mt-1">MIND SPARK</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-zinc-300 font-display text-sm sm:text-base mt-4 font-medium tracking-wide animate-pop-in"
            style={{ animationDelay: '250ms' }}
          >
            Education Must Be{' '}
            <span className="text-red-500 font-bold">Free</span> For Everyone
          </p>
        </header>

        {/* Permanent Telegram Join Banner */}
        <div
          className="w-full max-w-sm sm:max-w-md mx-auto mb-10 animate-pop-in"
          style={{ animationDelay: '350ms' }}
        >
          <a
            href="https://t.me/zarsstudy"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group block p-[1px] rounded-[1.25rem] bg-gradient-to-b from-red-400/40 to-transparent hover:from-red-500/70 hover:to-red-700/10 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.12)] hover:shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:-translate-y-1"
          >
            <div className="bg-[#0a0a0c] backdrop-blur-md rounded-[19px] p-4 sm:p-5 flex items-center justify-between overflow-hidden relative border border-zinc-800">
              {/* BG Glow Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ef4444]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-red-500/10 group-hover:text-red-400 group-hover:border-red-500/30 transition-all">
                  <Send className="w-5 h-5 ml-0.5 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-[14px] sm:text-[15px] tracking-wide group-hover:text-[#ef4444] transition-colors">
                    Join Our Telegram
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.7)]" />
                    <span
                      id="live-count-display"
                      className="text-zinc-400 text-[10px] sm:text-[11px] font-medium font-mono uppercase tracking-wider"
                    >
                      {subscribersCount !== null ? (
                        <>
                          {subscribersCount.toLocaleString()}{' '}
                          <span className="hidden sm:inline">Members</span>
                          <span className="sm:hidden">Joined</span>
                        </>
                      ) : (
                        'Join the community'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:bg-red-600 group-hover:text-white transition-all relative z-10">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Platforms Grid */}
        <nav
          id="platforms-container"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full max-w-sm md:max-w-3xl lg:max-w-4xl mx-auto z-10"
          aria-label="MIND SPARK Platforms"
        >
          {PLATFORMS.map((platform) => {
            const isLive = Boolean(platform.href);
            const cardClasses =
              'p-5 rounded-3xl flex flex-col items-center justify-center gap-3 animate-pop-in border border-white/5';

            const content = (
              <>
                <div
                  className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-[1.25rem] border-2 ${
                    isLive ? 'border-red-500' : 'border-zinc-700'
                  } bg-zinc-950 p-1 flex items-center justify-center transition-all ${
                    isLive
                      ? 'group-hover:shadow-[0_0_15px_rgba(239,68,68,0.45)]'
                      : ''
                  } ${platform.overflowHidden ? 'overflow-hidden' : ''}`}
                >
                  <img
                    src={platform.imgSrc}
                    alt={platform.imgAlt}
                    className={`w-full h-full ${
                      platform.objectFit === 'contain'
                        ? 'object-contain'
                        : 'object-cover'
                    } rounded-xl ${isLive ? '' : 'opacity-60'}`}
                  />
                </div>
                <h2
                  className={`font-display font-bold text-[13px] sm:text-[15px] text-center tracking-wide transition-colors ${
                    isLive
                      ? 'text-white group-hover:text-red-500'
                      : 'text-zinc-400'
                  }`}
                >
                  {platform.name}
                </h2>
                {!isLive && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] text-red-400 bg-red-500/10 border border-red-500/25">
                    Coming Soon
                  </span>
                )}
              </>
            );

            if (isLive) {
              return (
                <a
                  key={platform.id}
                  href={platform.href}
                  title={platform.title}
                  className={`${cardClasses} bg-[#121212] platform-card cursor-pointer group`}
                  style={{ animationDelay: `${platform.delayMs}ms` }}
                >
                  {content}
                </a>
              );
            }

            /* Static, non-clickable placeholder - no link, no navigation */
            return (
              <div
                key={platform.id}
                title={`${platform.name} - Coming Soon`}
                aria-disabled="true"
                className={`${cardClasses} bg-[#101010] cursor-default select-none`}
                style={{ animationDelay: `${platform.delayMs}ms` }}
              >
                {content}
              </div>
            );
          })}
        </nav>
      </main>

      <footer
        className="w-full py-4 text-center mt-6 relative z-10 flex-shrink-0 animate-pop-in"
        style={{ animationDelay: '1300ms' }}
      >
        <p className="text-zinc-600 text-[10px] font-medium tracking-widest uppercase">
          © 2026 MIND SPARK
        </p>
        <div className="seo-hidden-text">
          MIND SPARK | MIND SPARK free education | MIND SPARK batches |
          MIND SPARK Next Toppers | Vidyagram | Yes Officer | S &amp; F
        </div>
      </footer>
    </div>
  );
}

export default App;
