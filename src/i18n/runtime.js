// Helpers used by SiteView and StoreView.
// tr(): English -> Arabic at render time, so Arabic pages are rendered in Arabic on the server.
import React from 'react';
import { DL_AR } from './ar-dictionary';

const norm = (s) => s.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
let D = null;
const dict = () => D || (D = Object.fromEntries(Object.entries(DL_AR).map(([k, v]) => [norm(k), v])));

// Same rules the site used before: exact match, then a few patterns (lists, quantities, times...).
export function trAr(raw) {
  const t = norm(raw); if (!t || !/[A-Za-z]/.test(t)) return null;
  const d = dict(); if (d[t] != null) return d[t];
  let m, b;
  if (/\s→$/.test(t) && (b = trAr(t.replace(/\s*→$/, '')))) return b + ' ←';
  if (t.includes(' · ')) { const ps = t.split(' · ').map((p) => /[A-Za-z]/.test(p) ? trAr(p) : p); if (ps.every(Boolean)) return ps.join(' · '); }
  if ((m = t.match(/^(\d+)\s?×\s?(.+)$/)) && (b = trAr(m[2]))) return m[1] + ' × ' + b;
  if (t.includes(', ')) { const ps = t.split(', ').map((p) => trAr(p)); if (ps.every(Boolean)) return ps.join('، '); }
  if (t.includes(' + ')) { const ps = t.split(' + ').map((p) => trAr(p)); if (ps.every(Boolean)) return ps.join(' + '); }
  if ((m = t.match(/^\+\s*(.+)$/)) && (b = trAr(m[1]))) return '+ ' + b;
  if ((m = t.match(/^Note: (.+)$/)) && (b = trAr(m[1]))) return 'ملاحظة: ' + b;
  if ((m = t.match(/^(\d+) items?$/))) return m[1] === '1' ? 'صنف واحد' : m[1] + ' أصناف';
  if ((m = t.match(/^Delivery to (.+)$/)) && (b = trAr(m[1]))) return 'توصيل إلى ' + b;
  if ((m = t.match(/^(Ready|Arrives) at (\d+:\d+)$/))) return (m[1] === 'Ready' ? 'جاهز الساعة ' : 'يصل الساعة ') + m[2];
  if ((m = t.match(/^Pay (\$[\d.,]+)$/))) return 'ادفع ' + m[1];
  if ((m = t.match(/^(\d+) more for a free (.+)$/)) && (b = trAr(m[2]))) return 'باقي ' + m[1] + ' وتحصل على ' + b + ' مجانًا';
  if ((m = t.match(/^Your next (.+) is free$/)) && (b = trAr(m[1]))) return 'طلبك القادم من ' + b + ' مجاني';
  if ((m = t.match(/^(.+) is preparing your order\.$/))) return m[1] + ' يحضّر طلبك الآن.';
  if ((m = t.match(/^(.+) will have it ready at the counter\.$/))) return m[1] + ' سيجهّز طلبك عند الكاشير.';
  if ((m = t.match(/^Table (\d+)$/))) return 'طاولة ' + m[1];
  if ((m = t.match(/^Pickup (\d+:\d+)$/))) return 'استلام ' + m[1];
  return null;
}

const cache = new Map();
/** Translate a piece of text when `on` (Arabic page, not inside an English-only block). Keeps surrounding spaces. */
export function tr(text, on, override) {
  if (!on || text == null) return text;
  const s = String(text);
  let a = override != null ? override : cache.get(s);
  if (a === undefined) { a = trAr(s); cache.set(s, a); }
  if (a == null) return s;
  return s.match(/^\s*/)[0] + a + s.match(/\s*$/)[0];
}

/** Render a bound value the way the template did: elements pass through, null/booleans render nothing. */
export function val(x, on) {
  if (x === undefined || x === null || typeof x === 'boolean') return null;
  if (React.isValidElement(x) || Array.isArray(x)) return x;
  return tr(String(x), on);
}
export const S = (x) => (x == null ? '' : x);
export const arr = (x) => (Array.isArray(x) ? x : []);
export const dflt = (x, d) => (x === undefined ? d : x);

const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
/** "color:red; font-size:12px" -> { color: 'red', fontSize: '12px' } */
export function css(str) {
  if (str && typeof str === 'object') return str;
  const o = {};
  for (const decl of String(str || '').split(';')) { const i = decl.indexOf(':'); if (i < 0) continue; const p = decl.slice(0, i).trim(); o[p.startsWith('--') ? p : kebabToCamel(p)] = decl.slice(i + 1).trim(); }
  return o;
}

/**
 * A button or link from the design. If its click handler carries an `href` (site navigation),
 * it renders as a real <a href> so search engines can follow it, and still navigates instantly on click.
 */
export function Btn({ as: Tag = 'button', onClick, className, href, ...rest }) {
  const to = onClick && onClick.href;
  if (to) {
    const go = (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return; // let the browser open a new tab
      e.preventDefault();
      onClick(e);
    };
    const cls = [Tag === 'button' ? 'dl-btn' : null, className].filter(Boolean).join(' ') || undefined;
    return React.createElement('a', { ...rest, href: to, className: cls, onClick: go });
  }
  return React.createElement(Tag, { ...rest, href, className, onClick });
}
