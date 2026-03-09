import { Gauge } from './Gauge.jsx';
import { fd, fp } from '../utils.js';

export function CloserGrid({ closerStats, closerNames, sortBy, sortDir, onToggleSort, onSelectCloser }) {
  const closerKeys = Object.keys(closerStats).filter(k => closerStats[k].cnt > 0);
  const sorted = [...closerKeys].sort((a, b) => {
    const ca = closerStats[a], cb = closerStats[b];
    let av, bv;
    if (sortBy === 'pct') {
      av = ca.sale > 0 ? (ca.ws + ca.si) / ca.sale : 0;
      bv = cb.sale > 0 ? (cb.ws + cb.si) / cb.sale : 0;
    } else {
      av = ca.bal; bv = cb.bal;
    }
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  return (
    <>
      <div className="fx g10" style={{ padding: '2px 14px 4px', fontSize: 10, color: '#475569' }}>
        <span style={{ color: '#64748b' }}>Sort:</span>
        <span className={'sort' + (sortBy === 'out' ? ' on' : '')}
          onClick={() => onToggleSort('out')}>
          Outstanding{sortBy === 'out' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
        </span>
        <span className={'sort' + (sortBy === 'pct' ? ' on' : '')}
          onClick={() => onToggleSort('pct')}>
          % Collected{sortBy === 'pct' ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '4px 10px 8px' }}>
        {sorted.map(k => {
          const c = closerStats[k];
          const wp = c.sale > 0 ? c.ws / c.sale : 0;
          const sp = c.sale > 0 ? c.si / c.sale : 0;
          const ep = c.sale > 0 ? c.ex / c.sale : 0;
          const pd = c.sale > 0 ? (c.ws + c.si) / c.sale : 0;
          return (
            <div key={k} className="closer-card" onClick={() => onSelectCloser(k)} style={{ cursor: 'pointer' }}>
              <div className="fx ac g6">
                {pd >= 0.999 ? (
                  <div style={{ width: 44, height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(74,222,128,.1)', borderRadius: 5 }}>
                    <span style={{ fontSize: 11 }}>&#9989;</span>
                  </div>
                ) : (
                  <div style={{ width: 44, height: 26, flexShrink: 0 }}>
                    <Gauge w={44} h={26} ws={wp} si={sp} ex={ep} label="" />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="fx jb">
                    <span style={{ color: '#7dd3fc', fontWeight: 700, fontSize: 13 }}>{k}</span>
                    <span style={{ color: '#fb923c', fontWeight: 700, fontSize: 11 }}>{fd(c.bal)}</span>
                  </div>
                  <div style={{ color: '#475569', fontSize: 9 }}>{c.cnt} deals | {c.con}/{c.cnt} contacted</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
