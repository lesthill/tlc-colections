import { useState, useEffect, useCallback } from 'react';

const CRED_KEY = 'tlc-webauthn-cred';

function canWebAuthn() {
  return window.PublicKeyCredential && navigator.credentials;
}

// Generate a random buffer
function randomBuf(len) {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return buf;
}

// Enroll: create a new credential (triggers Face ID / Touch ID)
async function enroll() {
  const challenge = randomBuf(32);
  const userId = randomBuf(16);
  const cred = await navigator.credentials.create({
    publicKey: {
      challenge,
      rp: { name: 'TLC Collections' },
      user: { id: userId, name: 'collector', displayName: 'Collector' },
      pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
      },
      timeout: 60000,
    },
  });
  // Store credential ID for future assertions
  const idArr = Array.from(new Uint8Array(cred.rawId));
  localStorage.setItem(CRED_KEY, JSON.stringify(idArr));
  return true;
}

// Verify: request assertion with stored credential (triggers Face ID / Touch ID)
async function verify() {
  const stored = localStorage.getItem(CRED_KEY);
  if (!stored) return false;
  const idArr = JSON.parse(stored);
  const credId = new Uint8Array(idArr);
  const challenge = randomBuf(32);
  await navigator.credentials.get({
    publicKey: {
      challenge,
      allowCredentials: [{ id: credId, type: 'public-key', transports: ['internal'] }],
      userVerification: 'required',
      timeout: 60000,
    },
  });
  return true;
}

export function LockScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [status, setStatus] = useState(''); // '', 'checking', 'enroll', 'failed'
  const hasWebAuthn = canWebAuthn();
  const hasCredential = !!localStorage.getItem(CRED_KEY);

  const dismiss = useCallback(() => {
    setFading(true);
    setTimeout(() => setVisible(false), 350);
  }, []);

  // Auto-trigger Face ID on mount if enrolled
  useEffect(() => {
    if (!hasWebAuthn || !hasCredential) return;
    let cancelled = false;
    setStatus('checking');
    verify()
      .then(() => { if (!cancelled) dismiss(); })
      .catch(() => { if (!cancelled) setStatus('failed'); });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  async function handleEnroll() {
    setStatus('checking');
    try {
      await enroll();
      dismiss();
    } catch (e) {
      setStatus('failed');
    }
  }

  async function handleRetry() {
    setStatus('checking');
    try {
      const ok = hasCredential ? await verify() : await enroll();
      if (ok) dismiss();
    } catch (e) {
      setStatus('failed');
    }
  }

  const showFaceId = hasWebAuthn && (hasCredential || status === '');
  const isChecking = status === 'checking';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
      background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity .3s', opacity: fading ? 0 : 1,
    }}>
      <img src="/apple-touch-icon.png" alt=""
        style={{ width: 100, height: 100, borderRadius: 22, marginBottom: 28 }}
        onError={e => { e.target.style.display = 'none'; }} />
      <div style={{ fontSize: 10, letterSpacing: 4, color: 'var(--green)', marginBottom: 8, fontWeight: 700 }}>
        TLC COLLECTIONS
      </div>

      {isChecking ? (
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 40 }}>
          Verifying...
        </div>
      ) : status === 'failed' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#f87171', marginBottom: 4 }}>Verification failed</div>
          <span onClick={handleRetry} style={{
            padding: '12px 28px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            background: 'rgba(74,222,128,.1)', border: '1px solid rgba(74,222,128,.3)',
            color: '#4ade80', cursor: 'pointer',
          }}>Try Again</span>
          <span onClick={dismiss} style={{
            padding: '10px 24px', fontSize: 12, color: 'var(--text-dim)', cursor: 'pointer',
          }}>Skip</span>
        </div>
      ) : hasWebAuthn && !hasCredential ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 4 }}>
            Set up Face ID to unlock
          </div>
          <span onClick={handleEnroll} style={{
            padding: '14px 32px', borderRadius: 10, fontSize: 14, fontWeight: 700,
            background: 'rgba(74,222,128,.12)', border: '1px solid rgba(74,222,128,.3)',
            color: '#4ade80', cursor: 'pointer',
          }}>
            Enable Face ID
          </span>
          <span onClick={dismiss} style={{
            padding: '10px 24px', fontSize: 12, color: 'var(--text-dim)', cursor: 'pointer',
          }}>Skip</span>
        </div>
      ) : !hasWebAuthn ? (
        <div onClick={dismiss} style={{ cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 40 }}>
            Tap anywhere to enter
          </div>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" opacity=".5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 9.9-1" />
          </svg>
        </div>
      ) : (
        /* Waiting for auto-verify on mount */
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 40 }}>
          Authenticating...
        </div>
      )}

      {/* Face ID icon when checking */}
      {showFaceId && !status.startsWith('fail') && (
        <div style={{ marginTop: 24, opacity: 0.4 }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.2">
            <path d="M7 3H5a2 2 0 0 0-2 2v2" />
            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
            <path d="M17 21h2a2 2 0 0 0 2-2v-2" />
            <path d="M9 9v1" />
            <path d="M15 9v1" />
            <path d="M9 15c.6.9 1.5 1.5 3 1.5s2.4-.6 3-1.5" />
          </svg>
        </div>
      )}
    </div>
  );
}
