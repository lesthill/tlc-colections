import React from 'react';
import { CLOSER_NAMES } from '../data.js';
import { fmtNotif } from '../utils.js';

export function Settings({
  onClose, notifConfig, onToggleNotif, onToggleDay,
  nTitle, onSetNTitle, nBody, onSetNBody, nTime, onSetNTime,
  customNotif, setCustomNotif, onTestNotif, onResetNotif, onReqPerm,
}) {
  const perm = 'Notification' in window ? Notification.permission : 'none';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
      background: '#080d13', overflowY: 'auto', WebkitOverflowScrolling: 'touch',
      padding: '60px 14px 40px',
    }}>
      <div className="frame" style={{ marginTop: 8 }}>
        {/* Header */}
        <div className="fx jb ac" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>&#128276; Notifications</div>
          <button style={{ background: 'transparent', border: '1px solid rgba(30,58,95,.3)', color: '#475569', padding: '6px 12px', fontSize: 11, borderRadius: 6, cursor: 'pointer' }}
            onClick={onClose}>Close</button>
        </div>

        {/* Permission status */}
        {perm === 'default' || perm === 'none' ? (
          <button style={{ width: '100%', background: '#4ade80', border: 'none', color: '#080d13', padding: 14, fontSize: 14, fontWeight: 700, borderRadius: 8, marginBottom: 12, cursor: 'pointer' }}
            onClick={onReqPerm}>Enable Notifications</button>
        ) : perm === 'denied' ? (
          <div style={{ padding: 12, background: 'rgba(248,113,113,.1)', borderRadius: 6, marginBottom: 12, fontSize: 12, color: '#f87171' }}>Blocked. Enable in Settings.</div>
        ) : (
          <div style={{ padding: '8px 12px', background: 'rgba(74,222,128,.1)', borderRadius: 6, marginBottom: 12, fontSize: 12, color: '#4ade80' }}>&#9989; Enabled</div>
        )}

        {/* NOTIFY FOR section */}
        <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>NOTIFY FOR</div>
        {['ALL', ...Object.keys(CLOSER_NAMES)].map(k => {
          const cfg = notifConfig[k] || { on: false, days: [] };
          return (
            <div key={k}>
              <div className="fx jb ac" style={{ padding: '10px 0', borderBottom: '1px solid rgba(30,58,95,.1)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: k === 'ALL' ? '#4ade80' : '#7dd3fc' }}>
                  {k === 'ALL' ? 'ALL' : k + ' ' + CLOSER_NAMES[k]}
                </span>
                <button style={{
                  width: 48, height: 26, borderRadius: 13, border: 'none',
                  background: cfg.on ? '#4ade80' : '#1e293b', position: 'relative', cursor: 'pointer',
                }} onClick={() => onToggleNotif(k)}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 10, background: '#fff',
                    position: 'absolute', top: 3, ...(cfg.on ? { right: 3 } : { left: 3 }),
                  }} />
                </button>
              </div>
              {cfg.on && (
                <div className="fx g4" style={{ padding: '6px 0' }}>
                  {[1, 3, 5, 7, 14].map(d => {
                    const isOn = cfg.days && cfg.days.indexOf(d) >= 0;
                    return (
                      <button key={d} style={{
                        padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        border: '1px solid ' + (isOn ? '#7dd3fc' : 'rgba(30,58,95,.3)'),
                        background: isOn ? 'rgba(125,211,252,.15)' : 'transparent',
                        color: isOn ? '#7dd3fc' : '#475569',
                      }} onClick={() => onToggleDay(k, d)}>{d}d</button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* DAILY ALERT TIME */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(30,58,95,.15)' }}>
          <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>DAILY ALERT TIME</div>
          <div className="fx ac g8" style={{ marginBottom: 14 }}>
            <input type="time" className="inp" style={{ flex: 1, fontSize: 16, fontWeight: 600, color: '#7dd3fc' }}
              value={nTime} onChange={e => onSetNTime(e.target.value)} />
            <div style={{ fontSize: 11, color: '#475569', flex: 1 }}>Alerts fire when you<br/>open the app after this time</div>
          </div>

          {/* NOTIFICATION MESSAGE */}
          <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 1, marginBottom: 8, marginTop: 12, fontWeight: 600 }}>NOTIFICATION MESSAGE</div>
          {!customNotif ? (
            <>
              <button style={{
                width: '100%', background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.2)',
                borderRadius: 10, padding: 14, textAlign: 'left', marginBottom: 10, cursor: 'pointer',
              }} onClick={onTestNotif}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>TAP TO PREVIEW</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{fmtNotif(nTitle, 'Anthony Lucero', 'Albuquerque', '$29,997', 3)}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{fmtNotif(nBody, 'Anthony Lucero', 'Albuquerque', '$29,997', 3)}</div>
              </button>
              <button style={{
                width: '100%', background: 'rgba(251,146,60,.08)', border: '1px solid rgba(251,146,60,.2)',
                borderRadius: 8, padding: 10, color: '#fb923c', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }} onClick={() => setCustomNotif(true)}>&#9998; Customize Message</button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Title</div>
                <input className="inp" style={{ fontSize: 13, color: '#e2e8f0' }} value={nTitle} onChange={e => onSetNTitle(e.target.value)} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Body</div>
                <input className="inp" style={{ fontSize: 13, color: '#e2e8f0' }} value={nBody} onChange={e => onSetNBody(e.target.value)} />
              </div>
              <div style={{ fontSize: 10, color: '#475569', marginBottom: 10, lineHeight: 1.4 }}>
                Variables: <span style={{ color: '#7dd3fc' }}>{'{name}'}</span> <span style={{ color: '#7dd3fc' }}>{'{event}'}</span> <span style={{ color: '#7dd3fc' }}>{'{amount}'}</span> <span style={{ color: '#7dd3fc' }}>{'{days}'}</span>
              </div>
              <button style={{
                width: '100%', background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.2)',
                borderRadius: 10, padding: 14, textAlign: 'left', marginBottom: 10, cursor: 'pointer',
              }} onClick={onTestNotif}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>TAP TO PREVIEW</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{fmtNotif(nTitle, 'Anthony Lucero', 'Albuquerque', '$29,997', 3)}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{fmtNotif(nBody, 'Anthony Lucero', 'Albuquerque', '$29,997', 3)}</div>
              </button>
              <button style={{
                width: '100%', background: 'rgba(74,222,128,.08)', border: '1px solid rgba(74,222,128,.2)',
                borderRadius: 8, padding: 10, color: '#4ade80', fontSize: 12, fontWeight: 600, marginBottom: 8, cursor: 'pointer',
              }} onClick={() => setCustomNotif(false)}>&#10003; Done</button>
              <button style={{
                width: '100%', background: 'rgba(248,113,113,.06)', border: '1px solid rgba(248,113,113,.2)',
                borderRadius: 8, padding: 10, color: '#f87171', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }} onClick={onResetNotif}>&#8634; Reset to Defaults</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
