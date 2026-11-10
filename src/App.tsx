import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, ExternalLink, Sparkles, X } from 'lucide-react';
import { PLATFORMS } from './data/platforms';
import { PlatformFolderCard } from './components/PlatformFolderCard';
import { NotificationsCenter } from './components/NotificationsCenter';
import {
  GlassChatBubbleIcon,
  GlassPlayIcon,
  GlassSearchIcon,
  GlassStreamIcon,
} from './components/GlassIcons3D';

export function App() {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const openPwModal = useCallback(() => setIsPwModalOpen(true), []);

  useEffect(() => {
    let mounted = true;
    async function fetchSubscribers() {
      try {
        const res = await fetch('/api/subscribers');
        if (res.ok) {
          const data = await res.json();
          if (mounted && Number.isFinite(data.count)) {
            setSubscriberCount(data.count);
          }
        }
      } catch {
        // Keep the neutral community message if the count is unavailable.
      }
    }
    fetchSubscribers();
    return () => {
      mounted = false;
    };
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filteredPlatforms = PLATFORMS.filter((item) => {
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.metaText.toLowerCase().includes(q);
    return matchesSearch;
  });

  const mindSparkLetters = 'MIND SPARK'.split('');

  return (
    <div
      className="site-shell min-h-[100dvh] relative flex flex-col items-center pb-14 overflow-x-hidden"
    >
      {/* Hidden SEO Content from mindspark-all.vercel.app */}
      <div className="seo-hidden-text">
        <h1>MIND SPARK - The Ultimate Free Education Platform</h1>
        <p>
          Welcome to MIND SPARK, where education must be free for everyone. MIND SPARK brings
          together premium batches, live classes, notes and study resources in one place. Explore
          the MIND SPARK ecosystem and learn from the best teachers, completely free.
        </p>
        <h2>Why Choose MIND SPARK?</h2>
        <p>
          MIND SPARK offers comprehensive study material for every stream and every competitive
          exam. Whether you are preparing for board exams, CUET or competitive tests, MIND SPARK
          keeps quality content free and accessible. Join the MIND SPARK community today.
        </p>
        <h3>Platforms in the MIND SPARK Ecosystem</h3>
        <ul>
          <li>MIND SPARK Next Toppers - Ultimate exam preparation.</li>
          <li>Mission Jeet and Master Sahab.</li>
          <li>UNC Offline and UNC.</li>
          <li>Vibrant Academy and Physics Wallah.</li>
        </ul>
        <p>
          Whenever you need free education, think MIND SPARK. All your favourite educators and
          platforms, together under one roof.
        </p>
      </div>

      {/* Soft ambient glows, matching the reference background. */}
      <div aria-hidden="true" className="fixed top-[-12%] left-1/2 -translate-x-1/2 w-[420px] sm:w-[760px] h-[340px] sm:h-[460px] rounded-full blur-[130px] pointer-events-none z-0" style={{ background: 'rgba(46,93,230,0.35)' }} />
      <div aria-hidden="true" className="fixed top-[38%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[900px] h-[420px] sm:h-[620px] rounded-full blur-[160px] pointer-events-none z-0" style={{ background: 'rgba(26,59,176,0.28)' }} />
      <div aria-hidden="true" className="fixed bottom-[-15%] left-1/4 w-[320px] sm:w-[520px] h-[320px] rounded-full blur-[140px] pointer-events-none z-0" style={{ background: 'rgba(110,146,242,0.16)' }} />

      {/* ============================================================
          REDESIGNED 3D GLASSMORPHIC NOTIFICATIONS & INBOX
      ============================================================ */}
      <NotificationsCenter />

      {/* ============================================================
          MAIN CONTENT CONTAINER
      ============================================================ */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-18 sm:pt-22 xl:pt-8 pb-8 flex flex-col items-center justify-center relative z-10 flex-1">
        {/* ============================================================
            HERO HEADER: STATIC "MIND SPARK" NAME
        ============================================================ */}
        <header className="text-center mb-8 w-full flex-shrink-0 relative flex flex-col items-center">
          {/* Static Website Title: no looping animation or text glow */}
          <h1
            className="font-display font-extrabold leading-[1.08] flex flex-col items-center justify-center animate-pop-in select-none"
          >
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.32em] text-[#AFC5F8] mb-1.5 flex items-center gap-2">
              <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#6E92F2]" />
              <span>Welcome to</span>
              <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#6E92F2]" />
            </span>

            {/* MIND SPARK Name */}
            <span
              className="text-[clamp(1.5rem,7.5vw,4.6rem)] tracking-tight inline-flex flex-nowrap items-center justify-center gap-x-[2px]"
            >
              {mindSparkLetters.map((char, idx) =>
                char === ' ' ? (
                  <span key={idx} className="w-3 sm:w-4" />
                ) : (
                  <span
                    key={idx}
                    className="inline-block mindspark-gradient-text"
                  >
                    {char}
                  </span>
                )
              )}
            </span>
          </h1>

          {/* Subtitle with Frosted Glass "Free" Pill */}
          <p
            className="text-[#AFC5F8] font-display text-sm sm:text-base mt-3.5 font-medium tracking-wide animate-pop-in flex items-center justify-center flex-wrap gap-1.5"
          >
            <span>Education Must Be</span>
            <span
              className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full font-bold text-[#E6EDFD]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(110,146,242,0.38) 0%, rgba(46,93,230,0.55) 100%)',
                border: '1px solid rgba(230,237,253,0.5)',
                boxShadow:
                  '0 4px 16px rgba(46,93,230,0.45), inset 0 1px 1px rgba(230,237,253,0.45)',
                backdropFilter: 'var(--glass-filter)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E6EDFD]" />
              <span>Free</span>
            </span>
            <span>For Everyone</span>
          </p>
        </header>

        {/* ============================================================
            TELEGRAM COMMUNITY CARD WITH DUAL-LAYER FRONT GLASSMORPHISM
            Replicates ref2.jpg glassmorphism style + live subscriber count
        ============================================================ */}
        <div
          className="w-full max-w-md sm:max-w-lg mx-auto mb-8 animate-pop-in relative pt-2.5"
        >
          {/* Tilted Vivid Ultramarine Back Plate peeking behind the Frosted Glass Front */}
          <div
            className="pointer-events-none absolute top-0 inset-x-6 h-10 rounded-t-2xl"
            style={{
              transform: 'rotate(-1.3deg)',
              background: 'linear-gradient(90deg, #2E5DE6 0%, #6E92F2 50%, #1A3BB0 100%)',
              border: '1px solid rgba(230,237,253,0.45)',
              boxShadow: '0 8px 24px rgba(46,93,230,0.45)',
            }}
          />

          <a
            href="https://t.me/zarsstudy"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-[24px] p-4 sm:p-5 overflow-hidden transition-ui duration-200 hover:-translate-y-1"
            style={{
              background:
                'var(--community-background)',
              backdropFilter: 'var(--glass-filter)',
              WebkitBackdropFilter: 'var(--glass-filter)',
              borderTop: '1.5px solid rgba(230,237,253,0.62)',
              borderLeft: '1px solid rgba(230,237,253,0.38)',
              borderRight: '1px solid rgba(175,197,248,0.28)',
              borderBottom: '1.5px solid rgba(7,16,57,0.85)',
              boxShadow:
                '0 18px 40px -10px rgba(7,16,57,0.85), 0 0 28px rgba(46,93,230,0.28), inset 0 1.5px 2px rgba(230,237,253,0.45)',
            }}
          >
            {/* Shimmer Sweep */}
            <div
              className="desktop-sheen pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(230,237,253,0.22), transparent)',
              }}
            />

            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <GlassChatBubbleIcon className="w-12 h-12 sm:w-13 sm:h-13 shrink-0" />
                <div className="text-left">
                  <h3 className="text-[#E6EDFD] font-display font-bold text-[15px] sm:text-[17px] tracking-tight group-hover:text-white transition-colors">
                    Join Our Telegram
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-[#6E92F2] shadow-[0_0_8px_#6E92F2]" />
                    <span
                      id="live-count-display"
                      className="text-[#AFC5F8] text-[11px] sm:text-[12px] font-semibold font-mono uppercase tracking-wider"
                    >
                      {subscriberCount !== null ? (
                        <>
                          {subscriberCount.toLocaleString()}{' '}
                          <span className="hidden sm:inline">Members</span>
                          <span className="sm:hidden">Joined</span> · @zarsstudy
                        </>
                      ) : (
                        'Join the community'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-[#E6EDFD] transition-ui duration-200 group-hover:scale-110 group-hover:translate-x-0.5 shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #6E92F2 0%, #2E5DE6 100%)',
                  border: '1px solid rgba(230,237,253,0.55)',
                  boxShadow: '0 6px 16px rgba(46,93,230,0.55)',
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* ============================================================
            GLASSMORPHIC SEARCH BAR (ref2.jpg Search Glass Component)
        ============================================================ */}
        <div
          className="w-full max-w-4xl mx-auto mb-7 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 animate-pop-in"
        >
          {/* Search Input with ref2.jpg GlassSearchIcon */}
          <div
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-2xl sm:w-64"
            style={{
              background:
                'linear-gradient(145deg, rgba(175,197,248,0.18) 0%, rgba(15,34,112,0.58) 100%)',
              backdropFilter: 'var(--glass-filter)',
              border: '1px solid rgba(175,197,248,0.32)',
            }}
          >
            <GlassSearchIcon className="w-8 h-8 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find platform folder..."
              aria-label="Search MIND SPARK platforms"
              className="w-full bg-transparent text-xs sm:text-[13px] text-[#E6EDFD] placeholder-[#AFC5F8]/65 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear platform search"
                className="text-[#AFC5F8] hover:text-[#E6EDFD] p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ============================================================
            PLATFORMS FOLDER GRID (Replicates ref3_real.png 3D Glass Folder
            with tilted platform logo inside & frosted glass front pocket)
        ============================================================ */}
        <nav
          id="platforms-container"
          aria-label="MIND SPARK Platforms"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-4xl mx-auto z-10"
        >
          {filteredPlatforms.map((item, index) => (
            <PlatformFolderCard
              key={item.id}
              item={item}
              priority={index < 2}
              onOpenModal={item.isModal ? openPwModal : undefined}
            />
          ))}
        </nav>

        {filteredPlatforms.length === 0 && (
          <div
            className="w-full max-w-md mx-auto my-8 p-6 rounded-3xl text-center"
            style={{
              background: 'rgba(15, 34, 112, 0.45)',
              border: '1px solid rgba(175, 197, 248, 0.25)',
              backdropFilter: 'var(--glass-filter)',
            }}
          >
            <p className="text-sm text-[#E6EDFD] font-semibold">
              No platforms matched "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-full text-xs font-bold text-[#E6EDFD] bg-[#2E5DE6] hover:bg-[#1A3BB0] transition-colors cursor-pointer"
            >
              Show All 8 Folders
            </button>
          </div>
        )}
      </main>

      {/* ============================================================
          PHYSICS WALLAH SERVER SELECTION GLASSMORPHIC MODAL
      ============================================================ */}
      {isPwModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="physics-servers-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsPwModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: 'rgba(7, 16, 57, 0.76)',
            backdropFilter: 'var(--glass-overlay-filter)',
            WebkitBackdropFilter: 'var(--glass-overlay-filter)',
          }}
        >
          <div
            className="relative w-full max-w-md rounded-[28px] p-6 text-[#E6EDFD] overflow-hidden animate-pop-in"
            style={{
              background:
                'linear-gradient(160deg, rgba(46,93,230,0.32) 0%, rgba(15,34,112,0.88) 52%, rgba(7,16,57,0.96) 100%)',
              backdropFilter: 'var(--glass-filter)',
              WebkitBackdropFilter: 'var(--glass-filter)',
              border: '1.5px solid rgba(230,237,253,0.45)',
              boxShadow:
                '0 25px 60px -12px rgba(7,16,57,0.95), 0 0 40px rgba(46,93,230,0.35), inset 0 1.5px 2px rgba(230,237,253,0.45)',
            }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <GlassStreamIcon className="w-12 h-12 shrink-0" />
                <div>
                  <h2
                    id="physics-servers-title"
                    className="font-display text-xl font-bold text-[#E6EDFD]"
                  >
                    Physics Wallah
                  </h2>
                  <p className="mt-0.5 text-xs sm:text-sm text-[#AFC5F8]">
                    Choose a high-speed lecture server to continue
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close server selection"
                onClick={() => setIsPwModalOpen(false)}
                className="rounded-full p-2 text-[#AFC5F8] transition-colors hover:bg-[#E6EDFD]/15 hover:text-[#E6EDFD] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3.5">
              {[
                {
                  name: 'Server 1',
                  sub: 'Rex Lecture Player · Primary Stream',
                  href: 'https://rex-lecture-player.vercel.app/',
                  badge: 'Fastest',
                },
                {
                  name: 'Server 2',
                  sub: 'AryaVidya Mirror · Backup Stream',
                  href: 'https://stream.aryavidya.cc/index.php#/',
                  badge: 'Mirror',
                },
              ].map((srv, idx) => (
                <a
                  key={idx}
                  href={srv.href}
                  className="group relative flex items-center justify-between rounded-2xl p-4 transition-ui duration-200 hover:-translate-y-0.5"
                  style={{
                    background:
                      'linear-gradient(145deg, rgba(175,197,248,0.22) 0%, rgba(26,59,176,0.42) 100%)',
                    backdropFilter: 'var(--glass-filter)',
                    border: '1px solid rgba(230,237,253,0.38)',
                    boxShadow:
                      '0 10px 24px -6px rgba(7,16,57,0.65), inset 0 1px 1px rgba(230,237,253,0.35)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <GlassPlayIcon className="w-9 h-9 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-[15px] text-[#E6EDFD] group-hover:text-white">
                          {srv.name}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-[#E6EDFD]"
                          style={{
                            background: 'rgba(46,93,230,0.55)',
                            border: '1px solid rgba(230,237,253,0.35)',
                          }}
                        >
                          {srv.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#AFC5F8] mt-0.5">{srv.sub}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-[#AFC5F8] group-hover:text-[#E6EDFD] group-hover:translate-x-0.5 transition-ui" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer
        className="w-full py-5 text-center mt-4 relative z-10 flex-shrink-0 flex flex-col items-center gap-3 animate-pop-in"
      >
        <p className="text-[#AFC5F8]/70 text-[11px] font-semibold tracking-[0.22em] uppercase">
          © 2026 MIND SPARK
        </p>

        <div className="seo-hidden-text">
          MIND SPARK | MIND SPARK free education | MIND SPARK batches | MIND SPARK Next Toppers |
          Mission Jeet | UNC | Physics Wallah
        </div>
      </footer>
    </div>
  );
}

export default App;
