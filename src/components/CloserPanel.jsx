import { Gauge } from './Gauge.jsx';
import { fd, fp } from '../utils.js';

export function CloserPanel({ closerKey, closerStats, closerNames }) {
  const sc = closerStats;
  const swp = sc.sale > 0 ? sc.ws / sc.sale : 0;
  const ssp = sc.sale > 0 ? sc.si / sc.sale : 0;
  const sep = sc.sale > 0 ? sc.ex / sc.sale : 0;
  const spd = sc.sale > 0 ? (sc.ws + sc.si) / sc.sale : 0;
  const scRem = sc.bal;

  return (
    <div style={{
      background: 'rgba(30,58,95,.15)', border: '1px solid rgba(125,211,252,.2)',
      borderRadius: 10, padding: '10px 14px', marginBottom: 8, height: 140, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      {/* Row 1: Gauge + Name + Outstanding */}
      <div className="fx ac g10" style={{ marginBottom: 6 }}>
        {spd >= 0.999 ? (
          <div style={{ width: 80, height: 46, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74,222,128,.12)', borderRadius: 8 }}>
            <span style={{ fontSize: 22 }}>&#9989;</span>
          </div>
        ) : (
          <div style={{ width: 80, height: 46, flexShrink: 0 }}>
            <Gauge w={80} h={46} ws={swp} si={ssp} ex={sep} label={fp(spd)} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#7dd3fc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {closerNames[closerKey]}
          </div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
            <span style={{ fontWeight: 700 }}>{sc.cnt}</span> accts &middot; <span style={{ fontWeight: 700 }}>{sc.con}</span> contacted
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fb923c' }}>{fd(scRem > 0 ? scRem : 0)}</div>
          <div style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>outstanding</div>
        </div>
      </div>

      {/* Row 2: Stats bar */}
      <div className="fx jb ac" style={{ fontSize: 11 }}>
        <div className="fx g8">
          <span><span style={{ color: '#4ade80', fontWeight: 700 }}>{fd(sc.ws)}</span> <span style={{ color: '#475569' }}>ws</span></span>
          {sc.si > 0 && <span><span style={{ color: '#38bdf8', fontWeight: 700 }}>+{fd(sc.si)}</span> <span style={{ color: '#475569' }}>since</span></span>}
          {sc.ex > 0 && <span><span style={{ color: '#fbbf24', fontWeight: 700 }}>{fd(sc.ex)}</span> <span style={{ color: '#475569' }}>exp</span></span>}
        </div>
        <span style={{ color: '#475569', fontSize: 10 }}>of {fd(sc.sale)}</span>
      </div>
    </div>
  );
}
