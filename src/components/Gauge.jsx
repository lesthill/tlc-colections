import { fp } from '../utils.js';

// SVG half-circle gauge — matches original svg() function exactly
// ws/si/ex are fractions of total (0-1), not raw amounts
export function Gauge({ w, h, ws, si, ex, label }) {
  const r = w * 0.4;
  const lw = w * 0.13;
  const cx = w / 2;
  const cy = h - 2;

  function arcPath(start, end) {
    const pts = [];
    for (let i = 0; i <= 30; i++) {
      const t = start + (end - start) * (i / 30);
      const a = Math.PI + t * Math.PI;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(' ');
  }

  function Arc({ s, e, color }) {
    return <polyline points={arcPath(s, e)} fill="none" stroke={color} strokeWidth={lw} strokeLinecap="round" />;
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Arc s={0} e={1} color="#1e293b" />
      {ws > 0 && <Arc s={0} e={Math.min(ws, 1)} color="var(--green)" />}
      {si > 0 && <Arc s={ws} e={Math.min(ws + si, 1)} color="var(--blue)" />}
      {ex > 0 && <Arc s={ws + si} e={Math.min(ws + si + ex, 1)} color="rgba(251,191,36,.3)" />}
      {label && (
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text-primary)"
          fontSize={w * 0.22} fontWeight="700" fontFamily="var(--font-system)">
          {label}
        </text>
      )}
    </svg>
  );
}

// Done badge (for PIF clients)
export function DoneBadge({ isPif }) {
  return (
    <div className={`done${isPif ? ' pif-anim' : ''}`}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '20px' }}>&#10003;</div>
        <div style={{ fontSize: '8px', color: 'var(--green)', fontWeight: 700, letterSpacing: '1px' }}>PIF</div>
      </div>
    </div>
  );
}
