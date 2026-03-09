import { STORAGE_KEY, NOTIF_KEY } from './data.js';

// Format dollar amount
export function fd(n) { return '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 }); }

// Format percentage
export function fp(n) { return Math.round(n * 100) + '%'; }

// Due date: 3rd Friday after event date (foundation deadline)
export function dueDate(sd) {
  var d = new Date(sd + 'T12:00:00');
  var c = 0;
  while (c < 3) { d.setDate(d.getDate() + 1); if (d.getDay() === 5) c++; }
  return d;
}

// Fourth Friday after event date (visibility cutoff)
export function fourthFriday(sd) {
  var d = new Date(sd + 'T12:00:00');
  var c = 0;
  while (c < 4) { d.setDate(d.getDate() + 1); if (d.getDay() === 5) c++; }
  return d;
}

// Days left until foundation deadline
export function daysLeft(sd) { return Math.ceil((dueDate(sd) - new Date()) / 864e5); }

// Weeks since event
export function weeksAgo(ed) { return Math.round((new Date() - new Date(ed + 'T12:00:00')) / (7 * 864e5)); }

// Format notification template
export function fmtNotif(tpl, nm, ev, amt, dl) {
  return tpl.replace('{name}', nm).replace('{event}', ev).replace('{amount}', amt).replace('{days}', dl <= 0 ? 'OVERDUE' : dl);
}

// Default notification templates
export const DEF_NTITLE = 'Time to collect {amount}';
export const DEF_NBODY = 'Call {name} ({event}) - {days} days left to collect.';
