import { TIER_LABELS, TIER_COLORS, STATUS_NAMES, STATUS_COLORS, NMI_URL } from '../data.js';
import { fd, fp, dueDate, daysLeft } from '../utils.js';
import { Gauge, DoneBadge } from './Gauge.jsx';

export function ClientCard({ client, gd, gdn, upd, doPif, undoPif, doPifExp, undoPifExp, expanded, onToggleExpand, jump, onAskACH, onDialGoTo }) {
  const c = client;
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

  const tierLabel = TIER_LABELS[c.t] || '';
  const tierColor = TIER_COLORS[c.t] || '#94a3b8';
  const rrColor = c.rr === 'DECLINED' ? '#f87171' : c.rr === 'RANGE' ? '#38bdf8' : c.rr === 'NEED_INFO' ? '#fbbf24' : c.rr === 'APPROVED' ? '#4ade80' : '#64748b';

  const handleCC = () => {
    const info = c.nm + '\n' + (c.em || '') + '\n' + (remaining > 0 ? fd(remaining) : fd(c.bal));
    navigator.clipboard.writeText(info).catch(() => {});
    window.open(NMI_URL, '_blank', 'noopener,noreferrer');
  };

  const handleACH = () => {
    onAskACH(c.id, c.nm, remaining > 0 ? remaining : c.bal);
  };

  const hasData = since > 0 || exp > 0 || edt || cn;

  return (
    <div className="card" id={`c-${c.id}`} style={jump ? { boxShadow: 'inset 0 0 0 2px var(--blue)' } : undefined}>

      {/* Top row */}
      <div style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>

        {/* Left: Gauge or DoneBadge */}
        <div style={{ flexShrink: 0, width: 96, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {fullPaid
            ? <DoneBadge isPif={isPif} />
            : <Gauge w={96} h={56} ws={wp} si={sp} ex={ep} label={fp(wp + sp)} />
          }
        </div>

        {/* Middle: badges, name, event */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', marginBottom: 2 }}>
            <span style={{
              fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
              background: urgBg, color: dlCol, whiteSpace: 'nowrap',
            }}>
              {dueFmt} &middot; {dlTxt}
            </span>
            {tierLabel && (
              <span style={{
                fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 3,
                background: 'rgba(255,255,255,.06)', color: tierColor,
              }}>
                {tierLabel}
              </span>
            )}
            {c.cl && (
              <span style={{
                fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 3,
                background: 'rgba(255,255,255,.06)', color: '#94a3b8',
              }}>
                {c.cl}
              </span>
            )}
          </div>
          <div className="nm" style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {c.nm}
          </div>
          <div className="ev" style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            {c.ev}
          </div>
        </div>

        {/* Right: Balance + payment buttons */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: remaining <= 0 ? 'var(--green)' : 'var(--text-primary)' }}>
            {fd(remaining > 0 ? remaining : c.bal)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>
            of {fd(c.sale)}
          </div>
          {since > 0 && (
            <div style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 600 }}>
              +{fd(since)}
            </div>
          )}
          {remaining > 0 && (
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', marginTop: 4 }}>
              <button onClick={handleCC} style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 4,
                padding: '2px 6px', fontSize: 12, cursor: 'pointer', color: 'var(--text-primary)',
              }}>
                CC&#x1F4B3;
              </button>
              <button onClick={handleACH} style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 4,
                padding: '2px 6px', fontSize: 12, cursor: 'pointer', color: 'var(--text-primary)',
              }}>
                ACH&#x1F3E6;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '0 12px 6px', display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11 }}>
        <span style={{ color: '#4ade80' }}>WS {fd(c.col)}</span>
        {c.rr && (
          <span style={{ color: rrColor }}>
            {c.rr}{c.rn ? ' · ' + c.rn : ''}
          </span>
        )}
        {c.nt && (
          <span style={{ color: '#94a3b8' }}>{c.nt}</span>
        )}
      </div>

      {/* Contact row */}
      {(c.ph || c.em) && (
        <div style={{ padding: '0 12px 6px', display: 'flex', gap: 10, fontSize: 11 }}>
          {c.ph && (
            <a href="#" onClick={e => { e.preventDefault(); onDialGoTo(c.ph); }}
              style={{ color: 'var(--blue)', textDecoration: 'none' }}>
              &#x1F4DE; {c.ph}
            </a>
          )}
          {c.em && (
            <a href={`mailto:${c.em}`} style={{ color: 'var(--blue)', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              &#x2709; {c.em}
            </a>
          )}
        </div>
      )}

      {/* Status bar */}
      <div style={{
        borderTop: '1px solid var(--border)', padding: '6px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <select
          value={cs}
          onChange={e => upd(c.id, 'cs', e.target.value)}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 4,
            color: STATUS_COLORS[cs] || '#64748b', fontSize: 11, padding: '2px 6px',
            cursor: 'pointer', outline: 'none',
          }}
        >
          {Object.entries(STATUS_NAMES).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={onToggleExpand} style={{
          background: 'none', border: 'none', color: 'var(--text-dim)',
          cursor: 'pointer', fontSize: 14, padding: '2px 6px',
        }}>
          {expanded ? '\u25B2' : '\u25BC'}
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ background: '#080d13', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Collected since workshop */}
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, color: 'var(--blue)', letterSpacing: 1, marginBottom: 4, display: 'block' }}>
              COLLECTED SINCE WORKSHOP
            </label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="number"
                inputMode="numeric"
                value={since || ''}
                onChange={e => upd(c.id, 'since', e.target.value)}
                placeholder="0"
                style={{
                  flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--blue)',
                  borderRadius: 4, color: 'var(--blue)', padding: '6px 8px', fontSize: 14,
                  fontWeight: 700, outline: 'none',
                }}
              />
              {!isPif ? (
                <button onClick={() => doPif(c.id)} style={{
                  background: 'var(--green)', color: '#000', border: 'none', borderRadius: 4,
                  padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  PIF
                </button>
              ) : (
                <button onClick={() => undoPif(c.id)} style={{
                  background: 'rgba(248,113,113,.15)', color: '#f87171', border: '1px solid #f87171',
                  borderRadius: 4, padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  UNDO PIF
                </button>
              )}
            </div>
          </div>

          {/* Expected next payment */}
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, color: '#fbbf24', letterSpacing: 1, marginBottom: 4, display: 'block' }}>
              EXPECTED NEXT PAYMENT
            </label>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                type="number"
                inputMode="numeric"
                value={exp || ''}
                onChange={e => upd(c.id, 'exp', e.target.value)}
                placeholder="0"
                style={{
                  flex: 1, background: 'var(--bg-secondary)', border: '1px solid #fbbf24',
                  borderRadius: 4, color: '#fbbf24', padding: '6px 8px', fontSize: 14,
                  fontWeight: 700, outline: 'none',
                }}
              />
              {!isExpPif ? (
                <button onClick={() => doPifExp(c.id)} style={{
                  background: '#fbbf24', color: '#000', border: 'none', borderRadius: 4,
                  padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  PIF EXP
                </button>
              ) : (
                <button onClick={() => undoPifExp(c.id)} style={{
                  background: 'rgba(248,113,113,.15)', color: '#f87171', border: '1px solid #f87171',
                  borderRadius: 4, padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  UNDO
                </button>
              )}
              <input
                type="date"
                value={edt || ''}
                onChange={e => upd(c.id, 'edt', e.target.value)}
                style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 4, color: 'var(--text-primary)', padding: '6px 8px', fontSize: 12,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 4, display: 'block' }}>
              NOTES
            </label>
            <input
              type="text"
              value={cn || ''}
              onChange={e => upd(c.id, 'cn', e.target.value)}
              placeholder="Add notes..."
              style={{
                width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: 4, color: 'var(--text-primary)', padding: '6px 8px', fontSize: 13,
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      )}

      {/* Collapsed preview */}
      {!expanded && hasData && (
        <div style={{
          padding: '4px 12px 8px', fontSize: 11, color: 'var(--text-dim)',
          display: 'flex', gap: 8, flexWrap: 'wrap',
        }}>
          {since > 0 && <span style={{ color: 'var(--blue)' }}>+{fd(since)}</span>}
          {exp > 0 && <span style={{ color: '#fbbf24' }}>exp {fd(exp)}</span>}
          {edt && <span>{edt}</span>}
          {cn && <span style={{ color: '#94a3b8' }}>{cn}</span>}
        </div>
      )}
    </div>
  );
}
