import { Gauge } from './Gauge.jsx';
import { fd, fp } from '../utils.js';

export function CloserPanel({ closerKey, closerStats, closerNames }) {
  const sc = closerStats;
  const swp = sc.sale > 0 ? sc.ws / sc.sale : 0;
  const ssp = sc.sale > 0 ? sc.si / sc.sale : 0;
  const sep = sc.sale > 0 ? sc.ex / sc.sale : 0;
  const spd = sc.sale > 0 ? (sc.ws + sc.si) / sc.sale : 0;
  const scRem = sc.bal;  // bal is already net of since

  return (
    <div style={{
      background: 'rgba(30,58,95,.15)', border: '1px solid rgba(125,211,252,.2)',
      borderRadius: 10, padding: '10px 14px', marginBottom: 8, minHeight: 80,
    }}>
      <div className="fx ac g10">
        {spd >= 0.999 ? (
          <div style={{ width: 64, height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74,222,128,.12)', borderRadius: 8 }}>
            <span style={{ fontSize: 18 }}>&#9989;</span>
          </div>
        ) : (
          <div style={{ width: 64, height: 36, flexShrink: 0 }}>
            <Gauge w={64} h={36} ws={swp} si={ssp} ex={sep} label={fp(spd)} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#7dd3fc', letterSpacing: 0.5 }}>{closerNames[closerKey]}</div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
            <span style={{ fontWeight: 700 }}>{sc.cnt}</span> accts &middot; <span style={{ fontWeight: 700 }}>{sc.con}</span> contacted
          </div>
          <div style={{ fontSize: 13, marginTop: 2 }}>
            <span style={{ color: '#4ade80', fontWeight: 700 }}>{fd(sc.ws)}</span> ws + <span style={{ color: '#38bdf8', fontWeight: 700 }}>{fd(sc.si)}</span> since
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fb923c' }}>{fd(scRem > 0 ? scRem : 0)}</div>
          <div style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>outstanding</div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>of {fd(sc.sale)}</div>
        </div>
      </div>
    </div>
  );
}
