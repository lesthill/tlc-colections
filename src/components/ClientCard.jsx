import { useState } from 'react';
import { TIER_LABELS, TIER_COLORS, STATUS_NAMES, STATUS_COLORS, NMI_URL } from '../data.js';
import { fd, fp, dueDate, daysLeft, weeksAgo } from '../utils.js';
import { Gauge, DoneBadge } from './Gauge.jsx';

export function ClientCard({ client, gd, gdn, upd, doPif, undoPif, doPifExp, undoPifExp, addPayment, removePayment, getPayments, expanded, onToggleExpand, jump, onAskACH, onDialGoTo }) {
  const c = client;
  const [newPayAmt, setNewPayAmt] = useState('');
  const payments = getPayments(c.id);
  const since = gdn(c.id, 'since');
  const exp = gdn(c.id, 'exp');
  const edt = gd(c.id, 'edt');
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
  const isExpPif = exp >= pifAmt && pifAmt > 0 && gd(c.id, '_prevExp');

  // CC button handler: copy info to clipboard, open NMI
  function handleCC(e) {
    e.preventDefault();
    const info = c.nm + '\n' + (c.em || '') + '\n' + (remaining > 0 ? fd(remaining) : fd(c.bal));
    navigator.clipboard.writeText(info).catch(() => {});
    const a = document.createElement('a');
    a.href = NMI_URL;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
              <a href="#" onClick={handleCC} style={{ color: '#38bdf8', textDecoration: 'none', fontSize: 22 }}>&#128179;</a>
              <a href="#" onClick={e => { e.preventDefault(); onAskACH(c.id, c.nm, fd(remaining)); }} style={{ color: '#4ade80', textDecoration: 'none', fontSize: 22 }}>&#127974;</a>
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
          {c.ph && <a href="#" onClick={e => { e.preventDefault(); onDialGoTo(c.ph); }}>&#128222; {c.ph}</a>}
          {c.em && <a href={'mailto:' + c.em} style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200, whiteSpace: 'nowrap' }}>&#9993; {c.em}</a>}
        </div>
      )}

      {/* Status + expand */}
      <div className="fx g8" style={{ padding: '6px 12px 8px', borderTop: '1px solid rgba(30,58,95,.1)' }}>
        <select className="sel" style={{ color: STATUS_COLORS[cs] }} value={cs}
          onChange={e => upd(c.id, 'cs', e.target.value)}>
          {Object.keys(STATUS_NAMES).map(k => (
            <option key={k} value={k}>{STATUS_NAMES[k]}</option>
          ))}
        </select>
        <button className="btn" onClick={onToggleExpand}>{expanded ? '\u25B2' : '\u25BC'}</button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ padding: 12, background: '#080d13', borderTop: '1px solid rgba(30,58,95,.15)' }}>
          <div style={{ marginBottom: 12 }}>
            <label className="lbl blu">COLLECTED SINCE WORKSHOP &middot; {fd(since)}</label>

            {/* Add payment row */}
            <div className="fx g8 ac" style={{ marginBottom: 8 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" className="inp"
                style={{ color: '#38bdf8', fontWeight: 700, fontSize: 16, borderColor: 'rgba(56,189,248,.2)', flex: 1 }}
                value={newPayAmt} placeholder="Amount"
                onChange={e => setNewPayAmt(e.target.value)} />
              <button className="btn-pif" style={{ fontSize: 11, padding: '10px 12px' }}
                onClick={() => {
                  if (newPayAmt && parseFloat(newPayAmt) > 0) {
                    addPayment(c.id, newPayAmt, '');
                    setNewPayAmt('');
                  }
                }}>+ ADD</button>
              {isPif ? (
                <button className="btn-undo" onClick={() => undoPif(c.id)}>UNDO PIF</button>
              ) : (
                <button className="btn-pif" onClick={() => doPif(c.id)}>PIF</button>
              )}
            </div>

            {/* Payment ledger */}
            {payments.length > 0 && (
              <div style={{
                background: 'rgba(56,189,248,.04)', border: '1px solid rgba(56,189,248,.1)',
                borderRadius: 6, overflow: 'hidden',
              }}>
                {payments.map((p, i) => {
                  const d = new Date(p.ts);
                  const dateFmt = (d.getMonth() + 1) + '/' + d.getDate() + ' ' +
                    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                  return (
                    <div key={p.ts + '-' + i} className="fx jb ac" style={{
                      padding: '8px 10px',
                      borderBottom: i < payments.length - 1 ? '1px solid rgba(30,58,95,.1)' : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8' }}>{fd(p.amt)}</div>
                        <div style={{ fontSize: 9, color: '#475569' }}>
                          {dateFmt}{p.note ? ' \u00b7 ' + p.note : ''}
                        </div>
                      </div>
                      <button onClick={() => removePayment(c.id, i)} style={{
                        background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.2)',
                        color: '#f87171', fontSize: 10, fontWeight: 700, padding: '4px 8px',
                        borderRadius: 4, cursor: 'pointer',
                      }}>{'\u2715'}</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label className="lbl ylw">EXPECTED NEXT PAYMENT</label>
            <div className="fx g8 ac">
              <input type="text" inputMode="numeric" pattern="[0-9]*" className="inp"
                style={{ color: '#fbbf24', fontWeight: 700, fontSize: 16, borderColor: 'rgba(251,191,36,.2)', width: 140 }}
                value={exp || ''} placeholder="0"
                onChange={e => upd(c.id, 'exp', e.target.value)} />
              {isExpPif ? (
                <button className="btn-undo" onClick={() => undoPifExp(c.id)}>UNDO</button>
              ) : pifAmt > 0 ? (
                <button style={{
                  background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)',
                  color: '#fbbf24', padding: '12px 8px', fontSize: 11, borderRadius: 6,
                  fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer',
                }} onClick={() => doPifExp(c.id)}>PIF {fd(pifAmt)}</button>
              ) : null}
            </div>
            <div style={{ marginTop: 8 }}>
              <input type="date" className="inp" value={edt || ''}
                onChange={e => upd(c.id, 'edt', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="lbl gry">NOTES</label>
            <input className="inp" value={cn || ''} placeholder="Follow-up notes..."
              onChange={e => upd(c.id, 'cn', e.target.value)} />
          </div>
        </div>
      )}

      {/* Collapsed preview */}
      {!expanded && (cn || since > 0 || exp > 0) && (
        <div style={{ padding: '4px 12px 8px', fontSize: 11 }} className="fx g8 fw">
          {since > 0 && <span className="blu">+{fd(since)}</span>}
          {exp > 0 && <span className="ylw">Potential:{fd(exp)}</span>}
          {edt && <span className="gry">by {edt}</span>}
          {cn && <span className="gry">"{cn}"</span>}
        </div>
      )}
    </div>
  );
}
