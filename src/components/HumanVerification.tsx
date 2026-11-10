import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';

type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const STORAGE_KEY = 'mindspark-human-verified';

function getSavedTheme() {
  try {
    const palette = localStorage.getItem('mindspark-palette');
    const colour = localStorage.getItem('mindspark-custom-colour');
    const validColours = ['#a855f7', '#7542df', '#ed49bb', '#ed7b18', '#06b5ab', '#ce36c8'];
    if (palette === 'red') return { name: 'theme-red', colour: '#d00018' };
    if (palette === 'green') return { name: 'theme-green', colour: '#98bf0a' };
    if (palette === 'custom') return { name: 'theme-custom', colour: colour && validColours.includes(colour.toLowerCase()) ? colour : '#a855f7' };
  } catch { /* use the default when browser storage is unavailable */ }
  return { name: '', colour: '#2e5de6' };
}


export function HumanVerification({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(() => { try { return sessionStorage.getItem(STORAGE_KEY) === 'yes'; } catch { return false; } });
  const [message, setMessage] = useState('Complete the check below to continue.');
  const [theme] = useState(getSavedTheme);
  const widget = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);

  useEffect(() => {
    if (verified) return;
    if (!SITE_KEY) { setMessage('Verification is not configured. Please contact the site administrator.'); return; }
    let active = true;
    let script = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
    const render = () => {
      if (!active || !widget.current || !window.turnstile || id.current) return;
      id.current = window.turnstile.render(widget.current, {
        sitekey: SITE_KEY,
        theme: 'dark',
        callback: async (token: string) => {
          setMessage('Checking your verification…');
          try {
            const res = await fetch('/api/verify-human', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
            const result = await res.json();
            if (res.ok && result.success === true) {
              try { sessionStorage.setItem(STORAGE_KEY, 'yes'); } catch { /* allow this page session */ }
              if (active) setVerified(true);
            } else { throw new Error('Verification rejected'); }
          } catch {
            if (active) { setMessage('Verification failed. Please try again.'); if (id.current) window.turnstile?.reset(id.current); }
          }
        },
        'error-callback': () => { if (active) setMessage('Unable to load verification. Please refresh the page or check your connection.'); },
        'expired-callback': () => { if (active) setMessage('Verification expired. Please try again.'); },
      });
    };
    if (!script) {
      script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.defer = true; script.dataset.turnstile = 'true'; document.head.appendChild(script);
    }
    script.addEventListener('load', render);
    const onError = () => { if (active) setMessage('Unable to load verification. Please refresh the page or check your connection.'); };
    script.addEventListener('error', onError);
    render();
    return () => { active = false; script?.removeEventListener('load', render); script?.removeEventListener('error', onError); if (id.current) { window.turnstile?.remove(id.current); id.current = null; } };
  }, [verified]);

  if (verified) return <>{children}</>;
  return <main className={`site-shell ${theme.name}`} style={{minHeight:'100dvh', display:'grid', placeItems:'center', padding:'24px', position:'relative', overflow:'hidden', color:'#e6edfd', '--custom-colour': theme.colour} as CSSProperties}>
    <div aria-hidden="true" style={{position:'absolute', pointerEvents:'none', top:'-12%', left:'50%', transform:'translateX(-50%)', width:'min(760px, 95vw)', height:460, borderRadius:'50%', filter:'blur(130px)', background:theme.colour, opacity:.25}} />
    <div aria-hidden="true" style={{position:'absolute', pointerEvents:'none', top:'38%', left:'50%', transform:'translateX(-50%)', width:'min(900px, 95vw)', height:620, borderRadius:'50%', filter:'blur(160px)', background:theme.colour, opacity:.18}} />
    <section style={{position:'relative', width:'min(100%, 420px)', padding:'32px 24px', borderRadius:24, textAlign:'center', background:'rgba(8, 12, 22, .82)', border:'1px solid rgba(255,255,255,.32)', boxShadow:'0 20px 60px rgba(0,0,0,.5)'}}>
      <p style={{fontSize:12, letterSpacing:'.25em', color:'#e6edfd', fontWeight:700}}>MIND SPARK</p>
      <h1 style={{fontSize:24, fontWeight:800, margin:'12px 0'}}>Verify you’re human</h1>
      <p role="status" style={{color:'#e6edfd', fontSize:14, marginBottom:24}}>{message}</p>
      <div ref={widget} style={{display:'flex', justifyContent:'center', minHeight:65}} />
      <p style={{fontSize:12, color:'#e6edfd', marginTop:20}}>Verification is provided by Cloudflare.</p>
    </section>
  </main>;
}
