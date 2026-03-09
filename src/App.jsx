import { useState, useEffect, useRef, useCallback } from 'react';
import { CLIENTS, CLOSER_NAMES, iata, NOTIF_KEY } from './data.js';
import { fd, fourthFriday, daysLeft, fmtNotif, DEF_NTITLE, DEF_NBODY } from './utils.js';
import { useStorage } from './hooks/useStorage.js';
import { Header } from './components/Header.jsx';
import { CloserPanel } from './components/CloserPanel.jsx';
import { CloserGrid } from './components/CloserGrid.jsx';
import { ClientCard } from './components/ClientCard.jsx';
import { AchModal } from './components/AchModal.jsx';
import { Settings } from './components/Settings.jsx';
import { SpiffTracker } from './components/SpiffTracker.jsx';
import { LockScreen } from './components/LockScreen.jsx';
import { PocketDealCard } from './components/PocketDealCard.jsx';
import './styles.css';

const CLOSER_KEYS = Object.keys(CLOSER_NAMES);

function nextSatForPocket(ts) {
  const d = new Date(ts);
  const day = d.getDay();
  const diff = day === 6 ? 7 : 6 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

export default function App() {
  const { trackedData, loading, gd, gdn, upd, doPif, undoPif, addPayment, removePayment, getPayments, addExpected, removeExpected, getExpected, collectExpected, pocketDeals, addPocketDeal, updatePocketDeal, removePocketDeal, doReset } = useStorage();

  // UI state
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('bal');
  const [sortDir, setSortDir] = useState('desc');
  const [closerSortBy, setCloserSortBy] = useState('out');
  const [closerSortDir, setCloserSortDir] = useState('desc');
  const [expanded, setExpanded] = useState(null);
  const [showReset, setShowReset] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [jump, setJump] = useState(null);
  const [activeEvs, setActiveEvs] = useState({});
  const [achPending, setAchPending] = useState(null);
  const [customNotif, setCustomNotif] = useState(false);

  // Notification state (persisted)
  const [notifConfig, setNotifConfig] = useState({});
  const [nTitle, setNTitle] = useState(DEF_NTITLE);
  const [nBody, setNBody] = useState(DEF_NBODY);
  const [nTime, setNTime] = useState('09:00');

  // Load notification config from localStorage on mount
  useEffect(() => {
    try { const nc = localStorage.getItem('tlc-notif'); if (nc) setNotifConfig(JSON.parse(nc)); } catch (e) {}
    try { const t = localStorage.getItem('tlc-ntitle'); if (t) setNTitle(t); } catch (e) {}
    try { const b = localStorage.getItem('tlc-nbody'); if (b) setNBody(b); } catch (e) {}
    try { const tm = localStorage.getItem('tlc-ntime'); if (tm) setNTime(tm); } catch (e) {}
  }, []);

  // Persist notification config
  useEffect(() => { try { localStorage.setItem('tlc-notif', JSON.stringify(notifConfig)); } catch (e) {} }, [notifConfig]);
  useEffect(() => { try { localStorage.setItem('tlc-ntitle', nTitle); } catch (e) {} }, [nTitle]);
  useEffect(() => { try { localStorage.setItem('tlc-nbody', nBody); } catch (e) {} }, [nBody]);
  useEffect(() => { try { localStorage.setItem('tlc-ntime', nTime); } catch (e) {} }, [nTime]);

  // Refs for scroll body positioning
  const ftopRef = useRef(null);
  const sbRef = useRef(null);

  // Adjust scroll body margin-top when header changes
  const adjustScrollBody = useCallback(() => {
    setTimeout(() => {
      const f = ftopRef.current;
      const s = sbRef.current;
      if (f && s) {
        s.style.marginTop = f.offsetHeight + 'px';
        s.style.height = 'calc(100vh - ' + f.offsetHeight + 'px)';
      }
    }, 20);
  }, []);

  useEffect(() => { adjustScrollBody(); }, [filter, showSettings, showReset, activeEvs, adjustScrollBody]);
  useEffect(() => {
    window.addEventListener('resize', adjustScrollBody);
    return () => window.removeEventListener('resize', adjustScrollBody);
  }, [adjustScrollBody]);

  // --- Data processing ---
  const now = new Date();

  // Filter visible clients: not past 4th Friday cutoff, and if collected hide after 1 day
  const visible = CLIENTS.filter(c => {
    if (c.bal <= 0) return false;
    const ff = fourthFriday(c.ed);
    if (now > ff) return false;
    const cs = gd(c.id, 'cs');
    if (cs === 'collected') {
      const ct = (trackedData[c.id] || {}).ct;
      if (ct && (Date.now() - ct) > 864e5) return false;
    }
    return true;
  });

  // Apply event filters
  const evFiltered = Object.keys(activeEvs).length > 0
    ? visible.filter(c => activeEvs[c.ev])
    : visible;

  // Apply closer filter
  const filtered = filter === 'ALL'
    ? evFiltered
    : evFiltered.filter(c => c.cl === filter);

  // Open count
  const openCount = filtered.length;

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortBy === 'bal') cmp = a.bal - b.bal;
    else if (sortBy === 'nm') cmp = a.nm.localeCompare(b.nm);
    else if (sortBy === 'ev') cmp = a.ev.localeCompare(b.ev) || a.ed.localeCompare(b.ed);
    else if (sortBy === 'cl') cmp = a.cl.localeCompare(b.cl);
    else if (sortBy === 'dl') cmp = daysLeft(a.ed) - daysLeft(b.ed);
    return sortDir === 'desc' ? -cmp : cmp;
  });

  // Compute totals
  let tS = 0, tW = 0, tSi = 0, tE = 0;
  evFiltered.forEach(c => {
    tS += c.sale;
    tW += c.col;
    tSi += gdn(c.id, 'since');
    tE += gdn(c.id, 'exp');
  });

  // Compute closer stats
  const cls = {};
  CLOSER_KEYS.forEach(k => { cls[k] = { bal: 0, cnt: 0, sale: 0, ws: 0, si: 0, ex: 0, con: 0 }; });
  evFiltered.forEach(c => {
    const k = c.cl;
    if (!cls[k]) return;
    const si = gdn(c.id, 'since');
    const ex = gdn(c.id, 'exp');
    const cs = gd(c.id, 'cs');
    cls[k].cnt++;
    cls[k].sale += c.sale;
    cls[k].ws += c.col;
    cls[k].si += si;
    cls[k].ex += ex;
    cls[k].bal += c.bal - si;
    if (cs && cs !== 'not_contacted') cls[k].con++;
  });

  // Filter pocket deals by closer + count them in stats
  const activePockets = pocketDeals.filter(d => {
    const exp = nextSatForPocket(d.created);
    return exp > now;
  });
  const filteredPockets = filter === 'ALL' ? activePockets : activePockets.filter(d => d.closer === filter);
  activePockets.forEach(d => {
    if (d.closer && cls[d.closer]) {
      cls[d.closer].cnt++;
      if (d.amount > 0) {
        cls[d.closer].sale += d.amount;
        cls[d.closer].bal += d.amount;
      }
    }
  });

  // Unique visible events + event outstanding balances
  const visEvs = [...new Set(visible.map(c => c.ev))];
  const evBals = {};
  visible.forEach(c => { evBals[c.ev] = (evBals[c.ev] || 0) + (c.bal - gdn(c.id, 'since')); });

  // --- Actions ---
  function togEv(ev) {
    if (ev === 'ALL') { setActiveEvs({}); }
    else { setActiveEvs(prev => { const next = { ...prev }; if (next[ev]) delete next[ev]; else next[ev] = true; return next; }); }
  }

  function jumpTo(id) {
    setExpanded(id);
    setJump(id);
    setTimeout(() => {
      const el = document.getElementById('c-' + id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
    setTimeout(() => setJump(null), 2000);
  }

  function dialGoTo(ph) {
    if (!ph) return;
    const cleaned = ph.replace(/\D/g, '');
    try { navigator.clipboard.writeText(cleaned); } catch (e) {}
    window.location.href = 'com.logmein.gotoconnect://dial?number=' + cleaned;
  }

  function doRefresh() {
    try { if ('caches' in window) { caches.keys().then(ks => ks.forEach(k => caches.delete(k))); } } catch (e) {}
    window.location.reload();
  }

  function askACH(id, name, amount) { setAchPending({ id, name, amount: typeof amount === 'number' ? fd(amount) : amount }); }

  async function sendACH(id, name, amount, withAmount) {
    const firstName = name.split(' ')[0];
    try {
      const resp = await fetch(import.meta.env.BASE_URL + 'ach-form.pdf');
      const pdfBytes = await resp.arrayBuffer();
      const PDFLib = await import('pdf-lib');
      const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      const pg = pages[0];
      const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
      const h = pg.getHeight();
      if (withAmount) pg.drawText(amount, { x: 282, y: h - 448, size: 11, font, color: PDFLib.rgb(0, 0, 0) });
      const filledBytes = await pdfDoc.save();
      const blob = new Blob([filledBytes], { type: 'application/pdf' });
      const file = new File([blob], 'ACH_Form_' + name.replace(/\s+/g, '_') + '.pdf', { type: 'application/pdf' });
      const msg = 'Hi ' + firstName + ',\n\nPlease fill out the attached ACH Collection Form and return it at your earliest convenience.\n\nAmount Due: ' + amount + '\n\nThank you,\nTax Lien Code\n(888) 333-9403';
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'ACH Collection Form - Tax Lien Code', text: msg, files: [file] });
        if (id) {
          const ts_now = new Date();
          const ts = ts_now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + ts_now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          const prev = gd(id, 'cn');
          const note = 'ACH sent ' + ts + (withAmount ? ' (' + amount + ')' : ' (blank)');
          upd(id, 'cn', prev ? (prev + ' | ' + note) : note);
        }
      } else {
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
      }
    } catch (e) {
      alert('PDF error: ' + e.message);
    }
    setAchPending(null);
  }

  function testNotif() {
    if (!('Notification' in window)) { alert('Install to Home Screen first'); return; }
    if (Notification.permission !== 'granted') { alert('Enable notifications first'); return; }
    const sample = CLIENTS.filter(c => c.bal > 0);
    const pick = sample[Math.floor(Math.random() * sample.length)] || { nm: 'Anthony Lucero', ev: 'Albuquerque', cl: 'LH', bal: 29997, id: 'a4' };
    const rem = pick.bal - gdn(pick.id, 'since');
    const dl = daysLeft(pick.ed);
    try {
      const n = new Notification(fmtNotif(nTitle, pick.nm, pick.ev, fd(rem), dl), {
        body: fmtNotif(nBody, pick.nm, pick.ev, fd(rem), dl),
        tag: 'test-' + Date.now(),
      });
      if (navigator.setAppBadge) navigator.setAppBadge(1);
      n.onclick = () => { window.focus(); if (navigator.clearAppBadge) navigator.clearAppBadge(); jumpTo(pick.id); };
    } catch (e) { alert('Error: ' + e.message); }
  }

  const [, forceRender] = useState(0);
  function reqPerm() { if ('Notification' in window) Notification.requestPermission().then(() => forceRender(n => n + 1)); }

  function toggleSort(field) {
    if (sortBy === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortDir('desc'); }
  }

  function toggleCloserSort(field) {
    if (closerSortBy === field) setCloserSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setCloserSortBy(field); setCloserSortDir('desc'); }
  }

  function toggleNotif(k) {
    setNotifConfig(prev => {
      const cfg = prev[k];
      if (!cfg) return { ...prev, [k]: { on: true, days: [1, 3, 7] } };
      return { ...prev, [k]: { ...cfg, on: !cfg.on } };
    });
  }

  function toggleDay(k, d) {
    setNotifConfig(prev => {
      const cfg = prev[k] || { on: true, days: [] };
      const days = cfg.days || [];
      const newDays = days.indexOf(d) >= 0 ? days.filter(x => x !== d) : [...days, d];
      return { ...prev, [k]: { ...cfg, days: newDays } };
    });
  }

  function resetNotif() {
    setNTitle(DEF_NTITLE);
    setNBody(DEF_NBODY);
    setNTime('09:00');
    setCustomNotif(false);
  }

  // --- Render ---
  if (loading) return <div className="loading">Loading...</div>;

  const today = new Date();
  const footerDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <>
      <LockScreen />

      {showSettings && (
        <Settings
          onClose={() => setShowSettings(false)}
          notifConfig={notifConfig}
          onToggleNotif={toggleNotif}
          onToggleDay={toggleDay}
          nTitle={nTitle}
          onSetNTitle={setNTitle}
          nBody={nBody}
          onSetNBody={setNBody}
          nTime={nTime}
          onSetNTime={setNTime}
          customNotif={customNotif}
          setCustomNotif={setCustomNotif}
          onTestNotif={testNotif}
          onResetNotif={resetNotif}
          onReqPerm={reqPerm}
        />
      )}

      <div className="ftop" ref={ftopRef}>
        <div className="hdr">
          <Header
            tS={tS}
            tW={tW}
            tSi={tSi}
            tE={tE}
            openCount={openCount}
            onRefresh={doRefresh}
            onToggleSettings={() => setShowSettings(s => !s)}
            showReset={showReset}
            setShowReset={setShowReset}
            onReset={doReset}
          />
          <div style={{ position: 'relative', height: 156 }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              opacity: filter === 'ALL' ? 1 : 0,
              transition: 'opacity .25s ease',
              pointerEvents: filter === 'ALL' ? 'auto' : 'none',
            }}>
              <SpiffTracker gdn={gdn} />
            </div>
            {filter !== 'ALL' && cls[filter] && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                animation: 'fadeIn .25s ease',
              }}>
                <CloserPanel
                  closerKey={filter}
                  closerStats={cls[filter]}
                  closerNames={CLOSER_NAMES}
                />
              </div>
            )}
          </div>
        </div>

        {/* Closer pills */}
        <div className="closer-bar">
          <div className="pills">
            <span className={'pill all' + (filter === 'ALL' ? ' on' : '')} onClick={() => setFilter('ALL')}>ALL</span>
            {CLOSER_KEYS.map(k => {
              const hasCl = cls[k].cnt > 0;
              return (
                <span key={k}
                  className={'pill' + (filter === k ? ' on' : '') + (!hasCl ? ' gry' : '')}
                  onClick={() => hasCl && setFilter(filter === k ? 'ALL' : k)}
                >{k}</span>
              );
            })}
          </div>
        </div>
      </div>

      <div id="sb" ref={sbRef} style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '10px 0' }}>

        {/* Event pills */}
        <div style={{ padding: '0 10px 8px', overflowX: 'auto' }}>
          <div className="fx g4" style={{ flexWrap: 'wrap' }}>
            <span className={'evpill' + (Object.keys(activeEvs).length === 0 ? ' on' : '')} onClick={() => togEv('ALL')}>ALL</span>
            {visEvs.map(ev => (
              <span key={ev} className={'evpill' + (activeEvs[ev] ? ' on' : '')} onClick={() => togEv(ev)}>
                {iata(ev)}
                <span style={{ fontSize: 10, color: '#fb923c', fontWeight: 700 }}>{evBals[ev] >= 1000 ? Math.round(evBals[ev] / 1000) + 'K' : fd(evBals[ev] || 0)}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Closer grid (only when filter='ALL') */}
        {filter === 'ALL' && (
          <CloserGrid
            closerStats={cls}
            closerNames={CLOSER_NAMES}
            sortBy={closerSortBy}
            sortDir={closerSortDir}
            onToggleSort={toggleCloserSort}
            onSelectCloser={k => setFilter(k)}
          />
        )}

        {/* Sort bar */}
        <div className="fx jb ac" style={{ padding: '6px 14px' }}>
          {[
            { key: 'bal', label: 'Balance' },
            { key: 'nm', label: 'Name' },
            { key: 'ev', label: 'Event' },
            { key: 'cl', label: 'Closer' },
            { key: 'dl', label: 'Deadline' },
          ].map(s => (
            <span key={s.key} className={'sort' + (sortBy === s.key ? ' on' : '')} onClick={() => toggleSort(s.key)}>
              {s.label} {sortBy === s.key ? (sortDir === 'desc' ? '\u2193' : '\u2191') : ''}
            </span>
          ))}
        </div>

        {/* Pocket Deals */}
        {filteredPockets.length > 0 && (
          <div style={{ padding: '0 10px 4px' }}>
            {filteredPockets.map(d => (
              <PocketDealCard key={d.id} deal={d} onUpdate={updatePocketDeal} onRemove={removePocketDeal} />
            ))}
          </div>
        )}
        <div style={{ padding: '0 10px 8px' }}>
          <span onClick={() => addPocketDeal({ name: '', amount: 0, event: '', closer: filter !== 'ALL' ? filter : '', phone: '', email: '', notes: '' })} style={{
            display: 'block', textAlign: 'center', padding: '10px 0', borderRadius: 8,
            background: 'rgba(167,139,250,.06)', border: '1px dashed rgba(167,139,250,.25)',
            color: '#a78bfa', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>+ New Pocket Deal</span>
        </div>

        {/* Client cards */}
        {sorted.map(c => (
          <ClientCard
            key={c.id}
            client={c}
            gd={gd}
            gdn={gdn}
            upd={upd}
            doPif={id => doPif(id, c.bal - gdn(c.id, 'since'))}
            undoPif={undoPif}
            addExpected={addExpected}
            removeExpected={removeExpected}
            getExpected={getExpected}
            collectExpected={collectExpected}
            expanded={expanded === c.id}
            onToggleExpand={() => setExpanded(expanded === c.id ? null : c.id)}
            jump={jump === c.id}
            onAskACH={askACH}
            onDialGoTo={dialGoTo}
            addPayment={addPayment}
            removePayment={removePayment}
            getPayments={getPayments}
          />
        ))}

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px 0 40px', color: 'var(--text-dim)', fontSize: 11 }}>
          <div>LH // {footerDate}</div>
          <div style={{ fontSize: 8, letterSpacing: 4, color: 'var(--text-faint)', marginTop: 6 }}>TLC COLLECTIONS</div>
        </div>
      </div>

      <AchModal pending={achPending} onSend={sendACH} onClose={() => setAchPending(null)} />
    </>
  );
}
