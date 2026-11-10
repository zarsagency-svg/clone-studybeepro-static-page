import { useEffect, useRef, useState, type ReactNode } from 'react';

type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void; reset: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const STORAGE_KEY = 'mindspark-human-verified';

export function HumanVerification({ children }: { children: ReactNode }) {
  const [verified, setVerified] = useState(() => { try { return sessionStorage.getItem(STORAGE_KEY) === 'yes'; } catch { return false; } });
  const [message, setMessage] = useState('Complete the check below to continue.');
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
  return <main style={{minHeight:'100dvh', display:'grid', placeItems:'center', padding:'24px', background:'radial-gradient(circle at 50% 0%, #1A3BB0, #0F2270 35%, #071039 80%)', color:'#e6edfd'}}>
    <section style={{width:'min(100%, 420px)', padding:'32px 24px', borderRadius:24, textAlign:'center', background:'rgba(15,34,112,.82)', border:'1px solid rgba(175,197,248,.4)', boxShadow:'0 20px 60px rgba(7,16,57,.5)'}}>
      <p style={{fontSize:12, letterSpacing:'.25em', color:'#afc5f8', fontWeight:700}}>MIND SPARK</p>
      <h1 style={{fontSize:24, fontWeight:800, margin:'12px 0'}}>Verify you’re human</h1>
      <p role="status" style={{color:'#afc5f8', fontSize:14, marginBottom:24}}>{message}</p>
      <div ref={widget} style={{display:'flex', justifyContent:'center', minHeight:65}} />
      <p style={{fontSize:12, color:'#afc5f8', marginTop:20}}>Verification is provided by Cloudflare.</p>
    </section>
  </main>;
}
