import { useState } from 'react';
import { TIER_LABELS, TIER_COLORS, STATUS_NAMES, STATUS_COLORS, NMI_URL } from '../data.js';
import { fd, fp, dueDate, daysLeft, weeksAgo } from '../utils.js';
import { Gauge, DoneBadge } from './Gauge.jsx';

export function ClientCard({ client, gd, gdn, upd, doPif, undoPif, addPayment, removePayment, getPayments, addExpected, removeExpected, getExpected, collectExpected, expanded, onToggleExpand, jump, onAskACH, onDialGoTo }) {
  const c = client;
  const [newPayAmt, setNewPayAmt] = useState('');
  const [newExpAmt, setNewExpAmt] = useState('');
  const [newExpDate, setNewExpDate] = useState('');
  const payments = getPayments(c.id);
  const expectedPayments = getExpected(c.id);
  const since = gdn(c.id, 'since');
  const exp = gdn(c.id, 'exp');
  const cn = gd(c.id, 'cn');
  const cs = gd(c.id, 'cs') || 'not_contacted';
  const isPif = gd(c.id, '_pif') === '1';

  const dl = daysLeft(c.ed);
  const dueD = dueDate(c.ed);
  const dueFmt = (dueD.getMonth() + 1) + '/' + dueD.getDate();
  const dlTxt = dl > 0 ? dl + 'd to Foundation' : dl === 0 ? 'FOUNDATION TODAY' : 'PAST FOUNDATION';
  const dlCol = dl <= 0 ? '#f87171' : dl <= 7 ? '#fbbf24' : '#4ade80';
  const urgBg = dl <= 0 ? 'rgba(248,113,113,.1)' : dl <= 7 ? 'rgba(251,191,36,.1)' : 'rgba(74,222,128,.1)';

  const wp = c.sale > 0 ? c.col / c.sale : 0;
  const sp = c.sale > 0 ? since / c.sale : 0;
  const ep = c.sale > 0 ? exp / c.sale : 0;
  const totalPaid = c.col + since;
  const fullPaid = totalPaid >= c.sale && c.sale > 0;
  const remaining = c.bal - since;
  const pifAmt = Math.max(0, c.sale - c.col - since);

  // CC button handler: copy info to clipboard, open NMI
  function handleCC() {
    const info = c.nm + '\n' + (c.em || '') + '\n' + (remaining > 0 ? fd(remaining) : fd(c.bal));
    try { navigator.clipboard.writeText(info); } catch (e) {}
    window.location.href = NMI_URL;
  }

  return (
    <div className="card" id={'c-' + c.id} style={jump ? { boxShadow: 'inset 0 0 0 2px #7dd3fc' } : undefined}>

      {/* Top row: gauge + info + balance */}
      <div style={{ padding: 12 }} className="fx g10">

        {/* Left: gauge or done badge */}
        {fullPaid ? (
          <DoneBadge isPif={isPif} />
        ) : (
          <div style={{ width: 96, height: 56, flexShrink: 0 }}>
            <Gauge w={96} h={56} ws={wp} si={sp} ex={ep} label={fp(totalPaid / (c.sale || 1))} />
          </div>
        )}

        {/* Middle: badges + name + event */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fx ac g4 fw" style={{ marginBottom: 4 }}>
            <span className="badge" style={{ color: dlCol, background: urgBg }}>{dlTxt} ({dueFmt})</span>
            <span className="badge" style={{ color: TIER_COLORS[c.t] || '#94a3b8', background: (TIER_COLORS[c.t] || '#94a3b8') + '15' }}>
              {TIER_LABELS[c.t] || ''}
            </span>
            <span style={{ color: '#7dd3fc', fontSize: 11, fontWeight: 700 }}>{c.cl}</span>
          </div>
          <div className="nm">{c.nm}</div>
          <div className="ev">{c.ev}</div>
        </div>

        {/* Right: balance + CC/ACH links */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="bal">{fd(remaining > 0 ? remaining : c.bal)}</div>
          <div className="bsub">of {fd(c.sale)}</div>
          {since > 0 && <div style={{ color: '#38bdf8', fontSize: 10, fontWeight: 600 }}>+{fd(since)}</div>}
          {remaining > 0 && (
            <div style={{ marginTop: 4, display: 'flex', gap: 14, justifyContent: 'flex-end' }}>
              <span onClick={handleCC} style={{ color: '#38bdf8', fontSize: 22, cursor: 'pointer' }}>&#128179;</span>
              <span onClick={() => onAskACH(c.id, c.nm, fd(remaining))} style={{ color: '#4ade80', fontSize: 22, cursor: 'pointer' }}>&#127974;</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '0 12px 6px' }} className="fx g8 fw">
        <span className="grn" style={{ fontSize: 11 }}>WS:{fd(c.col)}</span>
        {c.rr && <span className={c.rr === 'DECLINED' ? 'red' : c.rr === 'RANGE' ? 'blu' : 'ylw'} style={{ fontSize: 11 }}>RR:{c.rn}</span>}
        {c.nt && <span className="gry" style={{ fontSize: 11 }}>{c.nt}</span>}
      </div>

      {/* Contact row */}
      {(c.ph || c.em) && (
        <div style={{ padding: '0 12px 6px' }} className="fx g6 fw con">
          {c.ph && <span onClick={() => onDialGoTo(c.ph)} style={{ color: '#38bdf8', cursor: 'pointer', background: 'rgba(56,189,248,.06)', padding: '7px 12px', borderRadius: 6, fontSize: 12 }}>&#128222; {c.ph}</span>}
          {c.em && <a href={'mailto:' + c.em} style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200, whiteSpace: 'nowrap' }}>&#9993; {c.em}</a>}
        </div>
      )}

      {/* Disposition pills */}
      <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(30,58,95,.1)' }}>
        <div className="fx g4 fw">
          {Object.keys(STATUS_NAMES).map(k => {
            const active = cs === k;
            return (
              <span key={k} onClick={() => upd(c.id, 'cs', k)} style={{
                padding: '6px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                cursor: 'pointer', transition: 'all .15s',
                background: active ? STATUS_COLORS[k] + '25' : 'rgba(15,26,42,.5)',
                border: '1px solid ' + (active ? STATUS_COLORS[k] + '66' : 'rgba(30,58,95,.2)'),
                color: active ? STATUS_COLORS[k] : '#475569',
              }}>{STATUS_NAMES[k]}</span>
            );
          })}
        </div>
        <div className="fx jb ac" style={{ marginTop: 6 }}>
          <span style={{ fontSize: 9, color: '#475569' }}>
            {cs !== 'not_contacted' && 'Status: '}{cs !== 'not_contacted' && <span style={{ color: STATUS_COLORS[cs], fontWeight: 700 }}>{STATUS_NAMES[cs]}</span>}
          </span>
          <span onClick={onToggleExpand} style={{ fontSize: 14, color: '#475569', cursor: 'pointer', padding: '4px 8px' }}>
            {expanded ? '\u25B2' : '\u25BC'}
          </span>
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ background: '#080d13', borderTop: '1px solid rgba(30,58,95,.15)' }}>

          {/* === COLLECTIONS SECTION === */}
          <div style={{ padding: '12px 12px 8px' }}>
            <div className="fx jb ac" style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#38bdf8', letterSpacing: 1 }}>
                COLLECTED &middot; {fd(since)}
              </label>
              {!isPif && pifAmt > 0 && (
                <span onClick={() => doPif(c.id)} style={{
                  fontSize: 10, fontWeight: 700, color: '#4ade80', cursor: 'pointer',
                  background: 'rgba(74,222,128,.1)', padding: '3px 8px', borderRadius: 4,
                  border: '1px solid rgba(74,222,128,.25)',
                }}>PIF {fd(pifAmt)}</span>
              )}
              {isPif && (
                <span onClick={() => undoPif(c.id)} style={{
                  fontSize: 10, fontWeight: 700, color: '#f87171', cursor: 'pointer',
                  background: 'rgba(248,113,113,.1)', padding: '3px 8px', borderRadius: 4,
                  border: '1px solid rgba(248,113,113,.25)',
                }}>UNDO PIF</span>
              )}
            </div>

            {/* Add collection row */}
            <div className="fx g6 ac" style={{ marginBottom: 6 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" className="inp"
                style={{ color: '#38bdf8', fontWeight: 700, fontSize: 14, borderColor: 'rgba(56,189,248,.15)', flex: 1 }}
                value={newPayAmt} placeholder="Amount"
                onChange={e => setNewPayAmt(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newPayAmt && parseFloat(newPayAmt) > 0) {
                    addPayment(c.id, newPayAmt, '');
                    setNewPayAmt('');
                  }
                }} />
              <span onClick={() => {
                if (newPayAmt && parseFloat(newPayAmt) > 0) {
                  addPayment(c.id, newPayAmt, '');
                  setNewPayAmt('');
                }
              }} style={{
                background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.25)',
                color: '#38bdf8', padding: '10px 14px', fontSize: 12, borderRadius: 6,
                fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>+ ADD</span>
            </div>

            {/* Payment ledger */}
            {payments.length > 0 && (
              <div style={{
                background: 'rgba(56,189,248,.03)', border: '1px solid rgba(56,189,248,.08)',
                borderRadius: 6, overflow: 'hidden',
              }}>
                {payments.map((p, i) => {
                  const d = new Date(p.ts);
                  const dateFmt = (d.getMonth() + 1) + '/' + d.getDate() + ' ' +
                    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                  return (
                    <div key={p.ts + '-' + i} className="fx jb ac" style={{
                      padding: '7px 10px',
                      borderBottom: i < payments.length - 1 ? '1px solid rgba(30,58,95,.08)' : 'none',
                    }}>
                      <div className="fx ac g6">
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>{fd(p.amt)}</span>
                        <span style={{ fontSize: 9, color: '#475569' }}>{dateFmt}</span>
                        {p.note && <span style={{ fontSize: 9, color: '#64748b' }}>{p.note}</span>}
                      </div>
                      <span onClick={() => removePayment(c.id, i)} style={{
                        color: '#f87171', fontSize: 11, cursor: 'pointer', padding: '2px 6px',
                        opacity: 0.6,
                      }}>{'\u2715'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* === EXPECTED PAYMENTS SECTION === */}
          <div style={{ padding: '8px 12px' }}>
            <div className="fx jb ac" style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: '#fbbf24', letterSpacing: 1 }}>
                EXPECTED &middot; {fd(exp)}
              </label>
            </div>

            {/* Add expected row */}
            <div className="fx g6 ac" style={{ marginBottom: 6 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" className="inp"
                style={{ color: '#fbbf24', fontWeight: 700, fontSize: 14, borderColor: 'rgba(251,191,36,.15)', flex: 1 }}
                value={newExpAmt} placeholder="Amount"
                onChange={e => setNewExpAmt(e.target.value)} />
              <input type="date" className="inp"
                style={{ fontSize: 12, borderColor: 'rgba(251,191,36,.15)', width: 130 }}
                value={newExpDate}
                onChange={e => setNewExpDate(e.target.value)} />
              <span onClick={() => {
                if (newExpAmt && parseFloat(newExpAmt) > 0) {
                  addExpected(c.id, newExpAmt, newExpDate, '');
                  setNewExpAmt('');
                  setNewExpDate('');
                }
              }} style={{
                background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)',
                color: '#fbbf24', padding: '10px 14px', fontSize: 12, borderRadius: 6,
                fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>+ ADD</span>
            </div>

            {/* Expected payments list */}
            {expectedPayments.length > 0 && (
              <div style={{
                background: 'rgba(251,191,36,.03)', border: '1px solid rgba(251,191,36,.08)',
                borderRadius: 6, overflow: 'hidden',
              }}>
                {expectedPayments.map((e, i) => (
                  <div key={e.ts + '-' + i} className="fx jb ac" style={{
                    padding: '7px 10px',
                    borderBottom: i < expectedPayments.length - 1 ? '1px solid rgba(30,58,95,.08)' : 'none',
                  }}>
                    <div className="fx ac g6">
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24' }}>{fd(e.amt)}</span>
                      {e.date && <span style={{ fontSize: 9, color: '#475569' }}>{e.date}</span>}
                      {e.note && <span style={{ fontSize: 9, color: '#64748b' }}>{e.note}</span>}
                    </div>
                    <div className="fx g4 ac">
                      {/* Mark as collected button */}
                      <span onClick={() => collectExpected(c.id, i)} style={{
                        color: '#4ade80', fontSize: 9, fontWeight: 700, cursor: 'pointer',
                        background: 'rgba(74,222,128,.1)', padding: '3px 6px', borderRadius: 3,
                        border: '1px solid rgba(74,222,128,.2)',
                      }}>RECV'D</span>
                      <span onClick={() => removeExpected(c.id, i)} style={{
                        color: '#f87171', fontSize: 11, cursor: 'pointer', padding: '2px 6px',
                        opacity: 0.6,
                      }}>{'\u2715'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* === NOTES SECTION === */}
          <div style={{ padding: '8px 12px 12px' }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: 1, marginBottom: 4, display: 'block' }}>NOTES</label>
            <input className="inp" value={cn || ''} placeholder="Follow-up notes..."
              onChange={e => upd(c.id, 'cn', e.target.value)} />
          </div>
        </div>
      )}

      {/* Collapsed preview */}
      {!expanded && (cn || since > 0 || exp > 0) && (
        <div style={{ padding: '4px 12px 8px', fontSize: 11 }} className="fx g8 fw">
          {since > 0 && <span className="blu">+{fd(since)}</span>}
          {exp > 0 && <span className="ylw">Pipeline:{fd(exp)}</span>}
          {expectedPayments.length > 0 && <span className="gry">{expectedPayments.length} pending</span>}
          {cn && <span className="gry">"{cn}"</span>}
        </div>
      )}
    </div>
  );
}
