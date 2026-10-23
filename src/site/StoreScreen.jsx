'use client';
// Animated phone mockup of a Dinelabs ordering page. Ported from the Claude Design component.
import React from 'react';
import StoreView from './StoreView';
import { DL_MENU, DL_HERO } from '../data/menus';

export default class StoreScreen extends React.Component {
  state = { cw: 0, ch: 0, t: 0, data: !!DL_MENU };
  rootRef = React.createRef();
  TR = {
    en: {
      dir: 'ltr',
      label: 'EN',
      flag: '🇬🇧',
      popular: 'Popular',
      search: 'Search the menu…',
      view: 'View basket',
      count: '10 items',
    },
    de: {
      dir: 'ltr',
      label: 'DE',
      flag: '🇩🇪',
      popular: 'Beliebt',
      search: 'Menü durchsuchen…',
      view: 'Warenkorb ansehen',
      count: '10 Artikel',
    },
    ar: {
      dir: 'rtl',
      label: 'AR',
      flag: '🇱🇧',
      popular: 'الأكثر طلباً',
      search: 'ابحث في القائمة…',
      view: 'عرض السلة',
      count: '١٠ أصناف',
    },
  };
  LBL = {
    en: {
      size: 'Choose your size',
      req: 'Required',
      extras: 'Make it yours',
      add: 'Add to basket',
      added: 'Added ✓',
      basket: 'Basket',
      pickup: 'Pickup',
      delivery: 'Delivery',
      sub: 'Subtotal',
      fee: 'Delivery fee',
      total: 'Total',
      checkout: 'Go to checkout',
      coTitle: 'Checkout',
      payWith: 'Pay with',
      card: 'Card',
      cash: 'Cash on delivery',
      cardPh: 'Card number',
      pay: 'Pay',
      processing: 'Processing…',
      paid: 'Paid ✓',
      coLine: '1 item · Delivery to ',
      doneTitle: 'Order confirmed',
      doneSub: '{name} is preparing your order.',
      etaLabel: 'Delivery',
      eta: 'Arrives at 13:05',
      track: 'Track order',
      order: 'Order',
    },
    de: {
      size: 'Größe wählen',
      req: 'Pflicht',
      extras: 'Extras',
      add: 'In den Warenkorb',
      added: 'Hinzugefügt ✓',
      basket: 'Warenkorb',
      pickup: 'Abholung',
      delivery: 'Lieferung',
      sub: 'Zwischensumme',
      fee: 'Liefergebühr',
      total: 'Gesamt',
      checkout: 'Zur Kasse',
      coTitle: 'Kasse',
      payWith: 'Bezahlen mit',
      card: 'Karte',
      cash: 'Barzahlung bei Lieferung',
      cardPh: 'Kartennummer',
      pay: 'Bezahlen',
      processing: 'Wird verarbeitet…',
      paid: 'Bezahlt ✓',
      coLine: '1 Artikel · Lieferung an ',
      doneTitle: 'Bestellung bestätigt',
      doneSub: '{name} bereitet deine Bestellung zu.',
      etaLabel: 'Abholung',
      eta: 'Fertig um 15:20',
      track: 'Bestellung verfolgen',
      order: 'Bestellung',
    },
  };
  componentDidMount() {
    let tries = 0;
    const attach = () => {
      const el = this.rootRef.current;
      const m = () => {
        if (el && el.clientWidth && (el.clientWidth !== this.state.cw || el.clientHeight !== this.state.ch))
          this.setState({ cw: el.clientWidth, ch: el.clientHeight });
      };
      if (el && window.ResizeObserver) {
        this.ro = new ResizeObserver(m);
        this.ro.observe(el);
        m();
      } else if (el && el.clientWidth) {
        m();
        window.addEventListener('resize', m);
      } else this.att = requestAnimationFrame(attach);
    };
    attach();
    if (window.IntersectionObserver) {
      this.io = new IntersectionObserver((es) =>
        es.forEach((e) => {
          this.vis = e.isIntersecting;
        }),
      );
      const el0 = this.rootRef.current;
      if (el0) this.io.observe(el0);
    }
    if (!DL_MENU)
      this.dw = setInterval(() => {
        if (DL_MENU) {
          clearInterval(this.dw);
          this.setState({ data: true });
          requestAnimationFrame(attach);
        }
      }, 40);
    this.setState({ t: Number(this.props.offset) || 0 });
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ((this.props.animate ?? true) && !reduce && this.props.phase == null)
      this.iv = setInterval(
        () => {
          if (this.vis !== false && !document.hidden) this.setState((s) => ({ t: s.t + 1 }));
        },
        this.props.screen === 'flow' ? 1000 : 1800,
      );
  }
  componentDidUpdate() {
    const key = this._tapKey;
    if (!key || key === this._measuredKey) return;
    const root = this.rootRef.current,
      box = root && root.firstElementChild;
    const el = box && box.querySelector('[data-tap="' + this._tapId + '"]');
    if (!el) return;
    this._measuredKey = key;
    const b = box.getBoundingClientRect(),
      r = el.getBoundingClientRect(),
      sc = b.width / box.offsetWidth || 1;
    this.setState({ tapAt: [(r.left + r.width / 2 - b.left) / sc, (r.top + r.height / 2 - b.top) / sc] });
  }
  componentWillUnmount() {
    clearInterval(this.iv);
    this.io && this.io.disconnect();
    clearInterval(this.dw);
    cancelAnimationFrame(this.att);
    this.ro && this.ro.disconnect();
  }
  mix(a, b, w) {
    const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const A = p(a),
      B = p(b);
    return 'rgb(' + A.map((v, i) => Math.round(v * (1 - w) + B[i] * w)).join(',') + ')';
  }
  render() {
    const v = { ...this.props, ...this.renderVals() };
    if (!this.state.cw) v.inAnim = 'none'; // stay hidden until measured (no full-size flash before scaling)
    return StoreView(v, this.props.lang === 'ar' && !this.props.noAr);
  }

  renderVals() {
    const M = DL_MENU;
    if (!M)
      return {
        rootRef: this.rootRef,
        rootDir: 'ltr',
        arSkip: '0',
        ready: 0,
        baseW: 360,
        baseH: 760,
        s: 1,
        st: {},
        layer: {},
        L: {},
        tr: {},
      };
    const scr = this.props.screen || 'menu';
    const AR = this.props.lang === 'ar';
    let rtl = AR;
    const t = typeof this.props.phase === 'number' ? this.props.phase : this.state.t;
    const st =
      scr === 'brand' ? M.list[Math.floor(t / 3) % M.list.length] : M.bySlug[this.props.store] || M.bySlug.forno;
    const desk = ['desktop', 'portal', 'analysis'].includes(scr);
    const baseW = desk ? 1200 : 360;
    const s = this.state.cw ? this.state.cw / baseW : 1;
    const baseH = this.state.cw ? this.state.ch / s : desk ? 750 : 760;
    const accent = st.accent;
    const accentTint = this.mix(accent, '#ffffff', 0.88);
    const f = (n) => '$' + n.toFixed(2);
    const I = st.items;
    const used = [...st.pop, ...st.list];
    const rest = I.map((_, i) => i).filter((i) => !used.includes(i));
    const uniq = [...new Set([st.opt, ...st.pop, ...st.list, ...rest])];
    const plus = (on) => ({
      plusBg: on ? accent : '#fff',
      plusColor: on ? '#fff' : '#0c0a09',
      plusScale: on ? 'scale(1.18)' : 'scale(1)',
    });
    const Lfor = (k) => ({ ...this.LBL[k], doneSub: this.LBL[k].doneSub.replace('{name}', st.name) });
    const v = {
      rootRef: this.rootRef,
      ready: this.state.cw ? 1 : 0,
      baseW,
      baseH,
      s,
      st,
      accent,
      accentTint,
      isMenu: ['menu', 'table', 'translate', 'brand'].includes(scr),
      isItem: scr === 'item',
      isBasket: ['basket', 'pickup', 'delivery', 'margin'].includes(scr),
      layer: { menu: 'none', item: 'none', basket: 'none', checkout: 'none' },
      L: Lfor('en'),
      coLine: '3 items · Delivery to ' + st.address,
      isDone: false,
      ddO: 0,
      ddY: '-6px',
      langOpts: [],
      langPillBg: '#f3f4f6',
      tapX: 0,
      tapY: 0,
      tapO: 0,
      tapS: 'scale(1.6)',
      isCheckout: scr === 'checkout',
      isLoyalty: scr === 'loyalty',
      isApp: scr === 'app',
      isDesktop: scr === 'desktop',
      isPortal: scr === 'portal',
      isAnalysis: scr === 'analysis',
    };
    const chipsFor = (cats) =>
      cats.map((c, i) => ({ label: c, bg: i === 0 ? accent : '#f3f4f6', color: i === 0 ? '#fff' : '#0c0a09' }));
    const langOf = (lang) => {
      const X = (st.tr && st.tr[lang]) || null;
      return {
        T: this.TR[lang],
        X,
        nm: (i) => (X && X.items && X.items[i] ? X.items[i][0] : I[i].n),
        ds: (i) => (X && X.items && X.items[i] ? X.items[i][1] : I[i].d),
        cats: X && X.cats ? X.cats : st.cats,
      };
    };
    const flyEl = (img, x0, y0, x1, y1, key) => {
      if (rtl) {
        x0 = baseW - x0;
        x1 = baseW - x1;
      }
      return React.createElement('img', {
        key,
        src: img,
        alt: '',
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: 64,
          height: 64,
          marginLeft: -32,
          marginTop: -32,
          borderRadius: 16,
          objectFit: 'cover',
          zIndex: 15,
          pointerEvents: 'none',
          boxShadow: '0 12px 24px -8px rgba(0,0,0,.45)',
          '--x0': x0 + 'px',
          '--y0': y0 + 'px',
          '--x1': x1 + 'px',
          '--y1': y1 + 'px',
          animation: 'dlFly .85s cubic-bezier(.5,0,.75,.4) forwards',
        },
      });
    };
    v.fly = null;
    v.showToggle = true;
    v.isTableB = false;
    v.layerTr = 'transform .55s cubic-bezier(.3,.7,.2,1)';
    v.doneTr = 'opacity .45s ease';
    v.inAnim = 'none';
    const card = (i, nm, ds, on) => ({ name: nm(i), desc: ds(i), price: f(I[i].p), img: I[i].img, ...plus(on) });

    if (v.isMenu) {
      const lang =
        scr === 'translate' ? (AR ? ['ar', 'de', 'en'] : ['en', 'de', 'ar'])[Math.floor(t / 3) % 3] : AR ? 'ar' : 'en';
      if (AR) rtl = lang === 'ar';
      const { T, nm, ds, cats } = langOf(lang);
      const p = t % 8;
      const count = [0, 1, 1, 2, 3, 3, 3, 0][p];
      const adds = [st.pop[0], st.list[1], st.list[2]];
      const total = adds.slice(0, count).reduce((a, i) => a + I[i].p, 0);
      Object.assign(v, {
        isTable: scr === 'table',
        dir: T.dir,
        font: lang === 'ar' ? "'IBM Plex Sans Arabic','Geist',sans-serif" : "'Geist',sans-serif",
        langLabel: T.label,
        langFlag: T.flag,
        tr: {
          popular: T.popular,
          search: T.search,
          view: scr === 'table' ? 'Send order · Table 7' : T.view,
          count: T.count,
          section: cats[0],
        },
        scroll: [0, 0, -190, -190, -190, -190, 0, 0][p],
        fly: (() => {
          const dy = scr === 'table' ? 72 : 0;
          const src =
            p === 1 ? [st.pop[0], 102, 227] : p === 3 ? [st.list[1], 60, 486] : p === 4 ? [st.list[2], 60, 594] : null;
          return src ? flyEl(I[src[0]].img, src[1], src[2] + dy, 56, baseH - 46, 'f' + t) : null;
        })(),
        popCards: [...st.pop, rest[0]].map((i, k) => card(i, nm, ds, k === 0 && p === 1)),
        listRows: st.list.map((i, k) => card(i, nm, ds, (k === 1 && p === 3) || (k === 2 && p === 4))),
        chips: chipsFor(cats),
        count,
        total: f(total),
        barY: count ? '0px' : '110px',
        barBg: accent,
        badgeBg: '#fff',
        badgeColor: accent,
        badgeScale: [1, 3, 4].includes(p) ? 'scale(1.35)' : 'scale(1)',
      });
    }
    if (v.isItem) {
      const it = I[st.opt],
        p = t % 7;
      const sizeSel = p >= 1 && p < 6 ? 1 : 0;
      const on = (i) => p < 6 && ((i === 0 && p >= 2) || (i === 1 && p >= 3) || (i === 3 && p >= 4));
      const price = it.p + st.size[sizeSel][1] + st.extras.reduce((a, e, i) => a + (on(i) ? e[1] : 0), 0);
      Object.assign(v, {
        it: { name: it.n, desc: it.d, img: it.img },
        sizes: st.size.map((z, i) => ({
          label: z[0],
          price: z[1] ? '+' + f(z[1]) : '',
          ring: i === sizeSel ? accent : '#d1d5db',
          dot: i === sizeSel ? 'scale(1)' : 'scale(0)',
        })),
        extras: st.extras.map((e, i) => ({
          label: e[0],
          price: '+' + f(e[1]),
          bg: on(i) ? accent : '#fff',
          border: on(i) ? accent : '#d1d5db',
          check: on(i) ? 1 : 0,
        })),
        itemTotal: f(price),
        addBg: p === 5 ? '#15803d' : accent,
        addScale: p === 5 ? 'scale(0.97)' : 'scale(1)',
        addLabel: p === 5 ? 'Added ✓' : 'Add to basket',
      });
    }
    const rows = [
      [uniq[0], 1, st.extras[0][0] + ', ' + st.extras[1][0]],
      [uniq[1], 1, st.note],
      [uniq[2], 2, st.size[1][0]],
    ];
    const sub = rows.reduce((a, [i, q]) => a + I[i].p * q, 0);
    if (v.isBasket || v.isCheckout) {
      const mode =
        scr === 'pickup'
          ? 'pickup'
          : scr === 'delivery' || scr === 'checkout'
            ? 'delivery'
            : Math.floor(t / 3) % 2
              ? 'delivery'
              : 'pickup';
      const fee = mode === 'delivery' ? st.fee : 0;
      const stage = t % 4;
      const labels = scr === 'pickup' ? ['Received', 'Preparing', 'Ready'] : ['Confirmed', 'Preparing', 'On the way'];
      Object.assign(v, {
        thumbLeft: mode === 'delivery' ? '50%' : '4px',
        isDelivery: mode === 'delivery',
        isPickup: scr === 'pickup',
        isMargin: scr === 'margin',
        showStatus: scr === 'pickup' || scr === 'delivery',
        statusHead: scr === 'pickup' ? 'Ready at 12:40' : 'Arrives at 13:05',
        statusNow: labels[Math.min(stage, 2)],
        progress: ['14%', '50%', '86%', '100%'][stage],
        steps: labels.map((l, i) => ({ label: l, color: i <= Math.min(stage, 2) ? '#0c0a09' : '#9ca3af' })),
        bRows: rows.map(([i, q, note]) => ({ name: I[i].n, note, q, img: I[i].img, price: f(I[i].p * q) })),
        subtotal: f(sub),
        fee: f(st.fee),
        zero: f(0),
        bTotal: f(sub + (scr === 'checkout' ? st.fee : fee)),
      });
    }
    if (v.isCheckout) {
      const p = t % 7,
        num = '4242 4242 4242 4242';
      const len = [0, 5, 10, 19, 19, 19, 19][p];
      Object.assign(v, {
        cardText: len ? num.slice(0, len) : 'Card number',
        cardColor: len ? '#0c0a09' : '#9ca3af',
        caret: p < 3 ? 1 : 0,
        expText: p >= 3 ? '08 / 28' : 'MM / YY',
        cvcText: p >= 3 ? '•••' : 'CVC',
        payBg: p === 6 ? '#15803d' : accent,
        payLabel: p === 5 ? 'Processing…' : p === 6 ? 'Paid ✓' : 'Pay ' + v.bTotal,
      });
    }
    if (v.isLoyalty) {
      const n = Math.min(t % 12, 9),
        drink = I[st.list[0]].n;
      Object.assign(v, {
        stampCount: n,
        rewardText: n < 9 ? 9 - n + ' more for a free ' + drink : 'Your next ' + drink + ' is free',
        stamps: Array.from({ length: 10 }, (_, i) =>
          i < 9
            ? {
                bg: i < n ? '#fff' : 'transparent',
                label: i < n ? '✓' : '',
                fs: '15px',
                scale: i === n - 1 ? 'scale(1.12)' : 'scale(1)',
              }
            : {
                bg: n === 9 ? '#fff' : 'rgba(255,255,255,.18)',
                label: 'Free',
                fs: '10px',
                scale: n === 9 ? 'scale(1.15)' : 'scale(1)',
              },
        ),
        recent: [
          [uniq[0], 'Today, 8:42'],
          [uniq[1], 'Yesterday'],
          [uniq[2], 'Monday'],
        ].map(([i, when]) => ({ name: I[i].n, when, img: I[i].img })),
      });
    }
    if (v.isApp) {
      const p = t % 5,
        k = Math.floor(t / 5) % 3,
        U = (i) => I[uniq[i]];
      const O = [
        {
          no: 1043 + k * 3,
          where: 'Table 4',
          items: '2× ' + U(0).n + ' · 1× ' + U(1).n,
          note: 'Note: ' + st.note,
          total: f(U(0).p * 2 + U(1).p),
        },
        {
          no: 1044 + k * 3,
          where: 'Pickup 12:40',
          items: '1× ' + U(2).n + ' · 1× ' + U(3).n,
          note: 'Paid online',
          total: f(U(2).p + U(3).p),
        },
        {
          no: 1045 + k * 3,
          where: 'Delivery',
          items: '2× ' + U(4).n + ' · 1× ' + U(0).n,
          note: st.address,
          total: f(U(4).p * 2 + U(0).p),
        },
      ][k];
      const sec = 252 + Math.round(t * 1.4);
      const mm = (x) => Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0');
      Object.assign(v, {
        ord: O,
        newCount: p >= 1 && p <= 3 ? 1 : 0,
        newOp: p >= 1 && p <= 3 ? 1 : 0,
        newY: p >= 1 && p <= 3 ? '0px' : '-24px',
        newBorder: p === 3 ? '#16a34a' : accent,
        newTag: p === 3 ? 'Accepted' : 'New',
        newTagBg: p === 3 ? '#dcfce7' : accentTint,
        newTagColor: p === 3 ? '#166534' : accent,
        acceptBg: p === 3 ? '#16a34a' : '#0c0a09',
        acceptScale: p === 2 ? 'scale(0.95)' : 'scale(1)',
        acceptLabel: p === 3 ? 'Accepted' : 'Accept',
        prep: [
          { no: 1041, where: 'Table 2', items: '1× ' + U(5).n + ' · 2× ' + U(1).n, timer: mm(sec) },
          { no: 1042, where: 'Delivery', items: '3× ' + U(3).n, timer: mm(sec - 97) },
        ],
      });
    }
    if (v.isDesktop) {
      const n = t % 6,
        shown = Math.min(n, 4),
        order = [st.pop[0], st.pop[1], rest[0], rest[1]];
      const id = (i) => i;
      Object.assign(v, {
        thumbLeft: Math.floor(t / 6) % 2 ? '50%' : '4px',
        chips: chipsFor(st.cats),
        dPop: order.map((i, k) => ({ name: I[i].n, price: f(I[i].p), img: I[i].img, ...plus(k === n - 1) })),
        dList: st.list.map((i) => ({ name: I[i].n, desc: I[i].d, price: f(I[i].p), img: I[i].img })),
        dBasket: order.map((i, k) => ({
          name: I[i].n,
          price: f(I[i].p),
          op: k < shown ? 1 : 0,
          x: k < shown ? '0px' : '30px',
        })),
        emptyOp: shown ? 0 : 1,
        dSub: f(order.slice(0, shown).reduce((a, i) => a + I[i].p, 0)),
      });
    }
    if (v.isPortal) {
      const b = Math.floor((t + 1) / 2) % 3,
        open = t % 2 === 0,
        hover = open ? (b + 1) % 3 : b;
      const ords = [48, 31, 22],
        rev = [612, 405, 288];
      const statuses = [
        ['New', accentTint],
        ['Preparing', '#fef3c7'],
        ['Ready', '#dcfce7'],
        ['Preparing', '#fef3c7'],
        ['Done', '#f3f4f6'],
      ];
      const wh = ['Table 3', 'Pickup', 'Delivery', 'Table 7', 'Pickup'];
      Object.assign(v, {
        nav: ['Orders', 'Menu', 'Branches', 'QR codes', 'Settings'].map((l, i) => ({
          label: l,
          bg: i === 2 ? '#f3f4f6' : 'transparent',
          color: i === 2 ? '#0c0a09' : '#6b7280',
        })),
        branchName: st.branches[b],
        ddOp: open ? 1 : 0,
        ddY: open ? '0px' : '-8px',
        branchList: st.branches.map((n, i) => ({
          name: n,
          orders: ords[i],
          bg: i === hover ? '#f3f4f6' : 'transparent',
        })),
        stats: [
          ['Orders today', String(ords[b])],
          ['Revenue', f(rev[b])],
          ['Average order', f(rev[b] / ords[b])],
        ].map(([label, value]) => ({ label, value })),
        pRows: statuses.map(([status, bg], k) => {
          const a = I[uniq[(k + b) % 7]],
            c = I[uniq[(k + b + 3) % 7]];
          return {
            no: 1080 - k * 3 - b * 17,
            where: wh[(k + b) % 5],
            items: '1× ' + a.n + ', 1× ' + c.n,
            total: f(a.p + c.p),
            status,
            bg,
          };
        }),
      });
    }
    if (v.isAnalysis) {
      const hl = t % 5;
      const R = [
        [0.95, 0.8, 1.3, 'Fair'],
        [1.0, 0.85, 1.25, 'Fair'],
        [0.7, 0.9, 1.4, 'Too low'],
        [1.35, 0.8, 1.15, 'Too high'],
        [0.85, 0.95, 1.35, 'Too low'],
      ];
      const pos = (x) => (((x - 0.6) / 0.9) * 100).toFixed(1) + '%';
      const vc = {
        Fair: ['#f3f4f6', '#374151'],
        'Too low': ['#dbeafe', '#1e40af'],
        'Too high': ['#fee2e2', '#991b1b'],
      };
      Object.assign(v, {
        aRows: R.map(([me, lo, hi, verdict], i) => {
          const it = I[uniq[i]];
          return {
            name: it.n,
            img: it.img,
            price: f(it.p),
            l: pos(lo),
            w: (((hi - lo) / 0.9) * 100).toFixed(1) + '%',
            dot: pos(i === hl ? me : (lo + hi) / 2),
            verdict,
            vBg: vc[verdict][0],
            vColor: vc[verdict][1],
            bg: i === hl ? accentTint : 'transparent',
          };
        }),
      });
    }
    if (scr === 'flow') {
      const H = DL_HERO || [];
      const sty = H[(Number(this.props.story) || 0) % (H.length || 1)];
      if (sty) {
        const fst = M.bySlug[sty.store],
          ph = Math.min(t, sty.steps.length - 1);
        let S = { s: 'menu', lang: 'en', dd: false, size: 0, ex: [], added: false, count: 0, mode: 'delivery' };
        sty.steps.slice(0, ph + 1).forEach((x) => {
          S = { ...S, ...x };
        });
        const cur = sty.steps[ph];
        const cut = ph === 0;
        v.inAnim = ['dlInA', 'dlInB', 'dlInC'][(Number(this.props.story) || 0) % 3] + ' .35s ease-out both';
        if (cut) {
          v.layerTr = 'none';
          v.doneTr = 'none';
        }
        const ac = fst.accent,
          acT = this.mix(ac, '#ffffff', 0.88),
          I2 = fst.items;
        const used2 = [...fst.pop, ...fst.list],
          rest2 = I2.map((_, i) => i).filter((i) => !used2.includes(i));
        const LG = AR && S.lang === 'en' ? 'ar' : S.lang;
        rtl = AR && LG === 'ar';
        const X = (fst.tr && fst.tr[LG]) || null,
          T = this.TR[LG];
        const nm = (i) => (X && X.items && X.items[i] ? X.items[i][0] : I2[i].n),
          ds = (i) => (X && X.items && X.items[i] ? X.items[i][1] : I2[i].d);
        const cats = X && X.cats ? X.cats : fst.cats;
        const sizeN = X && X.size ? X.size : fst.size.map((z) => z[0]),
          exN = X && X.extras ? X.extras : fst.extras.map((e) => e[0]);
        const L0 = this.LBL[S.lang === 'de' ? 'de' : 'en'];
        const de = S.lang === 'de',
          tbl = S.mode === 'table',
          pk = S.mode === 'pickup';
        const Lx = {
          ...L0,
          doneSub: L0.doneSub.replace('{name}', fst.name),
          checkout: tbl ? 'Send to kitchen' : de ? 'Bestellen' : 'Place order',
        };
        if (tbl)
          Object.assign(Lx, {
            doneTitle: 'Sent to the kitchen',
            doneSub: 'Your order is on its way to the chefs.',
            etaLabel: 'Table 7',
            eta: 'Served in about 10 min',
          });
        else if (pk && !de)
          Object.assign(Lx, {
            doneSub: fst.name + ' will have it ready at the counter.',
            etaLabel: 'Pickup',
            eta: 'Ready at 8:40',
          });
        const oi = fst.pop[0],
          it = I2[oi];
        const price = it.p + fst.size[S.size][1] + S.ex.reduce((a2, i) => a2 + fst.extras[i][1], 0);
        const del = S.mode === 'delivery',
          fee = del ? fst.fee : 0;
        const plus2 = (on) => ({
          plusBg: on ? ac : '#fff',
          plusColor: on ? '#fff' : '#0c0a09',
          plusScale: on ? 'scale(1.18)' : 'scale(1)',
        });
        const crd = (i, on) => ({ name: nm(i), desc: ds(i), price: f(I2[i].p), img: I2[i].img, ...plus2(on) });
        this._tapId = cur.tap || null;
        this._tapKey = cur.tap ? sty.id + ':' + t + ':' + cur.tap : null;
        const fresh = cur.tap && this._measuredKey === this._tapKey;
        const lt = this.state.tapAt || [180, 300];
        const tapPop = cur.tap === 'pop0';
        Object.assign(v, {
          st: fst,
          accent: ac,
          accentTint: acT,
          isMenu: true,
          isItem: true,
          isBasket: true,
          isCheckout: false,
          isDone: true,
          layer: {
            menu: 'none',
            item: S.s === 'item' ? 'translateY(0)' : 'translateY(100%)',
            basket: S.s === 'basket' || S.s === 'done' ? 'translateX(0)' : 'translateX(100%)',
            checkout: 'none',
          },
          L: Lx,
          isTable: tbl,
          dir: rtl ? 'rtl' : 'ltr',
          font: "'Geist',sans-serif",
          langLabel: T.label,
          langFlag: T.flag,
          langPillBg: S.dd ? '#e5e7eb' : '#f3f4f6',
          ddO: S.dd ? 1 : 0,
          ddY: S.dd ? '0px' : '-6px',
          langOpts: [
            ['en', 'English'],
            ['de', 'Deutsch'],
            ['ar', 'العربية'],
          ].map(([k, l]) => ({ label: l, flag: this.TR[k].flag, bg: k === 'de' ? '#f3f4f6' : 'transparent' })),
          tr: { popular: T.popular, search: T.search, view: T.view, count: T.count, section: cats[0] },
          scroll: 0,
          popCards: [...fst.pop, rest2[0]].map((i, k) => crd(i, k === 0 && tapPop)),
          listRows: fst.list.map((i) => crd(i, false)),
          chips: cats.map((c, i) => ({ label: c, bg: i === 0 ? ac : '#f3f4f6', color: i === 0 ? '#fff' : '#0c0a09' })),
          count: S.count,
          total: f(price),
          barY: S.count ? '0px' : '110px',
          barBg: ac,
          badgeBg: '#fff',
          badgeColor: ac,
          badgeScale: cur.count ? 'scale(1.35)' : 'scale(1)',
          it: { name: nm(oi), desc: ds(oi), img: it.img },
          sizes: fst.size.map((z, i) => ({
            label: sizeN[i],
            price: z[1] ? '+' + f(z[1]) : '',
            ring: i === S.size ? ac : '#d1d5db',
            dot: i === S.size ? 'scale(1)' : 'scale(0)',
          })),
          extras: fst.extras.map((e, i) => {
            const on = S.ex.includes(i);
            return {
              label: exN[i],
              price: '+' + f(e[1]),
              bg: on ? ac : '#fff',
              border: on ? ac : '#d1d5db',
              check: on ? 1 : 0,
            };
          }),
          itemTotal: f(price),
          addBg: S.added ? '#15803d' : ac,
          addScale: cur.added ? 'scale(0.97)' : 'scale(1)',
          addLabel: S.added ? Lx.added : Lx.add,
          showToggle: !tbl,
          isTableB: tbl,
          thumbLeft: del ? '50%' : '4px',
          isDelivery: del,
          isPickup: false,
          isMargin: false,
          showStatus: false,
          bRows: [
            {
              name: nm(oi),
              note:
                [S.size ? sizeN[S.size] : '', ...S.ex.map((i) => exN[i])].filter(Boolean).join(', ') ||
                (de ? 'Ohne Extras' : 'No extras'),
              q: 1,
              img: it.img,
              price: f(price),
            },
          ],
          subtotal: f(price),
          fee: f(fst.fee),
          zero: f(0),
          bTotal: f(price + fee),
          doneO: S.s === 'done' ? 1 : 0,
          doneS: S.s === 'done' ? 'scale(1)' : 'scale(0.5)',
          doneBar: S.s === 'done' ? '55%' : '12%',
          doneItem: '1× ' + nm(oi),
          fly: cur.fly ? flyEl(it.img, 180, 125, 56, baseH - 46, 'hf' + sty.id + t) : null,
          tapX: lt[0],
          tapY: lt[1],
          tapO: fresh ? 1 : 0,
          tapS: fresh ? 'scale(1)' : 'scale(1.6)',
        });
      }
    }
    v.rootDir = rtl ? 'rtl' : 'ltr';
    v.arSkip = AR && !rtl ? '1' : '0';
    return v;
  }
}
