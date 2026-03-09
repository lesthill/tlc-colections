import { useState } from 'react';
import { fd } from '../utils.js';

// Next Saturday from a given timestamp
function nextSaturday(ts) {
  const d = new Date(ts);
  const day = d.getDay();
  const diff = day === 6 ? 7 : 6 - day; // if Saturday, give a full week
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function PocketDealCard({ deal, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const expiry = nextSaturday(deal.created);
  const now = new Date();
  const msLeft = expiry - now;
  const hoursLeft = Math.max(0, Math.ceil(msLeft / 36e5));
  const daysLeft = Math.max(0, Math.ceil(msLeft / 864e5));
  const expired = msLeft <= 0;

  if (expired) return null;

  const countdown = daysLeft > 1 ? daysLeft + 'd left' : daysLeft === 1 ? '~' + hoursLeft + 'h left' : hoursLeft + 'h left';
  const urgCol = daysLeft <= 1 ? '#f87171' : daysLeft <= 3 ? '#fbbf24' : '#a78bfa';

  return (
    <div className="card" style={{ borderLeft: '3px solid ' + urgCol }}>
      {/* Header row */}
      <div style={{ padding: 12 }} className="fx jb ac">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fx ac g6" style={{ marginBottom: 4 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 1, color: '#a78bfa',
              background: 'rgba(167,139,250,.12)', padding: '2px 8px', borderRadius: 4,
              border: '1px solid rgba(167,139,250,.25)',
            }}>POCKET DEAL</span>
            <span style={{
              fontSize: 9, fontWeight: 700, color: urgCol,
              background: urgCol + '15', padding: '2px 6px', borderRadius: 4,
            }}>{countdown}</span>
          </div>
          <div className="nm">{deal.name || 'Unnamed'}</div>
          {deal.event && <div className="ev">{deal.event}</div>}
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {deal.amount > 0 && <div className="bal" style={{ color: '#a78bfa' }}>{fd(deal.amount)}</div>}
          <span onClick={() => setExpanded(!expanded)} style={{ fontSize: 14, color: '#475569', cursor: 'pointer', padding: '4px 8px' }}>
            {expanded ? '\u25B2' : '\u25BC'}
          </span>
        </div>
      </div>

      {/* Contact row (show if phone or email exists) */}
      {(deal.phone || deal.email) && !expanded && (
        <div style={{ padding: '0 12px 8px' }} className="fx g6 fw con">
          {deal.phone && <span style={{ color: '#38bdf8', fontSize: 12 }}>&#128222; {deal.phone}</span>}
          {deal.email && <span style={{ color: '#94a3b8', fontSize: 12 }}>&#9993; {deal.email}</span>}
        </div>
      )}

      {/* Notes preview when collapsed */}
      {!expanded && deal.notes && (
        <div style={{ padding: '0 12px 8px', fontSize: 11 }}>
          <span className="gry">"{deal.notes}"</span>
        </div>
      )}

      {/* Expanded section */}
      {expanded && (
        <div style={{ background: '#080d13', borderTop: '1px solid rgba(30,58,95,.15)', padding: '14px 14px' }}>
          {/* Editable fields */}
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 3 }}>NAME</label>
            <input className="inp" value={deal.name || ''} placeholder="Customer name"
              onChange={e => onUpdate(deal.id, 'name', e.target.value)} />
          </div>
          <div className="fx g6" style={{ marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 3 }}>AMOUNT</label>
              <input type="text" inputMode="numeric" pattern="[0-9]*" className="inp"
                style={{ color: '#a78bfa', fontWeight: 700 }}
                value={deal.amount || ''} placeholder="0"
                onChange={e => onUpdate(deal.id, 'amount', parseFloat(e.target.value) || 0)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 3 }}>EVENT</label>
              <input className="inp" value={deal.event || ''} placeholder="City"
                onChange={e => onUpdate(deal.id, 'event', e.target.value)} />
            </div>
          </div>
          <div className="fx g6" style={{ marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 3 }}>PHONE</label>
              <input type="tel" className="inp" value={deal.phone || ''} placeholder="Phone number"
                onChange={e => onUpdate(deal.id, 'phone', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 3 }}>EMAIL</label>
              <input type="email" className="inp" value={deal.email || ''} placeholder="Email"
                onChange={e => onUpdate(deal.id, 'email', e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: 1, display: 'block', marginBottom: 3 }}>NOTES</label>
            <input className="inp" value={deal.notes || ''} placeholder="Notes..."
              onChange={e => onUpdate(deal.id, 'notes', e.target.value)} />
          </div>

          {/* Expiry info + delete */}
          <div className="fx jb ac">
            <span style={{ fontSize: 9, color: '#475569' }}>
              Expires {expiry.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span onClick={() => { if (confirm('Delete this pocket deal?')) onRemove(deal.id); }} style={{
              fontSize: 10, fontWeight: 700, color: '#f87171', cursor: 'pointer',
              background: 'rgba(248,113,113,.08)', padding: '5px 10px', borderRadius: 4,
              border: '1px solid rgba(248,113,113,.2)',
            }}>DELETE</span>
          </div>
        </div>
      )}
    </div>
  );
}
