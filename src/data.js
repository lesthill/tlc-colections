// Closer name map
export const CLOSER_NAMES = {
  LH: 'Les Hill', SH: 'Scott Hoffmann', CL: 'Chad Lawson', BL: 'Bernard Lawson',
  TK: 'Tiffany Knight', BH: 'Boyd Hoffmann', LT: 'Lisa Toland', KF: 'Ken Forrest',
};

// First names derived from closer names
export const CLOSER_FIRST = {};
Object.keys(CLOSER_NAMES).forEach(k => { CLOSER_FIRST[k] = CLOSER_NAMES[k].split(' ')[0]; });

// City abbreviations
export const IATA = {
  Boston: 'BOS', 'Ft Lauderdale': 'FTL', Houston: 'HOU', 'San Diego': 'SD',
  Denver: 'DEN', 'Fort Worth': 'FTW', 'Kansas City': 'KC', Albuquerque: 'ABQ', 'Wash DC': 'DC',
};
export function iata(ev) { return IATA[ev] || ev; }

// Tier labels and colors
export const TIER_LABELS = { 9995: '$10K', 25997: '$26K', 39997: '$40K', 46997: '$47K' };
export const TIER_COLORS = { 9995: '#94a3b8', 25997: '#38bdf8', 39997: '#4ade80', 46997: '#fbbf24' };

// Status labels and colors
export const STATUS_NAMES = {
  not_contacted: 'Tap to disposition', contacted: 'Contacted',
  committed: 'Committed', unreachable: 'Unreachable', collected: 'Collected',
};
export const STATUS_COLORS = {
  not_contacted: '#64748b', contacted: '#fbbf24',
  committed: '#4ade80', unreachable: '#f87171', collected: '#38bdf8',
};

// NMI payment link
export const NMI_URL = 'https://secure.nmi.com/merchants/login.php?cookie_check=1&referrer=L21lcmNoYW50cy92aXJ0dWFsdGVybWluYWwucGhwP3RpZD1lODY3NTc1Y2RhODdmM2Y1YzVhMjc4YjAwNTZiMzhhOQ&qed=983885f206e87e86abb4ac5df39f9ca7a7b242fe380841cb9fc93ac31df7bcad';

// localStorage keys
export const STORAGE_KEY = 'tlc-v10';
export const NOTIF_KEY = 'tlc-notif';

// Client records
export const CLIENTS = [
  { id: 'b1', nm: 'William DuQuette', ev: 'Boston', ed: '2025-11-24', cl: 'BL', sale: 46997, col: 2500, bal: 44497, t: 46997, nt: "Founder's Club", rr: 'DECLINED', rn: '691 $18K', ph: '603-234-4546', em: 'billduke32@gmail.com' },
  { id: 'b2', nm: 'Willy Santana', ev: 'Boston', ed: '2025-11-24', cl: 'BL', sale: 9995, col: 3500, bal: 6495, t: 9995, nt: '', rr: 'DECLINED', rn: '<600', ph: '617-686-5290', em: 'santana.willy@icloud.com' },
  { id: 'b3', nm: 'Russell Thompson', ev: 'Boston', ed: '2025-11-24', cl: 'KF', sale: 25997, col: 10000, bal: 15997, t: 25997, nt: '', rr: 'DECLINED', rn: '716', ph: '', em: '' },
  { id: 'f1', nm: 'Luce Pierre-Russon', ev: 'Ft Lauderdale', ed: '2025-12-08', cl: 'LT', sale: 39997, col: 1000, bal: 38997, t: 39997, nt: 'Lawsuit postponed', rr: 'DECLINED', rn: '656 $3K', ph: '816-410-3290', em: 'taisharusson@yahoo.com' },
  { id: 'f2', nm: 'Shannon Burrows', ev: 'Ft Lauderdale', ed: '2025-12-08', cl: 'TK', sale: 39997, col: 12000, bal: 27997, t: 39997, nt: 'UGA', rr: 'RANGE', rn: '5-25k', ph: '561-254-1229', em: 'shannonburrowsrealtor@gmail.com' },
  { id: 'h1', nm: 'Camille Brown', ev: 'Houston', ed: '2025-12-29', cl: 'BH', sale: 39997, col: 10000, bal: 29997, t: 39997, nt: 'UGA', rr: 'RANGE', rn: '0-25k', ph: '713-498-6110', em: 'admin@reiningmoney.com' },
  { id: 'h2', nm: 'Kinshasa Carter', ev: 'Houston', ed: '2025-12-29', cl: 'CL', sale: 25997, col: 9995, bal: 16002, t: 25997, nt: '10k pkg', rr: 'DECLINED', rn: '635', ph: '832-483-9893', em: 'shasacarter@gmail.com' },
  { id: 'h3', nm: 'Raymond DarDar Jr', ev: 'Houston', ed: '2025-12-29', cl: 'KF', sale: 39997, col: 1000, bal: 38997, t: 39997, nt: '', rr: 'DECLINED', rn: '702 $0', ph: '337-296-4461', em: 'raymonddardar@yahoo.com' },
  { id: 'h4', nm: 'Christine Toledo', ev: 'Houston', ed: '2025-12-29', cl: 'SH', sale: 39997, col: 5000, bal: 34997, t: 39997, nt: 'HELOC iffy', rr: 'DECLINED', rn: '718 re-UW', ph: '832-293-7026', em: 'nikebrisnger@gmail.com' },
  { id: 'h5', nm: 'Jason Bishop', ev: 'Houston', ed: '2025-12-29', cl: 'SH', sale: 39997, col: 9995, bal: 30002, t: 39997, nt: '', rr: 'NEED_INFO', rn: 'Verify', ph: '713-882-5552', em: 'scoreboarddude@yahoo.com' },
  { id: 's1', nm: 'Cirilo Mendoza', ev: 'San Diego', ed: '2026-01-12', cl: 'BH', sale: 25997, col: 2000, bal: 23997, t: 25997, nt: '', rr: 'NEED_INFO', rn: 'Need SSN', ph: '619-843-2857', em: 'mendozacirilo700@gmail.com' },
  { id: 's2', nm: 'Anne Mohney', ev: 'San Diego', ed: '2026-01-12', cl: 'TK', sale: 46997, col: 0, bal: 46997, t: 46997, nt: "Founder's Club", rr: 'RANGE', rn: '20-40k', ph: '619-341-9406', em: 'annemohney@gmail.com' },
  { id: 's3', nm: 'Paula Handel', ev: 'San Diego', ed: '2026-01-12', cl: 'TK', sale: 39997, col: 0, bal: 39997, t: 39997, nt: 'Divorce?', rr: 'APPROVED', rn: 'Approved', ph: '619-746-4180', em: 'paulashandel@gmail.com' },
  { id: 's4', nm: 'Chenoa Hernandez', ev: 'San Diego', ed: '2026-01-12', cl: 'TK', sale: 25997, col: 1000, bal: 24997, t: 25997, nt: 'Retirement acct', rr: 'DECLINED', rn: 'Settlements', ph: '209-770-0981', em: 'chengirl209@gmail.com' },
  { id: 'd1', nm: 'Kayla Schultz', ev: 'Denver', ed: '2026-01-19', cl: 'LT', sale: 25997, col: 1000, bal: 24997, t: 25997, nt: 'Banker said no', ph: '970-556-4992', em: 'kessagirl1@gmail.com' },
  { id: 'd2', nm: 'Suzanne Barrett', ev: 'Denver', ed: '2026-01-19', cl: 'LT', sale: 25997, col: 2500, bal: 23497, t: 25997, nt: '$1.5K 2wk + $1K 5wk', ph: '772-882-1245', em: 'suzanne@topdocumentation.com' },
  { id: 'd3', nm: 'Nancy Frazier', ev: 'Denver', ed: '2026-01-19', cl: 'SH', sale: 25997, col: 250, bal: 25747, t: 25997, nt: 'Hail mary', ph: '719-641-6148', em: 'nancy@arrowsconstruction.com' },
  { id: 'd4', nm: 'Katherine Suazo', ev: 'Denver', ed: '2026-01-19', cl: 'TK', sale: 39997, col: 10000, bal: 29997, t: 39997, nt: '$5K 2wk + $5K 5wk', ph: '720-355-4382', em: 'ksuazo2090@gmail.com' },
  { id: 'd5', nm: 'Teresa Ries', ev: 'Denver', ed: '2026-01-19', cl: 'TK', sale: 9995, col: 4760, bal: 5235, t: 9995, nt: '', ph: '304-282-8501', em: 'cassa26525@gmail.com' },
  { id: 'w1', nm: 'Jabbar Thomas', ev: 'Fort Worth', ed: '2026-01-26', cl: 'BL', sale: 39997, col: 0, bal: 39997, t: 39997, nt: 'ACH never funded', rr: 'DECLINED', rn: '620 re-UW', ph: '469-781-7232', em: 'jabgconstruction@engineer.com' },
  { id: 'w2', nm: 'Ashley Lillie', ev: 'Fort Worth', ed: '2026-01-26', cl: 'CL', sale: 39997, col: 10000, bal: 29997, t: 39997, nt: '', ph: '', em: '' },
  { id: 'k1', nm: 'Steven Hooks Sr', ev: 'Kansas City', ed: '2026-02-14', cl: 'BL', sale: 39997, col: 3000, bal: 36997, t: 39997, nt: 'RR in 2 weeks', rr: 'RANGE', rn: 'RR pending', ph: '816-269-5698', em: 'shooksld@gmail.com' },
  { id: 'k2', nm: 'Shanda Walsh', ev: 'Kansas City', ed: '2026-02-14', cl: 'LT', sale: 39997, col: 2500, bal: 37497, t: 39997, nt: 'Bal via RR', rr: 'RANGE', rn: '30-50k', ph: '913-406-3700', em: 'walshs2006@gmail.com' },
  { id: 'k3', nm: 'Sherry Samples', ev: 'Kansas City', ed: '2026-02-14', cl: 'LT', sale: 39997, col: 20000, bal: 19997, t: 39997, nt: 'Bal via CC', ph: '913-634-8747', em: 'machka_sherry@yahoo.com' },
  { id: 'a1', nm: 'Matt Steward', ev: 'Albuquerque', ed: '2026-02-20', cl: 'CL', sale: 39997, col: 10000, bal: 29997, t: 39997, nt: 'Bal RR', rr: 'RANGE', rn: '5-25k', ph: '979-595-8632', em: 'train@mattstewardcoaching.com' },
  { id: 'a2', nm: 'Gene Romero', ev: 'Albuquerque', ed: '2026-02-20', cl: 'CL', sale: 25997, col: 1000, bal: 24997, t: 25997, nt: 'Bal ACH', ph: '505-720-7001', em: 'geno4012@gmail.com' },
  { id: 'a4', nm: 'Anthony Lucero', ev: 'Albuquerque', ed: '2026-02-20', cl: 'LH', sale: 39997, col: 10000, bal: 29997, t: 39997, nt: 'Bal ACH', rr: 'RANGE', rn: '30-40k', ph: '505-269-8788', em: 'trluc57@aol.com' },
  { id: 'a5', nm: 'Becky Gonzalez', ev: 'Albuquerque', ed: '2026-02-20', cl: 'TK', sale: 39997, col: 26997, bal: 13000, t: 39997, nt: 'Bal 3 wks', rr: 'DECLINED', rn: '649 thin', ph: '505-688-1064', em: 'beckygonzalez30@yahoo.com' },
  { id: 'a6', nm: 'Selena Fox-Anderson', ev: 'Albuquerque', ed: '2026-02-20', cl: 'TK', sale: 46997, col: 0, bal: 46997, t: 46997, nt: 'FC \u2014 TSP', rr: 'DECLINED', rn: '680 $9.9K', ph: '505-366-4514', em: 'selenapfox@gmail.com' },
  { id: 'a7', nm: 'Douglas Conrad', ev: 'Albuquerque', ed: '2026-02-20', cl: 'TK', sale: 25997, col: 1000, bal: 24997, t: 25997, nt: 'Bal 3 wks', rr: 'NEED_INFO', rn: 'Verify', ph: '505-702-2902', em: 'fr3sh4200@gmail.com' },
  { id: 'a8', nm: 'Armando Maestas', ev: 'Albuquerque', ed: '2026-02-20', cl: 'TK', sale: 46997, col: 2000, bal: 44997, t: 46997, nt: 'Save @10', rr: 'DECLINED', rn: '723 $0', ph: '', em: '' },
  { id: 'dc1', nm: 'Brenda C Jones', ev: 'Wash DC', ed: '2026-03-06', cl: 'TK', sale: 39997, col: 10000, bal: 29997, t: 39997, nt: 'Grabbing EIN, getting back to us', rr: 'RANGE', rn: '10-25k', ph: '301-442-8890', em: 'bjones@email.com' },
  { id: 'dc2', nm: 'Amy Holland', ev: 'Wash DC', ed: '2026-03-06', cl: 'SH', sale: 39997, col: 5000, bal: 34997, t: 39997, nt: 'WC complete', rr: 'RANGE', rn: '10-30k', ph: '703-555-0142', em: 'aholland@email.com' },
  { id: 'dc3', nm: 'Abelardo Ramirez', ev: 'Wash DC', ed: '2026-03-06', cl: 'LT', sale: 39997, col: 3000, bal: 36997, t: 39997, nt: '', rr: 'RANGE', rn: '10-30k', ph: '202-555-0198', em: 'aramirez@email.com' },
  { id: 'dc4', nm: 'Howard Ashmon', ev: 'Wash DC', ed: '2026-03-06', cl: 'BL', sale: 39997, col: 5000, bal: 34997, t: 39997, nt: 'Waiting on biz info', rr: 'RANGE', rn: '20-35k', ph: '410-555-0176', em: 'hashmon@email.com' },
  { id: 'dc5', nm: 'Dennys Velasquez', ev: 'Wash DC', ed: '2026-03-06', cl: 'SH', sale: 39997, col: 1000, bal: 38997, t: 39997, nt: '', rr: 'RANGE', rn: '10-30k', ph: '571-555-0133', em: 'dvelasquez@email.com' },
  { id: 'dc6', nm: 'Mercy Peterson', ev: 'Wash DC', ed: '2026-03-06', cl: 'SH', sale: 25997, col: 1000, bal: 24997, t: 25997, nt: '', rr: 'RANGE', rn: '30-50k', ph: '240-555-0155', em: 'mpeterson@email.com' },
  { id: 'dc7', nm: 'Tyrone Harrison', ev: 'Wash DC', ed: '2026-03-06', cl: 'BL', sale: 25997, col: 3000, bal: 22997, t: 25997, nt: '', rr: 'RANGE', rn: '0-10k', ph: '301-555-0187', em: 'tharrison@email.com' },
  { id: 'dc8', nm: 'Kyle Kinzer', ev: 'Wash DC', ed: '2026-03-06', cl: 'TK', sale: 46997, col: 46997, bal: 0, t: 46997, nt: 'PIF at workshop', ph: '', em: '' },
  { id: 'dc9', nm: 'Willie Taylor', ev: 'Wash DC', ed: '2026-03-06', cl: 'SH', sale: 25997, col: 1500, bal: 24497, t: 25997, nt: '', rr: 'RANGE', rn: '10-30k', ph: '202-555-0144', em: 'wtaylor@email.com' },
  { id: 'dc10', nm: 'April Parker', ev: 'Wash DC', ed: '2026-03-06', cl: 'LT', sale: 39997, col: 5000, bal: 34997, t: 39997, nt: '', rr: 'RANGE', rn: '20-40k', ph: '703-555-0166', em: 'aparker@email.com' },
  { id: 'dc11', nm: 'Ralph Gill', ev: 'Wash DC', ed: '2026-03-06', cl: 'BL', sale: 46997, col: 1000, bal: 45997, t: 46997, nt: '', rr: 'DECLINED', rn: '590', ph: '410-555-0199', em: 'rgill@email.com' },
  { id: 'dc12', nm: 'Julie Kozloski', ev: 'Wash DC', ed: '2026-03-06', cl: 'TK', sale: 46997, col: 46997, bal: 0, t: 46997, nt: 'PIF at workshop', ph: '', em: '' },
  { id: 'dc13', nm: 'Bridgette Ahima', ev: 'Wash DC', ed: '2026-03-06', cl: 'LH', sale: 25997, col: 20000, bal: 5997, t: 25997, nt: '', rr: 'APPROVED', rn: 'Approved', ph: '301-555-0122', em: 'bahima@email.com' },
  { id: 'dc14', nm: 'Ricco Carman', ev: 'Wash DC', ed: '2026-03-06', cl: 'TK', sale: 39997, col: 1000, bal: 38997, t: 39997, nt: '', rr: 'DECLINED', rn: '620', ph: '202-555-0177', em: 'rcarman@email.com' },
  { id: 'dc15', nm: 'Dennis Green', ev: 'Wash DC', ed: '2026-03-06', cl: 'BL', sale: 46997, col: 10000, bal: 36997, t: 46997, nt: '', rr: 'RANGE', rn: '25-40k', ph: '571-555-0188', em: 'dgreen@email.com' },
  { id: 'dc16', nm: 'Gary Reed', ev: 'Wash DC', ed: '2026-03-06', cl: 'LH', sale: 39997, col: 4000, bal: 35997, t: 39997, nt: '', rr: 'RANGE', rn: '20-35k', ph: '240-555-0133', em: 'greed@email.com' },
  { id: 'dc17', nm: 'Christine Bridewell', ev: 'Wash DC', ed: '2026-03-06', cl: 'CL', sale: 39997, col: 2500, bal: 37497, t: 39997, nt: '', rr: 'RANGE', rn: '15-30k', ph: '703-555-0155', em: 'cbridewell@email.com' },
];

// Spiff tiers config
export const SPIFF_TIERS = [
  { sph: 4500, label: 'TIER I', bonus: '$500', color: '#4ade80' },
  { sph: 8500, label: 'TIER II', bonus: '$600', color: '#38bdf8' },
  { sph: 9500, label: 'II+', bonus: '$750', color: '#a78bfa' },
  { sph: 11000, label: 'II++', bonus: '$1,000', color: '#fb923c' },
];
export const SPIFF_MAX_SPH = 11000;
export const DC_HEADS = 46;
