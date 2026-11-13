import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ExternalLink, Menu, Sparkles, X } from 'lucide-react';
import { PLATFORMS } from './data/platforms';
import { PlatformFolderCard } from './components/PlatformFolderCard';
import { PlatformNeonCard } from './components/PlatformNeonCard';
import { NotificationsCenter } from './components/NotificationsCenter';
import {
  GlassChatBubbleIcon,
  GlassPlayIcon,
  GlassSearchIcon,
  GlassStreamIcon,
} from './components/GlassIcons3D';

const CUSTOM_COLOURS = [
  { name: 'Purple', value: '#a855f7' },
  { name: 'Violet', value: '#7542df' },
  { name: 'Pink', value: '#ed49bb' },
  { name: 'Orange', value: '#ed7b18' },
  { name: 'Turquoise', value: '#06b5ab' },
  { name: 'Magenta', value: '#ce36c8' },
] as const;

function colourHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  if (delta === 0) return 220;
  const h = max === r ? ((g - b) / delta) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
  return (h * 60 + 360) % 360;
}

export function App() {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [palette, setPalette] = useState<'blue' | 'red' | 'green' | 'custom'>(() => {
    try { const saved = localStorage.getItem('mindspark-palette'); return saved === 'red' || saved === 'green' || saved === 'custom' ? saved : 'blue'; }
    catch { return 'blue'; }
  });
  const [customColour, setCustomColour] = useState(() => {
    try {
      const saved = localStorage.getItem('mindspark-custom-colour');
      return CUSTOM_COLOURS.some((colour) => colour.value === saved?.toLowerCase()) ? saved!.toLowerCase() : '#a855f7';
    } catch { return '#a855f7'; }
  });
  const changeCustomColour = (colour: string) => {
    setCustomColour(colour);
    try { localStorage.setItem('mindspark-custom-colour', colour); } catch { /* use for this visit */ }
  };
  const hueShift = colourHue(customColour) - 220;
  const customStyle = { '--custom-colour': customColour, '--custom-hue-shift': `${hueShift}deg`, '--custom-hue-reverse': `${-hueShift}deg` } as CSSProperties;
  const choosePalette = (choice: 'blue' | 'red' | 'green' | 'custom') => {
    setPalette(choice);
    try { localStorage.setItem('mindspark-palette', choice); } catch { /* use for this visit */ }
  };

  const [cardStyle, setCardStyle] = useState<'folder' | 'card'>(() => {
    try { return localStorage.getItem('mindspark-platform-style') === 'card' ? 'card' : 'folder'; }
    catch { return 'folder'; }
  });
  const chooseCardStyle = (style: 'folder' | 'card') => {
    setCardStyle(style);
    try { localStorage.setItem('mindspark-platform-style', style); } catch { /* preference remains for this visit */ }
  };
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const customizeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isCustomizeOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!customizeRef.current?.contains(event.target as Node)) setIsCustomizeOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCustomizeOpen(false);
        customizeRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', onPointerDown); document.removeEventListener('keydown', onKeyDown); };
  }, [isCustomizeOpen]);
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
      className={`site-shell ${palette === 'red' ? 'theme-red' : palette === 'green' ? 'theme-green' : palette === 'custom' ? 'theme-custom' : ''} min-h-[100dvh] relative flex flex-col items-center pb-14 overflow-x-hidden`}
      style={customStyle}
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
      <div aria-hidden="true" className="ambient-glow fixed top-[-12%] left-1/2 -translate-x-1/2 w-[420px] sm:w-[760px] h-[340px] sm:h-[460px] rounded-full blur-[130px] pointer-events-none z-0" style={{ background: 'rgba(46,93,230,0.35)' }} />
      <div aria-hidden="true" className="ambient-glow fixed top-[38%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[900px] h-[420px] sm:h-[620px] rounded-full blur-[160px] pointer-events-none z-0" style={{ background: 'rgba(26,59,176,0.28)' }} />
      <div aria-hidden="true" className="ambient-glow fixed bottom-[-15%] left-1/4 w-[320px] sm:w-[520px] h-[320px] rounded-full blur-[140px] pointer-events-none z-0" style={{ background: 'rgba(110,146,242,0.16)' }} />

      {/* ============================================================
          REDESIGNED 3D GLASSMORPHIC NOTIFICATIONS & INBOX
      ============================================================ */}
      <div ref={customizeRef} className="fixed top-4 left-4 sm:top-6 sm:left-7 z-40">
        <button type="button" aria-label="Customise appearance" aria-expanded={isCustomizeOpen}
          aria-controls="customize-panel" onClick={() => setIsCustomizeOpen((open) => !open)}
          className="group relative flex items-center gap-2.5 p-1.5 sm:pr-4 rounded-2xl transition-ui duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ background: 'linear-gradient(145deg, rgba(175,197,248,0.28) 0%, rgba(46,93,230,0.32) 55%, rgba(15,34,112,0.75) 100%)', backdropFilter: 'var(--glass-filter)', WebkitBackdropFilter: 'var(--glass-filter)', border: '1px solid rgba(230,237,253,0.45)', boxShadow: '0 14px 32px -6px rgba(7,16,57,0.8), 0 0 20px rgba(46,93,230,0.35), inset 0 1.5px 2px rgba(230,237,253,0.5)' }}>
          <span className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-[#E6EDFD]" style={{ background: 'linear-gradient(145deg, rgba(175,197,248,.4), rgba(46,93,230,.35) 55%, rgba(15,34,112,.7))', border: '1px solid rgba(230,237,253,.4)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,.35), 0 5px 12px rgba(7,16,57,.4)' }}>
            <Menu aria-hidden="true" className="w-6 h-6" strokeWidth={2.3} />
          </span>
          <span className="hidden sm:flex flex-col items-start text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#AFC5F8] leading-none">Your</span>
            <span className="text-[13px] font-display font-bold text-[#E6EDFD] leading-tight mt-0.5">Style</span>
          </span>
        </button>
        {isCustomizeOpen && (
          <section id="customize-panel" aria-label="Customise appearance" className="absolute top-full left-0 mt-3 w-[min(290px,calc(100vw-2rem))] rounded-[22px] p-5 text-[#E6EDFD] max-h-[calc(100dvh-90px)] overflow-y-auto"
            style={{ background: 'linear-gradient(155deg, rgba(26,59,176,.96), rgba(7,16,57,.98))', border: '1px solid rgba(175,197,248,.4)', boxShadow: '0 18px 45px rgba(7,16,57,.8), inset 0 1px 2px rgba(230,237,253,.3)', backdropFilter: 'var(--glass-filter)' }}>
            <div className="flex items-center justify-between gap-3 mb-5">
              <h2 className="font-display font-bold text-base">Customise</h2>
              <button type="button" onClick={() => setIsCustomizeOpen(false)} aria-label="Close customisation" className="p-1 rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="palette-switch mb-5">
              <p className="text-xs font-semibold text-white/80 mb-2">Colour palette</p>
              <div role="group" aria-label="Choose colour palette" className="grid grid-cols-2 gap-1 p-1 rounded-2xl border border-white/30 bg-black/30">
                {(['blue', 'red', 'green', 'custom'] as const).map((colour) => (
                  <button key={colour} type="button" aria-pressed={palette === colour} onClick={() => choosePalette(colour)}
                    className={`flex flex-1 justify-center items-center gap-1 px-2 py-2 rounded-full text-xs font-bold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${palette === colour ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>
                    <span aria-hidden="true" className="w-3 h-3 rounded-full" style={{backgroundColor: colour === 'blue' ? '#2E5DE6' : colour === 'red' ? '#d00018' : colour === 'green' ? '#98BF0A' : customColour}} />{colour === 'blue' ? 'Blue' : colour === 'red' ? 'Red' : colour === 'green' ? 'Green' : 'Custom'}
                  </button>
                ))}
              </div>
              {palette === 'custom' && (
                <div className="mt-3 rounded-xl border border-white/25 bg-black/25 px-3 py-3">
                  <p className="mb-2 text-xs font-semibold text-white">Choose a colour</p>
                  <div role="group" aria-label="Choose custom colour" className="grid grid-cols-3 gap-2">
                    {CUSTOM_COLOURS.map((colour) => (
                      <button key={colour.value} type="button" aria-pressed={customColour === colour.value}
                        onClick={() => changeCustomColour(colour.value)}
                        className={`flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-semibold text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-white ${customColour === colour.value ? 'bg-white/20' : 'hover:bg-white/10'}`}>
                        <span aria-hidden="true" className={`h-7 w-7 rounded-full border-2 ${customColour === colour.value ? 'border-white' : 'border-white/30'}`} style={{ backgroundColor: colour.value }} />
                        {colour.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#AFC5F8] mb-2">Platform style</p>
              <div role="group" aria-label="Choose platform style" className="flex gap-1 p-1 rounded-full border border-[#AFC5F8]/30 bg-[#0F2270]/70">
                {(['folder', 'card'] as const).map((style) => (
                  <button key={style} type="button" aria-pressed={cardStyle === style} onClick={() => chooseCardStyle(style)}
                    className={`flex-1 px-3 py-2 rounded-full text-xs font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AFC5F8] ${cardStyle === style ? 'bg-[#6E92F2] text-[#071039]' : 'text-[#E6EDFD] hover:bg-white/10'}`}>
                    {style === 'folder' ? 'Folders' : 'Cards'}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
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
                          <span className="sm:hidden">Joined</span>
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
            cardStyle === 'folder' ? (
              <PlatformFolderCard key={item.id} item={item} priority={index < 2} onOpenModal={item.isModal ? openPwModal : undefined} />
            ) : (
              <PlatformNeonCard key={item.id} item={item} priority={index < 2} onOpenModal={item.isModal ? openPwModal : undefined} />
            )
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
        <p className="text-[#AFC5F8]/70 text-[11px] font-semibold tracking-[0.22em]">
          Sadik
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
