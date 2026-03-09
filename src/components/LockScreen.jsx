import { useState, useEffect } from 'react';

export function LockScreen() {
  // One-time cleanup of old Face ID data
  useEffect(() => {
    try { localStorage.removeItem('tlc-webauthn-cred'); localStorage.removeItem('tlc-unlock-ts'); } catch (e) {}
  }, []);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  if (!visible) return null;

  const dismiss = () => {
    setFading(true);
    setTimeout(() => setVisible(false), 350);
  };

  return (
    <div onClick={dismiss} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      transition: 'opacity .3s', opacity: fading ? 0 : 1,
    }}>
      <img src="/apple-touch-icon.png" alt=""
        style={{ width: 100, height: 100, borderRadius: 22, marginBottom: 28 }}
        onError={e => { e.target.style.display = 'none'; }} />
      <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--green)', marginBottom: 8, fontWeight: 700 }}>
        TLC COLLECTIONS
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 40 }}>
        Tap anywhere to enter
      </div>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" opacity=".5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      </svg>
    </div>
  );
}
