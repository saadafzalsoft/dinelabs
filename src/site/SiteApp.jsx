// The site's state, animations and content. Ported from the Claude Design logic class.
// Rendered in the browser through SiteRoute; also read on the server for SEO data (FAQ).
import React from 'react';
import SiteView from './SiteView';
import { urlFor } from '../lib/routes';
import * as CONTENT from '../data/content';
import { DL_AR } from '../i18n/ar-dictionary';
import { DL_HERO } from '../data/menus';

export default class SiteApp extends React.Component {
  POOL = [
    {
      type: 'Table',
      where: 'Table 4',
      items: '2 × Chili Cheese Dog, Side of fries',
      img: '/assets/menu/frankies/03.jpg',
    },
    {
      type: 'Pickup',
      where: 'Rana · in 10 min',
      items: 'Loaded Street Dog, New York Dog',
      img: '/assets/menu/frankies/10.jpg',
    },
    { type: 'Delivery', where: 'Hamra', items: 'Smoky BBQ Dog, Chicago Crunch', img: '/assets/menu/frankies/05.jpg' },
    {
      type: 'Table',
      where: 'Table 9',
      items: 'The Classic Frank + Extra cheddar',
      img: '/assets/menu/frankies/01.jpg',
    },
    { type: 'Pickup', where: 'Karim · in 5 min', items: '2 × Turkey Bacon Dog', img: '/assets/menu/frankies/09.jpg' },
    {
      type: 'Delivery',
      where: 'Achrafieh',
      items: '3 × Slaw & Mustard Dog, The Classic Frank',
      img: '/assets/menu/frankies/08.jpg',
    },
    {
      type: 'Table',
      where: 'Table 2',
      items: 'Jalapeño Cheddar Dog, Mushroom Swiss Dog',
      img: '/assets/menu/frankies/06.jpg',
    },
  ];
  SLUGS = [
    ['block-party', 'block-party'],
    ['forno-di-napoli', 'forno'],
    ['kuro-sushi', 'kuro'],
    ['juniper-coffee', 'juniper'],
    ['cloud-nine', 'cloud-nine'],
    ['maison-cacao', 'maison-cacao'],
    ['casa-della-pasta', 'casa-pasta'],
    ['frankies', 'frankies'],
  ];
  // TODO before launch: fill in from the "Inputs" table. Empty values link to #todo-<key>.
  CFG = {
    signup: '/manager/signup',
    login: '/manager',
    store: 'javascript:void(0)',
    privacy: '/privacy',
    terms: '/terms',
    instagram: 'https://www.instagram.com/dinelabs.co/',
    linkedin: 'https://www.linkedin.com/company/dinelabs/',
    waitlist: 'https://formsubmit.co/ajax/team@dinelabs.co',
    wa: '96171407202',
  };
  url(k) {
    return this.CFG[k] || '#todo-' + k;
  }
  rm = false;
  FONTS = { 'STK Bureau Sans': "'STK Bureau Sans', 'Instrument Sans', sans-serif" };
  TAG = { Table: '#d9f0e8', Pickup: '#fbe4d6', Delivery: '#dce8f5' };
  TK = [
    {
      no: 1043,
      title: 'Delivery · Mar Mikhael',
      items: [
        { n: '1 × Pepperoni Party · 16"', p: '$15.00', c: '#292524' },
        { n: '  + Extra mozzarella', p: '$1.50', c: '#777169' },
        { n: '  + Jalapeños', p: '$1.00', c: '#777169' },
      ],
    },
  ];

  ICONS = {
    storefront:
      '<path d="M3 9l1.5-5h15L21 9"></path><path d="M4 9v11h16V9"></path><path d="M3 9h18"></path><path d="M9 20v-6h6v6"></path>',
    dinein:
      '<rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect><path d="M14 14h3v3h-3z"></path><path d="M17 20h4v-3"></path>',
    pickup: '<path d="M6 7h12l1 14H5L6 7z"></path><path d="M9 7a3 3 0 0 1 6 0"></path>',
    delivery:
      '<circle cx="5.5" cy="17" r="3.5"></circle><circle cx="18.5" cy="17" r="3.5"></circle><path d="M15 6h2l1.5 11"></path><path d="M5.5 17l4-7h7"></path>',
    addons: '<path d="M3 17l6-6 4 4 8-8"></path><path d="M15 7h6v6"></path>',
    translation:
      '<path d="M4 5h8"></path><path d="M8 3v2"></path><path d="M6 5c0 4 3 7 6 8"></path><path d="M11 5c-1 4-4 7-7 8"></path><path d="M13 21l4-9 4 9"></path><path d="M14.5 18h5"></path>',
    branding: '<path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z"></path>',
    branches:
      '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"></path><circle cx="12" cy="10" r="2.5"></circle>',
    analysis:
      '<path d="M4 20V11"></path><path d="M10 20V5"></path><path d="M16 20v-6"></path><path d="M2 20h20"></path>',
    app: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"></rect><path d="M11 18h2"></path>',
    loyalty: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"></path>',
    payments: '<rect x="2.5" y="5" width="19" height="14" rx="2"></rect><path d="M2.5 10h19"></path>',
  };
  PRODUCTS = CONTENT.PRODUCTS;
  DARK = {
    '#a7e5d3': 'rgba(167,229,211,0.25)',
    '#a8c8e8': 'rgba(168,200,232,0.28)',
    '#f4c5a8': 'rgba(244,197,168,0.28)',
    '#e8b8c4': 'rgba(232,184,196,0.28)',
    '#c8b8e0': 'rgba(200,184,224,0.32)',
  };
  BCOL = ['#a7e5d3', '#f4c5a8', '#c8b8e0'];
  MEGA_SELL = [
    { t: 'Branded storefront', d: 'Your menu, logo and link. No app to download.', c: '#a7e5d3' },
    { t: 'Dine-in QR ordering', d: 'A QR code on every table. Orders arrive with the table number.', c: '#a8c8e8' },
    { t: 'Pickup and delivery', d: 'Guests order ahead, or your drivers deliver.', c: '#f4c5a8' },
  ];
  MEGA_GROW = [
    { t: 'Add-ons and upsells', d: 'The right extra at the right moment.', c: '#e8b8c4' },
    { t: 'Translation', d: 'Guests order in theirs. Your kitchen reads yours.', c: '#c8b8e0' },
    { t: 'Menu analysis', d: 'Price every dish against competitors nearby.', c: '#a7e5d3', soon: true },
  ];
  LANG0 = this.props.lang === 'ar' ? 'ar' : 'en';
  state = {
    lang: this.LANG0,
    arDismissed: false,
    navLang: '',
    page: this.props.page || 'home',
    prod: this.props.prod || 'storefront',
    orders: 40,
    avg: 15,
    comm: 30,
    shown: 5363,
    heroName: '',
    joinedP: {},
    wlErr: '',
    wlBusy: false,
    tab: 'pickup',
    guest: 'fr',
    kitchen: 'ar',
    open: {},
    w: 1440,
    ticket: false,
    menu: false,
    email: '',
    mgrCh: 'all',
    xl: 0,
    xlOut: false,
    dishes: [
      ['Chocolate Hazelnut Crêpe', 5.5, '/assets/menu/cloud-nine/01.jpg', true],
      ['Pistachio Crêpe', 8, '/assets/menu/cloud-nine/04.jpg', true],
    ],
    newDish: -1,
    dishPool: 0,
    stepK: 0,
    stepFlash: false,
    slugI: 0,
    slugOut: false,
    tk: 0,
    heroT: 0,
    addT: 0,
    hi: 0,
    hp: 'in',
    mega: false,
    scrolled: false,
    hoverM: null,
    addOn: false,
    userLang: false,
    userTab: false,
    kFlash: false,
    pulse: false,
    nextId: 5,
    board: [0, 1, 1, 2, 2].map((stage, id) => ({ id, stage, fresh: false })),
  };

  T = {
    en: {
      dir: 'ltr',
      head: 'Your order',
      kHead: 'New order · Dine-in',
      table: 'Table 7',
      i1: 'Iced Spanish latte',
      i1m: 'Large · Oat milk',
      i2: "Za'atar croissant",
      i2m: 'Warmed',
      noteL: 'Note',
      note: 'Less ice please, and no sugar.',
    },
    fr: {
      dir: 'ltr',
      head: 'Votre commande',
      kHead: 'Nouvelle commande',
      table: 'Table 7',
      i1: 'Latte espagnol glacé',
      i1m: "Grand · Lait d'avoine",
      i2: 'Croissant au zaatar',
      i2m: 'Réchauffé',
      noteL: 'Note',
      note: 'Moins de glace, et sans sucre s’il vous plaît.',
    },
    ar: {
      dir: 'rtl',
      head: 'طلبك',
      kHead: 'طلب جديد · داخل المطعم',
      table: 'طاولة 7',
      i1: 'لاتيه إسباني مثلّج',
      i1m: 'كبير · حليب الشوفان',
      i2: 'كرواسون بالزعتر',
      i2m: 'مسخّن',
      noteL: 'ملاحظة',
      note: 'ثلج أقل من فضلك، وبدون سكر.',
    },
  };

  TABS = [
    {
      id: 'pickup',
      scr: 'pickup',
      store: 'juniper',
      label: 'Pickup · Free',
      h: 'No more missed calls at lunch.',
      body: "Guests order ahead from your link and collect when it's ready. No busy phone line, no orders lost in WhatsApp chats.",
      orb: '#f4c5a8',
    },
    {
      id: 'dine',
      scr: 'table',
      store: 'kuro',
      label: 'Table ordering · Premium',
      h: 'Stop running between tables.',
      body: 'A QR code on every table. Guests order and add extras on their own, so at rush hour your team makes the food instead of taking orders. Every order shows the table number.',
      orb: '#a7e5d3',
    },
    {
      id: 'delivery',
      scr: 'delivery',
      store: 'forno',
      label: 'Delivery · Premium',
      h: 'Deliver it yourself. Keep all the money.',
      body: 'Guests order from your page and your own drivers deliver. No app in the middle, no 30% cut.',
      orb: '#a8c8e8',
    },
  ];

  FAQ = CONTENT.FAQ;

  PRICE_ROWS = CONTENT.PRICE_ROWS;

  PILLARS = CONTENT.PILLARS;

  norm(s) {
    return s.replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
  }
  dict() {
    if (this._D) return this._D;
    const src = DL_AR;
    if (!src) return null;
    const D = {};
    for (const k in src) D[this.norm(k)] = src[k];
    return (this._D = D);
  }
  trAr(raw) {
    const D = this.dict();
    if (!D) return null;
    const t = this.norm(raw);
    if (!t || !/[A-Za-z]/.test(t)) return null;
    if (D[t] != null) return D[t];
    let m, b;
    if (/\s→$/.test(t) && (b = this.trAr(t.replace(/\s*→$/, '')))) return b + ' ←';
    if (t.includes(' · ')) {
      const ps = t.split(' · ').map((p) => (/[A-Za-z]/.test(p) ? this.trAr(p) : p));
      if (ps.every(Boolean)) return ps.join(' · ');
    }
    if ((m = t.match(/^(\d+)\s?×\s?(.+)$/)) && (b = this.trAr(m[2]))) return m[1] + ' × ' + b;
    if (t.includes(', ')) {
      const ps = t.split(', ').map((p) => this.trAr(p));
      if (ps.every(Boolean)) return ps.join('، ');
    }
    if (t.includes(' + ')) {
      const ps = t.split(' + ').map((p) => this.trAr(p));
      if (ps.every(Boolean)) return ps.join(' + ');
    }
    if ((m = t.match(/^\+\s*(.+)$/)) && (b = this.trAr(m[1]))) return '+ ' + b;
    if ((m = t.match(/^Note: (.+)$/)) && (b = this.trAr(m[1]))) return 'ملاحظة: ' + b;
    if ((m = t.match(/^(\d+) items?$/))) return m[1] === '1' ? 'صنف واحد' : m[1] + ' أصناف';
    if ((m = t.match(/^Delivery to (.+)$/)) && (b = this.trAr(m[1]))) return 'توصيل إلى ' + b;
    if ((m = t.match(/^(Ready|Arrives) at (\d+:\d+)$/)))
      return (m[1] === 'Ready' ? 'جاهز الساعة ' : 'يصل الساعة ') + m[2];
    if ((m = t.match(/^Pay (\$[\d.,]+)$/))) return 'ادفع ' + m[1];
    if ((m = t.match(/^(\d+) more for a free (.+)$/)) && (b = this.trAr(m[2])))
      return 'باقي ' + m[1] + ' وتحصل على ' + b + ' مجانًا';
    if ((m = t.match(/^Your next (.+) is free$/)) && (b = this.trAr(m[1]))) return 'طلبك القادم من ' + b + ' مجاني';
    if ((m = t.match(/^(.+) is preparing your order\.$/))) return m[1] + ' يحضّر طلبك الآن.';
    if ((m = t.match(/^(.+) will have it ready at the counter\.$/))) return m[1] + ' سيجهّز طلبك عند الكاشير.';
    if ((m = t.match(/^Table (\d+)$/))) return 'طاولة ' + m[1];
    if ((m = t.match(/^Pickup (\d+:\d+)$/))) return 'استلام ' + m[1];
    return null;
  }
  setLang(l) {
    if (l !== this.state.lang && this.props.navigate) this.props.navigate(this.state.page, this.state.prod, l);
  }
  componentDidMount() {
    this.rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.setState({
      w: window.innerWidth,
      vh: window.innerHeight,
      arDismissed: !!localStorage.getItem('dl_ar_prompt'),
      navLang: navigator.language || '',
    });
    this.onR = () => this.setState({ w: window.innerWidth, vh: window.innerHeight });
    this.onS = () => {
      const sc = window.scrollY > 8;
      if (sc !== this.state.scrolled) {
        this.setState({ scrolled: sc, logo: 0 });
        clearTimeout(this.tLogo);
        this.tLogo = setTimeout(() => this.setState({ logo: 1 }), 80);
      }
    };
    this.tLogo = setTimeout(() => this.setState({ logo: 1 }), 250);
    this.ivXL = this.every(() => {
      if (!this.on('xl')) return;
      this.setState({ xlOut: true });
      setTimeout(() => this.setState((s) => ({ xl: s.xl + 1, xlOut: false })), 200);
    }, 2200);
    this.ivSO = this.every(() => {
      if (!this.on('how')) return;
      this.setState((s) => ({ stepK: s.stepK + 1, stepFlash: true }));
      setTimeout(() => this.setState({ stepFlash: false }), 60);
    }, 3200);
    this.ivD = this.every(() => {
      if (this.on('how') && this._addDish) this._addDish();
    }, 3600);
    this.ivSlug = this.every(() => {
      if (!this.on('how')) return;
      this.setState({ slugOut: true });
      setTimeout(() => this.setState((s) => ({ slugI: s.slugI + 1, slugOut: false })), 260);
    }, 2400);
    window.addEventListener('resize', this.onR);
    window.addEventListener('scroll', this.onS, { passive: true });
    if (!this.rm)
      this.iv = this.every(() => {
        if (this.on('hero')) this.setState((s) => ({ heroT: s.heroT + 1 }));
      }, 900);
    this.ivA = this.every(() => {
      if (this.on('addons')) this.setState((s) => ({ addT: s.addT + 1 }));
    }, 1700);
    this.ivL = this.every(() => {
      if (this.state.userLang) return;
      const order = ['fr', 'en', 'ar'];
      this.setState((s) => ({ guest: order[(order.indexOf(s.guest) + 1) % 3], kFlash: true }));
      this.t3 = setTimeout(() => this.setState({ kFlash: false }), 800);
    }, 3200);
    if (!this.rm)
      this.ivB = this.every(() => {
        if (this.on('mgr')) this.boardTick();
      }, 2800);
    this.t4 = setTimeout(() => this.setupReveal(), 60);
  }
  componentDidUpdate() {
    const key = this.state.page + ':' + this.state.prod;
    if (this._lastPage !== key) {
      this._lastPage = key;
      clearTimeout(this.t4);
      this.t4 = setTimeout(() => this.setupReveal(), 60);
    }
  }
  componentWillUnmount() {
    clearInterval(this.ivXL);
    clearInterval(this.ivSO);
    clearInterval(this.ivSlug);
    window.removeEventListener('resize', this.onR);
    window.removeEventListener('scroll', this.onS);
    [this.t1, this.t2, this.t3, this.t4].forEach(clearTimeout);
    clearTimeout(this.tH);
    clearTimeout(this.tH2);
    clearInterval(this.ivH);
    [this.iv, this.ivA, this.ivL, this.ivT, this.ivB, this.ivD].forEach(clearInterval);
    if (this.aio) this.aio.disconnect();
    cancelAnimationFrame(this.raf);
    if (this.io) this.io.disconnect();
    if (this.mo) this.mo.disconnect();
    clearTimeout(this.tLang);
  }
  on(k) {
    return !('IntersectionObserver' in window) || !!(this.vis && this.vis[k]);
  }
  every(fn, ms) {
    return setInterval(() => {
      if (!document.hidden) fn();
    }, ms);
  }
  async join() {
    const email = this.state.email.trim(),
      product = this.state.prod;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return this.setState({ wlErr: 'Please enter a valid email address.' });
    if (this.state.wlBusy) return;
    this.setState({ wlErr: '', wlBusy: true });
    try {
      if (!this.CFG.waitlist) throw new Error('TODO: waitlist endpoint (CFG.waitlist) is not set');
      const r = await fetch(this.CFG.waitlist, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ _subject: 'Dinelabs waitlist: ' + product, email, product, lang: this.state.lang }),
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      this.setState((s) => ({ wlBusy: false, joinedP: { ...s.joinedP, [product]: true } }));
    } catch (e) {
      console.warn('[waitlist]', e.message);
      this.setState({ wlBusy: false, wlErr: "We couldn't add you right now. Please try again." });
    }
  }
  setupReveal() {
    this.vis = this.vis || {};
    if ('IntersectionObserver' in window) {
      if (this.aio) this.aio.disconnect();
      this.aio = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            this.vis[e.target.dataset.anim] = e.isIntersecting;
          }),
        { threshold: 0.12 },
      );
      document.querySelectorAll('[data-anim]').forEach((el) => this.aio.observe(el));
    }
    if (this.rm) return;
    if (this.io) this.io.disconnect();
    if (!('IntersectionObserver' in window)) return;
    this.io = new IntersectionObserver(
      (ents) =>
        ents.forEach((en) => {
          if (en.isIntersecting) {
            en.target.style.opacity = '1';
            en.target.style.transform = 'none';
            this.io.unobserve(en.target);
          }
        }),
      { threshold: 0, rootMargin: '0px 0px -40px 0px' },
    );
    const vh = window.innerHeight;
    const hide = (el, i) => {
      if (el.dataset.rv || getComputedStyle(el).position === 'absolute') return;
      if (el.getBoundingClientRect().top < vh * 0.9 || el.offsetHeight > vh) return;
      el.dataset.rv = '1';
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition =
        'opacity 0.9s cubic-bezier(.2,.8,.2,1) ' +
        i * 0.08 +
        's, transform 0.9s cubic-bezier(.2,.8,.2,1) ' +
        i * 0.08 +
        's';
      this.io.observe(el);
    };
    clearTimeout(this.rvFail);
    window.removeEventListener('scroll', this.rvScroll);
    this.rvScroll = () =>
      document.querySelectorAll('[data-rv="1"]').forEach((el) => {
        if (el.style.opacity === '0' && el.getBoundingClientRect().top < window.innerHeight) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    window.addEventListener('scroll', this.rvScroll, { passive: true });
    this.rvFail = setTimeout(this.rvScroll, 1200);
    document.querySelectorAll('main section').forEach((sec) => {
      let i = 0;
      Array.from(sec.children).forEach((el) => hide(el, i++));
      sec.querySelectorAll('div[style*="grid-template-columns"]').forEach((g) => {
        let j = 0;
        Array.from(g.children).forEach((el) => hide(el, j++));
      });
    });
  }
  boardTick() {
    this.setState((s) => {
      let b = s.board.map((o) => ({ ...o, fresh: false }));
      const oldest = (st) => b.filter((o) => o.stage === st).sort((x, y) => x.id - y.id)[0];
      if (b.filter((o) => o.stage === 2).length >= 2) {
        const r = oldest(2);
        b = b.filter((o) => o !== r);
      }
      const p = oldest(1);
      if (p) {
        p.stage = 2;
        p.fresh = true;
      }
      const n = oldest(0);
      if (n) {
        n.stage = 1;
        n.fresh = true;
      }
      b.push({ id: s.nextId, stage: 0, fresh: true });
      return { board: b, nextId: s.nextId + 1, pulse: !s.pulse };
    });
  }
  target() {
    const s = this.state;
    return Math.round(((s.orders * s.avg * s.comm) / 100) * 30 - 37);
  }
  setCalc(p) {
    this.setState(p, () => this.animate());
  }
  animate() {
    cancelAnimationFrame(this.raf);
    const from = this.state.shown,
      to = this.target(),
      t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / 450),
        e = 1 - Math.pow(1 - k, 3);
      this.setState({ shown: Math.round(from + (to - from) * e) });
      if (k < 1) this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }
  nav(p, prod) {
    const f = () => this.go(p, prod);
    f.href = urlFor(p, prod || this.state.prod, this.state.lang);
    return f;
  }
  go(p, prod) {
    this.setState({ menu: false, mega: false });
    if (this.props.navigate) this.props.navigate(p, prod || this.state.prod, this.state.lang);
  }
  toggle(k) {
    this.setState((s) => ({ open: { ...s.open, [k]: !s.open[k] } }));
  }
  faq(items, prefix) {
    return items.map((f, i) => {
      const k = prefix + i,
        o = !!this.state.open[k];
      return {
        q: f.q,
        a: f.a,
        todo: f.todo || '',
        hasTodo: !!f.todo,
        open: o,
        icon: o ? '−' : '+',
        toggle: () => this.toggle(k),
      };
    });
  }
  money(n) {
    return (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-US');
  }

  render() {
    const v = { ...this.props, ...this.renderVals() };
    // language switch buttons link to the same page in the other language
    if (v.setEn) v.setEn.href = urlFor(this.state.page, this.state.prod, 'en');
    if (v.setAr) v.setAr.href = urlFor(this.state.page, this.state.prod, 'ar');
    return (
      <div id="site">
        <div className="site-root">{SiteView(v, this.state.lang === 'ar')}</div>
      </div>
    );
  }

  renderVals() {
    const s = this.state,
      mobile = s.w < 960,
      orbMul = 0.7,
      ar = s.lang === 'ar';
    const tog = (on) => ({
      bg: on ? '#fff' : 'transparent',
      color: on ? '#0c0a09' : '#777169',
      shadow: on ? '0 1px 2px rgba(12,10,9,0.1)' : 'none',
    });
    const tEn = tog(!ar),
      tAr = tog(ar);
    const pages = [
      ['features', 'Features'],
      ['pricing', 'Pricing'],
      ['about', 'About'],
      ['faq', 'FAQ'],
    ];
    const all = [...this.FAQ.start, ...this.FAQ.orders, ...this.FAQ.pricing];
    const homeItems = all.filter((f) => f.home).sort((a, b) => a.home - b.home);
    const tab = this.TABS.find((t) => t.id === s.tab);
    const langBtn = (cur, set) => (l) => ({
      label: l[1],
      onClick: () => this.setState({ [set]: l[0], userLang: true }),
      bg: cur === l[0] ? '#fff' : 'transparent',
      color: cur === l[0] ? '#0c0a09' : '#a8a29e',
    });
    const inFrame = false,
      phoneView = !inFrame && 'desktop' === 'mobile';
    return {
      phoneView,
      siteView: !phoneView,
      phoneSrc: '',
      phoneZoom: Math.min(1, ((s.vh || 900) - 48) / 898, ((s.w || 1440) - 48) / 426),
      desktop: true,
      mobile: true,
      searchR: 'var(--dl-search-r)',
      pillR: 'var(--dl-pill-r)',
      menuOpen: s.menu,
      menuIcon: s.menu ? '✕' : '☰',
      menuLabel: s.menu ? 'Close menu' : 'Open menu',
      toggleMenu: () => this.setState({ menu: !s.menu }),
      navItems: pages
        .slice(1)
        .map(([id, label]) => ({ label, onClick: this.nav(id), bg: s.page === id ? '#f0efed' : 'transparent' })),
      mobileNav: pages.map(([id, label]) => ({ label, onClick: this.nav(id) })),
      megaO: s.mega ? 1 : 0,
      megaPE: s.mega ? 'auto' : 'none',
      megaT: s.mega ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.985)',
      displayFont: this.FONTS['STK Bureau Sans'],
      productBg: s.mega || s.page === 'features' || s.page === 'product' ? '#f0efed' : 'transparent',
      chevron: s.mega ? 'rotate(180deg)' : 'none',
      openMega: () => {
        if (!this.state.mega) this.setState({ mega: true });
      },
      closeMega: () => {
        if (this.state.mega) this.setState({ mega: false });
      },
      toggleMega: () => this.setState({ mega: !s.mega }),
      megaSell: this.MEGA_SELL.map((m) => ({ ...m, onClick: this.nav('features') })),
      megaGrow: this.MEGA_GROW.map((m) => ({ ...m, soon: !!m.soon, onClick: this.nav('features') })),
      logoClip: s.logo ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
      logoTr: s.logo ? 'clip-path 0.4s steps(8, end)' : 'none',
      addDish: (this._addDish = () => {
        const pool = [
          ['Strawberry Dream Crêpe', 7, '/assets/menu/cloud-nine/02.jpg'],
          ['Banana Crunch Crêpe', 6.5, '/assets/menu/cloud-nine/03.jpg'],
          ['Pistachio Fettuccine Crêpe', 9, '/assets/menu/cloud-nine/09.jpg'],
          ['Chocolate Fettuccine Crêpe', 8, '/assets/menu/cloud-nine/08.jpg'],
        ];
        const d = pool[s.dishPool % pool.length];
        this.setState((st) => ({
          dishes: [[d[0], d[1], d[2], true], ...st.dishes].slice(0, 3),
          dishPool: st.dishPool + 1,
          newDish: Date.now(),
        }));
        clearTimeout(this.tDish);
        this.tDish = setTimeout(() => this.setState({ newDish: -1 }), 900);
      }),
      dishRows: s.dishes.map((d, i) => ({
        n: d[0],
        p: '$' + (d[1] % 1 ? d[1].toFixed(2) : d[1]),
        c: d[2],
        tbg: d[3] ? '#0c0a09' : '#d6d3d1',
        knob: d[3] ? '15px' : '3px',
        color: d[3] ? '#0c0a09' : '#a8a29e',
        bg: i === 0 && s.newDish > 0 ? '#f0fbf6' : 'transparent',
        toggle: () =>
          this.setState((st) => ({ dishes: st.dishes.map((x, j) => (j === i ? [x[0], x[1], x[2], !x[3]] : x)) })),
      })),
      slug: this.SLUGS[s.slugI % 8][0],
      slugLogo: '/assets/menu/' + this.SLUGS[s.slugI % 8][1] + '/logo.png',
      slugO: s.slugOut ? 0 : 1,
      slugY: s.slugOut ? '-6px' : '0px',
      stepOrders: (() => {
        const P = [
          ['Table 7', '2× Pepperoni Party · 1× Garden Supreme'],
          ['Pickup 12:40', '1× BBQ Chicken · 1× Four Cheese Melt'],
          ['Delivery', '2× Philly Steak · 1× Buffalo Ranch'],
          ['Table 3', '1× Jalapeño Heat · 1× Mushroom Ranch'],
          ['Pickup 12:55', '3× Tomato & Cheese'],
          ['Table 9', '1× Double Beef · 1× Pepperoni Party'],
        ];
        const k = s.stepK;
        return [0, 1].map((j) => {
          const p = P[(k - j + P.length * 10) % P.length],
            top = j === 0;
          return {
            no: 1042 + k - j,
            where: p[0],
            items: p[1],
            tag: top ? 'New' : 'Preparing',
            tagBg: top ? '#a7e5d3' : '#f4c5a8',
            border: top ? '#0c0a09' : '#e7e5e4',
            shadow: top ? '0 10px 24px -14px rgba(12,10,9,0.45)' : 'none',
            tr: s.stepFlash
              ? 'none'
              : 'opacity 0.45s ease, transform 0.5s cubic-bezier(.34,1.3,.64,1), border-color 0.4s ease',
            op: top && s.stepFlash ? 0 : 1,
            y: top && s.stepFlash ? '-14px' : '0px',
          };
        });
      })(),
      chatPad: '0 22px 0 16px',
      chatBottom: 'clamp(16px,2.5vw,28px)',
      ...(() => {
        const X = {
          en: ['Pistachio Crêpe', 'Crêpe with pistachio cream and crushed pistachios.'],
          de: ['Pistazien-Crêpe', 'Crêpe mit Pistaziencreme und gehackten Pistazien.'],
          es: ['Crepe de pistacho', 'Crepe con crema de pistacho y pistachos triturados.'],
          ar: ['كريب الفستق', 'كريب بكريمة الفستق والفستق المجروش.'],
          zh: ['开心果可丽饼', '开心果奶油可丽饼，撒上碎开心果。'],
          fr: ['Crêpe à la pistache', 'Crêpe à la crème de pistache et pistaches concassées.'],
          hi: ['पिस्ता क्रेप', 'पिस्ता क्रीम और कुटे हुए पिस्ते के साथ क्रेप।'],
        };
        const order = ['en', 'de', 'es', 'ar', 'zh', 'fr', 'hi'],
          cur = order[s.xl % order.length];
        const P = { de: ['0%', '0px'], es: ['52%', '30px'], zh: ['0%', '384px'], ar: ['52%', '410px'] };
        const NAMES = {
          en: 'English',
          de: 'Deutsch',
          es: 'Español',
          ar: 'العربية',
          zh: '中文',
          fr: 'Français',
          hi: 'हिन्दी',
        };
        const mk = (l, extra) => ({
          lang: NAMES[l],
          n: X[l][0],
          d: X[l][1],
          dir: l === 'ar' ? 'rtl' : 'ltr',
          priceAlign: 'flex-start',
          ...extra,
        });
        return {
          xlC: mk(cur, { op: s.xlOut ? 0 : 1, border: '#e7e5e4', shadow: '0 30px 60px -28px rgba(12,10,9,0.35)' }),
          xlSats: ['de', 'es', 'zh', 'ar'].map((l, i) => {
            const on = l === cur;
            return mk(l, {
              op: 1,
              x: P[l][0],
              y: P[l][1],
              t: 'translateY(' + ((s.xl + i) % 2 ? -7 : 7) + 'px) scale(' + (on ? 1.04 : 1) + ')',
              border: on ? '#0c0a09' : '#eeeceb',
              shadow: on ? '0 20px 40px -20px rgba(12,10,9,0.4)' : '0 10px 30px -22px rgba(12,10,9,0.25)',
            });
          }),
        };
      })(),
      headerShadow: s.scrolled ? '0 10px 30px -18px rgba(12,10,9,0.22)' : 'none',
      hdr:
        s.scrolled && !s.menu
          ? {
              pad: '10px 12px 0',
              bg: 'rgba(255,255,255,0)',
              blur: 'none',
              border: 'rgba(231,229,228,0)',
              max: '1040px',
              inPad: '8px 0 20px',
              h: '58px',
              barBg: 'rgba(255,255,255,0.88)',
              barBlur: 'saturate(1.4) blur(16px)',
              barBorder: '#e7e5e4',
              radius: '999px',
              shadow: '0 16px 40px -20px rgba(12,10,9,0.3)',
            }
          : {
              pad: '0px 0px 0',
              bg: 'rgba(255,255,255,0.9)',
              blur: 'saturate(1.4) blur(16px)',
              border: '#e7e5e4',
              max: '1200px',
              inPad: 'clamp(20px,4vw,40px)',
              h: '68px',
              barBg: 'rgba(255,255,255,0)',
              barBlur: 'none',
              barBorder: 'rgba(231,229,228,0)',
              radius: '0px',
              shadow: 'none',
            },
      wideOpen: s.w >= 1180 && !s.scrolled,
      langOpen: true,
      langPad: s.scrolled ? '4px 9px' : '5px 11px',
      tk: this.TK[0],
      ...(() => {
        const ap = s.addT % 7,
          live = ap < 6,
          on = ap >= 4 && live;
        const tot =
          12 + (ap >= 1 && live ? 3 : 0) + (ap >= 2 && live ? 1 : 0) + (ap >= 3 && live ? 3.5 : 0) + (on ? 2.5 : 0);
        return {
          addPh: s.addT,
          addBg: on ? '#a7e5d3' : '#0c0a09',
          addFg: on ? '#0c0a09' : '#fff',
          addSym: on ? '✓' : '+',
          addScale: ap === 4 ? 'scale(1.18)' : 'scale(1)',
          addTotal: '$' + tot.toFixed(2),
          addNoteO: on ? 1 : 0,
        };
      })(),
      ...(() => {
        const H = DL_HERO || [
          { id: 'delivery', label: 'Delivery', store: 'block-party', tint: '#6b86ff', steps: [{}] },
        ];
        const total = H.reduce((a, x) => a + x.steps.length, 0);
        let r = s.heroT % total,
          si = 0;
        while (r >= H[si].steps.length) {
          r -= H[si].steps.length;
          si++;
        }
        const sty = H[si],
          len = sty.steps.length,
          doneAt = sty.steps.findIndex((x) => x.s === 'done');
        const rgba = (hex, a) =>
          'rgba(' + [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',') + ',' + a + ')';
        const pos = {
          position: 'absolute',
          left: '50%',
          top: 'calc(min(360px,78vw) * 1.025 - 32px)',
          width: 1200,
          height: 1200,
          marginLeft: -600,
          marginTop: -600,
          borderRadius: '50%',
        };
        const loop = Math.floor(s.heroT / total);
        return {
          heroStory: si,
          heroPh: r,
          heroStageH: 'var(--dl-hero-stage-h)',
          heroCases: H.map((x, i) => ({
            label: x.label,
            bg: i === si ? '#fff' : 'rgba(255,255,255,0.06)',
            color: i === si ? '#0c0a09' : 'rgba(255,255,255,0.72)',
            dot: i === si ? x.tint : 'rgba(255,255,255,0.3)',
            track: i === si ? '#ece9e6' : 'transparent',
            fill: i === si ? Math.round(((r + 1) / len) * 100) + '%' : '0%',
            tr: i === si && r > 0 ? 'width 0.9s linear' : 'none',
          })),
          heroCase: { label: sty.label, dot: sty.tint, pos: si + 1 + '/' + H.length },
          heroBg: React.createElement(
            'div',
            { style: { position: 'absolute', inset: 0, pointerEvents: 'none' } },
            H.map((x, i) =>
              React.createElement('span', {
                key: 'g' + i,
                style: {
                  position: 'absolute',
                  left: '50%',
                  top: 'calc(min(360px,78vw) * 1.025 - 32px)',
                  width: 1000,
                  height: 1000,
                  marginLeft: -500,
                  marginTop: -500,
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side, ' + rgba(x.tint, 0.26) + ', ' + rgba(x.tint, 0) + ')',
                  opacity: i === si ? 1 : 0,
                  transition: 'opacity 1.2s ease',
                },
              }),
            ),
            (this.rm ? [] : [0, 1, 2, 3, 4]).map((i) =>
              React.createElement('span', {
                key: 'r' + i,
                style: {
                  ...pos,
                  border: '1px solid ' + rgba(sty.tint, 0.28),
                  transition: 'border-color 1.2s ease',
                  animation: 'dlRing 12.5s linear ' + -i * 2.5 + 's infinite',
                },
              }),
            ),
            !this.rm && doneAt >= 0 && r >= doneAt
              ? React.createElement('span', {
                  key: 'w' + loop + si,
                  style: {
                    ...pos,
                    border: '2px solid ' + rgba(sty.tint, 0.95),
                    boxShadow: '0 0 60px 6px ' + rgba(sty.tint, 0.4) + ', inset 0 0 60px 6px ' + rgba(sty.tint, 0.22),
                    animation: 'dlWave 2.2s cubic-bezier(.2,.7,.2,1) forwards',
                  },
                })
              : null,
          ),
        };
      })(),
      kBorder: s.kFlash ? '#a7e5d3' : '#292524',
      pulse: s.pulse ? '6px' : '0px',
      ...(() => {
        const ch = s.mgrCh,
          map = { delivery: 'Delivery', pickup: 'Pickup', dine: 'Table' };
        const cols = [
          ['New', 0, '#dc2626'],
          ['Preparing', 1, '#0c0a09'],
          ['Ready', 2, '#16a34a'],
        ].map(([title, st, dot]) => {
          const cards = s.board
            .filter((o) => o.stage === st)
            .map((o) => ({ o, d: this.POOL[o.id % this.POOL.length] }))
            .filter((x) => ch === 'all' || x.d.type === map[ch])
            .sort((a, b) => b.o.id - a.o.id)
            .map(({ o, d }) => ({
              ...d,
              no: 1040 + o.id,
              tagBg: this.TAG[d.type],
              border: o.fresh ? '#0c0a09' : '#eceae8',
              shadow: o.fresh ? '0 10px 24px -14px rgba(12,10,9,0.35)' : 'none',
            }));
          return { title, dot, count: cards.length, cards, empty: !cards.length };
        });
        return {
          mgrSide: true,
          mgrCols: cols,
          mgr: { nNew: cols[0].count, nPrep: cols[1].count, nReady: cols[2].count, nDone: 36 + s.nextId },
          mgrChips: [
            ['all', 'All channels'],
            ['pickup', 'Pickup'],
            ['dine', 'Table'],
            ['delivery', 'Delivery'],
          ].map(([id, label]) => ({
            label,
            onClick: () => this.setState({ mgrCh: id }),
            bg: ch === id ? '#0c0a09' : '#fff',
            color: ch === id ? '#fff' : '#0c0a09',
            border: ch === id ? '#0c0a09' : '#e7e5e4',
          })),
        };
      })(),
      board: [
        ['New', 0],
        ['Preparing', 1],
        ['Ready', 2],
      ].map(([title, st]) => {
        const cards = s.board
          .filter((o) => o.stage === st)
          .sort((a, b) => b.id - a.id)
          .map((o) => {
            const d = this.POOL[o.id % this.POOL.length];
            return {
              ...d,
              no: 1040 + o.id,
              tagBg: this.TAG[d.type],
              border: o.fresh ? '#0c0a09' : '#e7e5e4',
              shadow: o.fresh ? '0 10px 24px -14px rgba(12,10,9,0.35)' : '0 1px 2px rgba(12,10,9,0.04)',
            };
          });
        return { title, count: cards.length, cards };
      }),
      bars: (() => {
        const kp = Math.max(0, this.target()),
          mx = kp * 12 || 1;
        return Array.from({ length: 12 }, (_, i) => {
          const m = i + 1,
            act = s.hoverM ? s.hoverM === m : m === 12;
          return {
            h: Math.max(4, ((kp * m) / mx) * 100) + '%',
            bg: act ? '#1F9D55' : 'rgba(31,157,85,0.22)',
            hover: () => this.setState({ hoverM: m }),
          };
        });
      })(),
      chartLabel: s.hoverM
        ? 'Month ' + s.hoverM + ': ' + this.money(Math.max(0, this.target()) * s.hoverM)
        : '12 months: ' + this.money(Math.max(0, this.target()) * 12),
      clearHover: () => this.setState({ hoverM: null }),
      goHome: this.nav('home'),
      goFeatures: this.nav('features'),
      goPricing: this.nav('pricing'),
      goAbout: this.nav('about'),
      goFaq: this.nav('faq'),
      goTerms: this.nav('terms'),
      goPrivacyLink: this.nav('privacy'),
      goPrivacy: this.nav('privacy'),
      headerCta: 'Start free',
      wide: s.w >= 1180,
      tocPos: 'var(--dl-toc-pos)',
      goBack: () => {
        if (document.referrer && history.length > 1) history.back();
        else this.go('home');
      },
      wa404: ((en, a) => 'https://wa.me/' + this.CFG.wa + '?text=' + encodeURIComponent(ar ? a : en))(
        "Hi Dinelabs, I was looking for a page on your site and couldn't find it: ",
        'مرحبًا Dinelabs، كنت أدور صفحة في موقعكم وما لقيتها: ',
      ),
      is404: false || !['home', 'features', 'pricing', 'about', 'faq', 'privacy', 'terms', 'product'].includes(s.page),
      isHome: !false && s.page === 'home',
      isFeatures: s.page === 'features',
      isPricing: s.page === 'pricing',
      isAbout: s.page === 'about',
      isFaq: s.page === 'faq',
      isPrivacy: s.page === 'privacy',
      isTerms: s.page === 'terms',
      isProduct: s.page === 'product',
      mobileProducts: this.PRODUCTS.map((p) => ({ title: p.title, onClick: this.nav('product', p.id) })),
      goP: Object.fromEntries(this.PRODUCTS.map((p) => [p.id, this.nav('product', p.id)])),
      ...(() => {
        const p = this.PRODUCTS.find((x) => x.id === s.prod) || this.PRODUCTS[0];
        const allFaq = [...this.FAQ.start, ...this.FAQ.orders, ...this.FAQ.pricing];
        const pr = {
          ...p,
          soon: !!p.soon,
          live: !p.soon,
          isFree: p.plan === 'free',
          isPremium: p.plan === 'premium',
          hasNote: !!p.note,
          phone: p.device === 'phone',
          laptop: p.device === 'laptop',
          cDark: this.DARK[p.c],
          hasSteps: !!p.steps,
          hasFaq: !!p.faq,
          benefits: p.benefits.map((b, i) => ({ t: b[0], d: b[1], c: this.BCOL[i] })),
          steps: (p.steps || []).map((st, i) => ({ n: '0' + (i + 1), t: st[0], d: st[1] })),
        };
        return {
          pr,
          prIcon: React.createElement('svg', {
            width: 20,
            height: 20,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: '#292524',
            strokeWidth: 1.6,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            dangerouslySetInnerHTML: { __html: this.ICONS[p.id] },
          }),
          prFaq: this.faq((p.faq || []).map((q) => allFaq.find((f) => f.q === q)).filter(Boolean), 'pr_' + p.id),
          prRelated: this.PRODUCTS.filter((x) => x.group === p.group && x.id !== p.id).map((x) => ({
            title: x.title,
            sub: x.sub,
            c: x.c,
            soon: !!x.soon,
            onClick: this.nav('product', x.id),
          })),
        };
      })(),
      orb: orbMul,
      orders: s.orders,
      avg: s.avg,
      setOrders: (e) => this.setCalc({ orders: +e.target.value }),
      setAvg: (e) => this.setCalc({ avg: +e.target.value }),
      commOptions: (ar ? [15, 20, 25, 30] : [25, 30, 35]).map((c) => ({
        label: c + '%',
        onClick: () => this.setCalc({ comm: c }),
        bg: s.comm === c ? '#fff' : 'transparent',
        color: s.comm === c ? '#0c0a09' : '#777169',
        shadow: s.comm === c ? '0 1px 3px rgba(12,10,9,0.12)' : 'none',
      })),
      keepShown: this.money(s.shown),
      appCut: this.money(Math.round(((s.orders * s.avg * s.comm) / 100) * 30)),
      tabs: this.TABS.map((t) => ({
        label: t.label.split(' · ')[0],
        labelM: { dine: 'Tables' }[t.id] || t.label.split(' · ')[0],
        isDine: t.id === 'dine',
        isPickup: t.id === 'pickup',
        isDelivery: t.id === 'delivery',
        onClick: () => this.setState({ tab: t.id, userTab: true }),
        bg: s.tab === t.id ? '#0c0a09' : 'transparent',
        color: s.tab === t.id ? '#fff' : '#4e4e4e',
      })),
      tab,
      guestLangs: [
        ['en', 'English'],
        ['fr', 'Français'],
        ['ar', 'العربية'],
      ].map(langBtn(s.guest, 'guest')),
      kitchenLangs: [
        ['ar', 'العربية'],
        ['en', 'English'],
      ].map(langBtn(s.kitchen, 'kitchen')),
      g: this.T[s.guest],
      k: this.T[s.kitchen],
      email: s.email,
      setEmail: (e) => this.setState({ email: e.target.value, wlErr: '' }),
      wlKey: (e) => {
        if (e.key === 'Enter') this.join();
      },
      join: () => this.join(),
      joined: !!s.joinedP[s.prod],
      notJoined: !s.joinedP[s.prod],
      wlBusy: s.wlBusy,
      wlErr: !!s.wlErr,
      wlErrMsg: s.wlErr,
      homeFaq: this.faq(homeItems, 'h'),
      pricingFaq: this.faq(this.FAQ.pricePage, 'p'),
      faqGroups: [
        ['Getting started', 'start'],
        ['Orders, delivery and payments', 'orders'],
        ['Pricing and languages', 'pricing'],
      ].map(([title, key]) => ({ title, items: this.faq(this.FAQ[key], key) })),
      priceRows: this.PRICE_ROWS,
      pillars: this.PILLARS.map((p, i) => ({
        ...p,
        phoneScr: ['margin', null, 'item', 'translate', 'brand', null][i],
        deskScr: [null, 'desktop', null, null, null, null][i],
        store: ['frankies', 'casa-pasta', 'cloud-nine', 'kuro', 'forno', 'forno'][i],
        isSoon: i === 5,
        n: String(i + 1).padStart(2, '0'),
        dir: i % 2 ? 'row-reverse' : 'row',
      })),
      stickyBar: false,
      isAr: ar,
      calcPos: this.target() >= 0,
      calcNeg: this.target() < 0,
      priceGrid: true,
      priceCards: true,
      hideImg: (e) => {
        const im = e.currentTarget;
        if (!/^data:/.test(im.src))
          im.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      },
      ...(() => {
        const su = this.url('signup'),
          q = (u, p) => u + (u.includes('?') ? '&' : '?') + p,
          nm = s.heroName.trim();
        const wa = (en, a) => 'https://wa.me/' + this.CFG.wa + '?text=' + encodeURIComponent(ar ? a : en);
        const waG = wa(
          "Hi Dinelabs, I'd like to set up online ordering for my restaurant.",
          'مرحبًا Dinelabs، أريد إنشاء صفحة طلب لمطعمي.',
        );
        const heroUrl = nm ? q(su, 'store=' + encodeURIComponent(nm)) : su;
        return {
          signupUrl: su,
          premiumUrl: q(su, 'plan=premium'),
          heroSignupUrl: heroUrl,
          goTerms: () => { window.location.href = '/terms'; },
          goPrivacy: () => { window.location.href = '/privacy'; },
          heroHoverOn: () => this.setState({ heroHov: true }),
          heroHoverOff: () => this.setState({ heroHov: false }),
          heroArrow: s.lang === 'ar' ? '←' : '→',
          heroArrowW: s.heroHov ? '20px' : '0px',
          heroArrowO: s.heroHov ? 1 : 0,
          heroArrowM: s.heroHov ? '8px' : '0px',
          loginUrl: this.url('login'),
          storeUrl: this.url('store'),
          igUrl: this.url('instagram'),
          liUrl: this.url('linkedin'),
          waGeneral: waG,
          waDemo: wa("Hi Dinelabs, I'd like to book a demo.", 'مرحبًا Dinelabs، أريد حجز عرض توضيحي.'),
          waChat:
            s.page === 'pricing'
              ? wa('Hi Dinelabs, I have a question about pricing.', 'مرحبًا Dinelabs، عندي سؤال عن الأسعار.')
              : waG,
          heroName: s.heroName,
          setHeroName: (e) => this.setState({ heroName: e.target.value }),
          heroKey: (e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              window.location.href = heroUrl;
            }
          },
        };
      })(),
      dir: ar ? 'rtl' : 'ltr',
      lang: s.lang,
      chatDisplay: 'flex',
      setEn: () => this.setLang('en'),
      setAr: () => {
        localStorage.setItem('dl_ar_prompt', '1');
        this.setState({ arDismissed: true });
        this.setLang('ar');
      },
      dismissAr: () => {
        localStorage.setItem('dl_ar_prompt', '1');
        this.setState({ arDismissed: true });
      },
      arPromptTop: !ar && !s.arDismissed && /^ar/i.test(s.navLang || ''),
      arPromptChip: !ar && !s.arDismissed && /^ar/i.test(s.navLang || ''),
      enBg: tEn.bg,
      enColor: tEn.color,
      enShadow: tEn.shadow,
      arBg: tAr.bg,
      arColor: tAr.color,
      arShadow: tAr.shadow,
    };
  }
}
