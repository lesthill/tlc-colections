import { Gauge } from './Gauge.jsx';
import { fd, fp } from '../utils.js';

export function Header({ tS, tW, tSi, tE, openCount, onRefresh, onToggleSettings, showReset, setShowReset, onReset }) {
  const pp = tS > 0 ? (tW + tSi) / tS : 0;
  const tOut = tS - tW - tSi;

  return (
    <>
      {/* Top row: branding + buttons */}
      <div className="fx jb ac" style={{ marginBottom: 8 }}>
        <div>
          <div className="tag">TLC COLLECTIONS</div>
          <div style={{ fontSize: 9, color: '#334155', letterSpacing: 1, cursor: 'pointer' }} onClick={onRefresh}>v56</div>
        </div>
        <div className="fx g6">
          <button style={{ background: 'transparent', border: '1px solid rgba(30,58,95,.3)', color: '#7dd3fc', padding: '6px 10px', fontSize: 16, borderRadius: 6, cursor: 'pointer' }}
            onClick={onToggleSettings}>&#9881;</button>
          <button style={{ background: 'transparent', border: '1px solid rgba(74,222,128,.25)', color: '#4ade80', padding: '6px 10px', fontSize: 13, borderRadius: 6, cursor: 'pointer' }}
            onClick={onRefresh}>&#x21bb;</button>
          {showReset ? (
            <>
              <button style={{ background: '#f87171', border: 'none', color: '#fff', padding: '8px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer' }}
                onClick={() => { onReset(); setShowReset(false); }}>Clear</button>
              <button className="btn" style={{ fontSize: 12, padding: '8px 12px', cursor: 'pointer' }}
                onClick={() => setShowReset(false)}>X</button>
            </>
          ) : (
            <button style={{ background: 'transparent', border: '1px solid rgba(248,113,113,.2)', color: '#f87171', padding: '6px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer' }}
              onClick={() => setShowReset(true)}>Reset</button>
          )}
        </div>
      </div>

      {/* Team gauge row */}
      <div className="fx ac g10" style={{ marginBottom: 8 }}>
        <div style={{ width: 80, height: 46, flexShrink: 0 }}>
          <Gauge w={80} h={46} ws={tS > 0 ? tW / tS : 0} si={tS > 0 ? tSi / tS : 0} ex={tS > 0 ? tE / tS : 0} label={fp(pp)} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fb923c' }}>{fd(tOut > 0 ? tOut : 0)}</div>
          <div style={{ color: '#475569', fontSize: 9 }}>outstanding</div>
          <div className="fx g6" style={{ fontSize: 10, marginTop: 2 }}>
            <span className="grn">WS:{fd(tW)}</span>
            {tSi > 0 && <span className="blu">+{fd(tSi)}</span>}
            {tE > 0 && <span className="ylw">Potential:{fd(tE)}</span>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>{openCount}</div>
          <div style={{ fontSize: 8, fontWeight: 700, color: '#475569', letterSpacing: 1 }}>OPEN</div>
        </div>
      </div>
    </>
  );
}
