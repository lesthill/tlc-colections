import { CLIENTS, SPIFF_TIERS, SPIFF_MAX_SPH, DC_HEADS } from '../data.js';
import { fd } from '../utils.js';

export function SpiffTracker({ gdn }) {
  const dcClients = CLIENTS.filter(c => c.ev === 'Wash DC');
  let dcColTotal = 0, dcSinceTotal = 0, dcSaleTotal = 0;
  dcClients.forEach(c => {
    dcColTotal += c.col;
    dcSinceTotal += gdn(c.id, 'since');
    dcSaleTotal += c.sale;
  });
  const dcCollected = dcColTotal + dcSinceTotal;
  const dcSPH = DC_HEADS > 0 ? Math.round(dcCollected / DC_HEADS) : 0;
  const pctFill = Math.min(dcSPH / SPIFF_MAX_SPH, 1);

  let nextTier = null;
  for (let i = 0; i < SPIFF_TIERS.length; i++) {
    if (dcSPH < SPIFF_TIERS[i].sph) { nextTier = SPIFF_TIERS[i]; break; }
  }
  const nextNeed = nextTier ? Math.max(0, nextTier.sph * DC_HEADS - dcCollected) : 0;

  const fillColor = dcSPH >= 10000
    ? 'linear-gradient(90deg,#4ade80,#38bdf8,#a78bfa,#fb923c)'
    : dcSPH >= 9000 ? 'linear-gradient(90deg,#4ade80,#38bdf8,#a78bfa)'
    : dcSPH >= 8000 ? 'linear-gradient(90deg,#4ade80,#38bdf8)'
    : '#4ade80';

  return (
    <div style={{
      background: 'rgba(15,26,42,.6)', border: '1px solid rgba(74,222,128,.15)',
      borderRadius: 10, padding: '10px 14px', marginBottom: 8, height: 140, overflow: 'hidden',
      animation: 'spiffGlow 3s ease-in-out infinite',
    }}>
      {/* Row 1: title + SPH */}
      <div className="fx jb ac" style={{ marginBottom: 6 }}>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 900, letterSpacing: 3,
            background: 'linear-gradient(90deg,#4ade80,#38bdf8)', WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>DC SPIFF</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 1 }}>
            {fd(dcCollected)} collected of {fd(dcSaleTotal)} · {DC_HEADS} BU
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: 28, fontWeight: 900,
            color: dcSPH >= 4500 ? 'var(--green)' : 'var(--text-primary)',
            animation: dcSPH >= 4500 ? 'amtGlow 2s ease-in-out infinite' : 'none',
          }}>{fd(dcSPH)}</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)' }}>collected per BU</div>
        </div>
      </div>

      {/* Thermometer */}
      <div style={{
        position: 'relative', height: 14, background: 'rgba(15,23,42,.9)',
        borderRadius: 7, overflow: 'visible', marginBottom: 8,
        border: '1px solid rgba(74,222,128,.1)',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: Math.round(pctFill * 100) + '%',
          background: fillColor, borderRadius: 7,
          boxShadow: '0 0 8px rgba(74,222,128,.3)',
          transition: 'width .5s ease',
        }} />
        {/* Shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: Math.round(pctFill * 100) + '%',
          overflow: 'hidden', borderRadius: 7,
        }}>
          <div style={{
            position: 'absolute', top: 0, height: '100%', width: '40%',
            background: 'linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent)',
            animation: 'spiffShimmer 2s ease-in-out infinite',
          }} />
        </div>
        {/* Tier markers */}
        {SPIFF_TIERS.map(t => {
          const pos = Math.round((t.sph / SPIFF_MAX_SPH) * 100);
          return (
            <div key={t.sph} style={{
              position: 'absolute', top: -2, bottom: -2, left: pos + '%',
              width: 1, background: t.color + '40',
            }} />
          );
        })}
      </div>

      {/* Tier cards */}
      <div className="fx g4" style={{ alignItems: 'stretch' }}>
        {SPIFF_TIERS.map(t => {
          const hit = dcSPH >= t.sph;
          const need = Math.max(0, t.sph * DC_HEADS - dcCollected);
          const isNext = nextTier && t.sph === nextTier.sph;
          const bg = hit ? 'rgba(74,222,128,.08)' : isNext ? 'rgba(0,0,0,.3)' : 'rgba(0,0,0,.15)';
          const bdr = hit ? t.color + '44' : isNext ? t.color + '66' : t.color + '22';
          return (
            <div key={t.sph} style={{
              flex: 1, background: bg, border: `1px solid ${bdr}`,
              borderRadius: 6, padding: '4px 2px', textAlign: 'center',
              animation: isNext ? 'tierPulse 2s ease-in-out infinite' : 'none',
            }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: t.color }}>
                {t.label}{hit ? ' \u2713' : ''}
              </div>
              {hit ? (
                <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-primary)' }}>{t.bonus}</div>
              ) : (
                <div style={{
                  fontSize: 10, fontWeight: 900,
                  color: isNext ? '#fff' : 'var(--text-secondary)',
                  animation: isNext ? 'amtGlow 2s ease-in-out infinite' : 'none',
                }}>{fd(need)}</div>
              )}
              <div style={{ fontSize: 7, color: 'var(--text-muted)' }}>{t.bonus} ea</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
