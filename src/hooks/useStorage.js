import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEY } from '../data.js';

export function useStorage() {
  const [trackedData, setTrackedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v) setTrackedData(JSON.parse(v));
    } catch (e) {}
    setLoading(false);
  }, []);

  const save = useCallback(d => {
    setTrackedData(d);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {}
  }, []);

  // Get tracked field value
  const gd = useCallback((id, f) => (trackedData[id] || {})[f] || '', [trackedData]);

  // Get tracked field as number
  const gdn = useCallback((id, f) => parseFloat((trackedData[id] || {})[f]) || 0, [trackedData]);

  // Update a single field
  const upd = useCallback((id, f, v) => {
    const next = { ...trackedData, [id]: { ...(trackedData[id] || {}), [f]: v } };
    // Auto-log ACH sent with timestamp
    if (f === 'cs' && v === 'collected') {
      next[id].ct = Date.now();
    }
    save(next);
  }, [trackedData, save]);

  // PIF: mark as paid in full, save previous state for undo
  const doPif = useCallback((id, bal) => {
    const prev = { since: gd(id, 'since'), cs: gd(id, 'cs'), exp: gd(id, 'exp') };
    const next = { ...trackedData, [id]: { ...(trackedData[id] || {}), _prev: JSON.stringify(prev), since: String(bal), cs: 'collected', _pif: '1', ct: Date.now() } };
    save(next);
  }, [trackedData, save, gd]);

  // Undo PIF
  const undoPif = useCallback((id) => {
    let p;
    try { p = JSON.parse(gd(id, '_prev')); } catch (e) { p = {}; }
    const next = { ...trackedData, [id]: { ...(trackedData[id] || {}), since: p.since || '', cs: p.cs || 'not_contacted', exp: p.exp || '', _pif: '', _prev: '' } };
    save(next);
  }, [trackedData, save, gd]);

  // Set expected to PIF amount
  const doPifExp = useCallback((id, amount) => {
    const next = { ...trackedData, [id]: { ...(trackedData[id] || {}), _prevExp: gd(id, 'exp'), exp: String(amount) } };
    save(next);
  }, [trackedData, save, gd]);

  // Undo expected PIF
  const undoPifExp = useCallback((id) => {
    const next = { ...trackedData, [id]: { ...(trackedData[id] || {}), exp: gd(id, '_prevExp') || '0', _prevExp: '' } };
    save(next);
  }, [trackedData, save, gd]);

  // Reset all
  const doReset = useCallback(() => {
    setTrackedData({});
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }, []);

  return { trackedData, loading, gd, gdn, upd, doPif, undoPif, doPifExp, undoPifExp, doReset };
}
