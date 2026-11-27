// Mock data for the Dinelabs Super prototype (16 Nov 2026).
// Plans: Free and Premium only ($37 a month or $370 a year, per branch). Block Party matches the Manager prototype.
// Fields read from Manager: types (order types switched on), hours, open (Open / Paused and until when), lang (owner's Manager language),
// storePhone (Store profile), heard (sign-up "How did you hear about us?"), country (per branch, sets currency).
(function () {
  const b = (st, due, dueNote, last, m) => ({ st, due, dueNote, last, m });
  const ALL = ['Pickup', 'Delivery', 'Dine-in'];
  const st = (id, name, brand, status, plan, health, o, g, last, area, x = {}) => ({
    id, name, brand, slug: id, status, plan, health, orders30: o, gmv30: o ? Math.round(o * (x.avg ?? 16.9)) : 0, last, area,
    products: x.products ?? (plan === 'Free' ? 38 : 96), cats: x.cats ?? 8, langs: x.langs ?? (plan === 'Free' ? 2 : 3),
    langList: x.langList ?? (plan === 'Free' ? 'English, Arabic' : 'English, Arabic, French'),
    created: x.created ?? '14 Mar 2026', ownerName: x.ownerName ?? 'Not set yet', phone: x.phone ?? '+961 3 000 000', storePhone: x.storePhone ?? x.phone ?? '+961 3 000 000',
    email: x.email ?? ('owner@' + id + '.lb'), acct: x.acct ?? 'Hasan C.', bill: x.bill || null, trialLeft: x.trialLeft, heard: x.heard ?? 'Instagram', type: x.type ?? 'Restaurant',
    country: x.country ?? 'LB', types: x.types ?? (plan === 'Free' ? ['Pickup'] : ALL), hours: x.hours ?? 'Every day · 11:00–23:00', open: x.open ?? 'Open', lang: x.lang ?? 'English', cycle: x.cycle ?? 'monthly',
    signupMenu: x.signupMenu, deleting: x.deleting
  });
  const KH = { ownerName: 'Karim Haddad', phone: '+961 71 214 870', email: 'karim@blockparty.lb', acct: 'Mariam K.', type: 'Restaurant', heard: 'Instagram', hours: 'Every day · 11:00–22:00' };
  window.SUPER_DATA = {
    stores: [
      st('blockparty', 'Block Party · Hamra', 'Block Party', 'live', 'Premium', 'good', 790, 0, '2 min ago', 'Hamra Street, Beirut', { ...KH, storePhone: '+961 1 345 678', created: '26 Jan 2026', cats: 12, bill: b('paid', '1 Dec', 'in 15 days', '1 Nov 2026', 'Cash') }),
      st('blockparty-achrafieh', 'Block Party · Achrafieh', 'Block Party', 'live', 'Premium', 'good', 720, 0, '6 min ago', 'Sassine Square, Beirut', { ...KH, storePhone: '+961 1 201 300', created: '2 Apr 2026', open: 'Paused · resumes 19:30', bill: b('paid', '4 Dec', 'in 18 days', '4 Nov 2026', 'Whish') }),
      st('blockparty-jounieh', 'Block Party · Jounieh', 'Block Party', 'live', 'Premium', 'good', 610, 0, '11 min ago', 'Old Souk, Jounieh', { ...KH, storePhone: '+961 9 640 210', created: '19 Jun 2026', hours: 'Every day · 12:00–23:00', bill: b('paid', '19 Dec', 'in 33 days', '15 Nov 2026', 'Cash') }),
      st('juniper', 'Juniper', 'Juniper', 'live', 'Premium', 'good', 3120, 6240, '1 min ago', 'Badaro, Beirut', { ownerName: 'Maya Khoury', phone: '+961 70 118 402', type: 'Coffee shop', heard: 'A friend or another restaurant', types: ['Pickup', 'Dine-in'], hours: 'Every day · 07:30–19:00', bill: b('paid', '30 Nov', 'in 14 days', '30 Oct 2026', 'Bank transfer') }),
      st('kuro', 'Kuro', 'Kuro', 'live', 'Premium trial', 'good', 1540, 5210, '3 min ago', 'Downtown, Beirut', { ownerName: 'Karim Saad', trialLeft: 3, created: '22 Oct 2026', heard: 'TikTok', hours: 'Closed Mondays · 12:00–23:30' }),
      st('cloudnine', 'Cloud Nine', 'Cloud Nine', 'live', 'Free', 'good', 783, 594, '27 min ago', 'Verdun, Beirut', { ownerName: 'Rana Itani', products: 46, type: 'Dessert shop', heard: 'Google search' }),
      st('frankies', "Frankie's", "Frankie's", 'live', 'Premium', 'at-risk', 1269, 953, '14 min ago', 'Hamra, Beirut', { ownerName: 'Fadi Mansour', heard: 'Facebook', bill: b('overdue', '11 Nov', '5 days late', '11 Oct 2026', 'Cash') }),
      st('casa', 'Casa', 'Casa', 'live', 'Premium', 'good', 2376, 7757, '5 min ago', 'Achrafieh, Beirut', { ownerName: 'Joelle Abi Nader', heard: 'The Dinelabs team contacted me', bill: b('paid', '2 Dec', 'in 16 days', '2 Nov 2026', 'Cash') }),
      st('maisoncacao', 'Maison Cacao', 'Maison Cacao', 'live', 'Premium trial', 'good', 410, 3880, '18 min ago', 'Saifi Village, Beirut', { ownerName: 'Céline Hayek', trialLeft: 6, created: '25 Oct 2026', type: 'Dessert shop', heard: 'Instagram', langList: 'French, English, Arabic' }),
      st('forno', 'Forno', 'Forno', 'live', 'Premium', 'good', 1971, 4331, '9 min ago', 'Gemmayzeh, Beirut', { ownerName: 'Elie Karam', heard: 'Instagram', types: ['Pickup', 'Delivery'], bill: b('due-soon', '17 Nov', 'due in 1 day', '17 Oct 2026', 'Cash') }),
      st('tacoloco', 'Taco Loco', 'Taco Loco', 'live', 'Free', 'good', 1107, 3266, '12 min ago', 'Mar Mikhael, Beirut', { ownerName: 'Sami Daher', products: 48, heard: 'TikTok' }),
      st('mezzecorner', 'Mezze Corner', 'Mezze Corner', 'live', 'Free', 'quiet', 0, 0, '16 days ago', 'Jounieh', { ownerName: 'Georges Rizk', heard: 'Facebook', hours: 'Not set' }),
      st('falafelhouse', 'Falafel House', 'Falafel House', 'live', 'Premium', 'at-risk', 1026, 812, '22 min ago', 'Tariq El Jdideh, Beirut', { ownerName: 'Hassan Fakhry', heard: 'Other: saw it at a friend\u2019s restaurant', open: 'Paused · resumes 19:30', lang: 'Arabic', bill: b('at-risk', '6 Nov', '10 days late', '6 Oct 2026', 'Cash') }),
      st('morningbrew', 'Morning Brew', 'Morning Brew', 'onboarding', 'Free', 'good', 0, 0, 'Never', 'Ras Beirut', { ownerName: 'Lara Saleh', products: 0, cats: 0, created: '2 Nov 2026', type: 'Coffee shop', heard: 'Instagram', types: [], hours: 'Not set', signupMenu: { link: '', files: ['menu-page-1.jpg', 'menu-page-2.jpg'], status: 'needs_help', count: 0 } }),
      st('spiceroute', 'Spice Route', 'Spice Route', 'suspended', 'Premium', 'at-risk', 210, 980, '4 days ago', 'Dbayeh', { ownerName: 'Anis Haddad', heard: 'Google search', bill: b('suspended', '1 Nov', '15 days late', '1 Oct 2026', 'Cash') }),
      st('sweettooth', 'Sweet Tooth Bakery', 'Sweet Tooth', 'live', 'Premium', 'good', 1404, 3130, '16 min ago', 'Zalka', { ownerName: 'Nadine Chahine', type: 'Bakery', cycle: 'yearly', heard: 'A friend or another restaurant', bill: b('paid', '4 Nov 2027', 'in 12 months', '4 Nov 2026', 'Bank transfer') }),
      st('dragonwok', 'Dragon Wok', 'Dragon Wok', 'live', 'Premium', 'good', 2187, 8918, '7 min ago', 'Hamra, Beirut', { ownerName: 'Tony Wehbe', heard: 'Google search', bill: b('due-soon', '19 Nov', 'due in 3 days', '19 Oct 2026', 'OMT') }),
      st('burgerpalace', 'Burger Palace', 'Burger Palace', 'live', 'Premium', 'good', 2592, 2875, '4 min ago', 'Sin El Fil', { ownerName: 'Marc Tannous', cycle: 'yearly', heard: 'Instagram', bill: b('paid', '28 Oct 2027', 'in 11 months', '28 Oct 2026', 'Cash') }),
      st('nomadkebab', 'Nomad Kebab', 'Nomad Kebab', 'live', 'Premium', 'good', 3024, 3426, '4 min ago', 'Dubai Marina', { ownerName: 'Bilal Osman', phone: '+971 50 214 7781', country: 'AE', cycle: 'yearly', heard: 'Google search', open: 'Paused · delivery, 30 min', bill: b('due-soon', '18 Nov', 'due in 2 days', '18 Nov 2025', 'Bank transfer') }),
      st('lepetitcafe', 'Le Petit Café', 'Le Petit Café', 'onboarding', 'Free', 'good', 0, 0, 'Never', 'Achrafieh, Beirut', { ownerName: 'Yara Fares', products: 12, cats: 2, created: '11 Nov 2026', type: 'Coffee shop', heard: 'The Dinelabs team contacted me', lang: 'French', types: ['Pickup'], hours: 'Every day · 08:00–18:00', signupMenu: { link: 'https://lepetitcafe.lb/menu', files: [], status: 'imported', count: 12 } }),
      st('pizzademo', 'Pizza demo', 'Dinelabs demos', 'demo', 'Premium', 'good', 0, 0, 'Never', '—', { ownerName: 'Dinelabs team', acct: 'Mariam K.', heard: 'Added by the team' }),
      st('cafedemo', 'Café demo', 'Dinelabs demos', 'demo', 'Premium', 'good', 0, 0, 'Never', '—', { ownerName: 'Dinelabs team', acct: 'Mariam K.', type: 'Coffee shop', heard: 'Added by the team' }),
      st('pastafresca', 'Pasta Fresca', 'Pasta Fresca', 'archived', 'Free', 'good', 0, 0, '2 months ago', 'Batroun', { ownerName: 'Paolo Nasr', heard: 'Facebook', types: [], hours: 'Not set', deleting: '9 Dec 2026' })
    ],
    activity: [
      { day: 'Today', time: '09:14', who: 'Hasan C.', verb: 'switched on Premium for', obj: 'Casa', change: 'from Premium trial to Premium', sub: 'Paid in cash', ttype: 'Store' },
      { day: 'Today', time: '00:01', who: 'Dinelabs', verb: 'suspended', obj: 'Spice Route', change: 'from Live to Suspended', sub: 'Automatic · Premium payment 14 days late', ttype: 'Store' },
      { day: 'Yesterday', time: '18:40', who: 'Mariam Kapanadze', verb: 'invited', obj: 'Lina Aoun', change: '', sub: 'Invite sent to lina@dinelabs.co', ttype: 'Team member' },
      { day: 'Yesterday', time: '10:12', who: 'Karim Azar', verb: 'recorded a payment for', obj: 'Casa', change: '$37.00 · Cash', sub: '', ttype: 'Store' },
      { day: '11 Nov', time: '15:30', who: 'Rami Nassar', verb: 'logged in as store', obj: 'Le Petit Café', change: '', sub: 'Session lasted 8 min', ttype: 'Store' },
      { day: '11 Nov', time: '09:42', who: 'Rami Nassar', verb: 'changed the setup of', obj: 'Casa', change: 'from Dine-in off to Dine-in on', sub: 'While logged in as store', ttype: 'Store' },
      { day: '10 Nov', time: '10:03', who: 'Hasan C.', verb: 'edited plan', obj: 'Free', change: 'from Products: 40 to Products: 50', sub: '', ttype: 'Plan' },
      { day: '9 Nov', time: '14:30', who: 'Mariam Kapanadze', verb: 'deactivated', obj: 'Nour Fares', change: 'from Active to Deactivated', sub: '', ttype: 'Team member' },
      { day: '8 Nov', time: '15:22', who: 'Mariam Kapanadze', verb: 'set a new password for', obj: 'Dragon Wok', change: '', sub: 'Sent to the owner on WhatsApp', ttype: 'Store' },
      { day: '7 Nov', time: '09:10', who: 'Hasan C.', verb: 'changed a setting', obj: 'LBP rate', change: 'from 1 USD = 89,000 LBP to 1 USD = 89,500 LBP', sub: '', ttype: 'Settings' }
    ],
    members: [
      { n: 'Mariam Kapanadze', e: 'mariam@dinelabs.co', role: 'Admin', status: 'Active', last: '5 min ago', brands: 4, you: true },
      { n: 'Hasan C.', e: 'hasan@dinelabs.co', role: 'Admin', status: 'Active', last: 'Yesterday', brands: 9 },
      { n: 'Rami Nassar', e: 'rami@dinelabs.co', role: 'Admin', status: 'Active', last: '3 days ago', brands: 0 },
      { n: 'Lina Aoun', e: 'lina@dinelabs.co', role: 'Admin', status: 'Invited · expires in 1 day', last: 'Never', brands: 0 },
      { n: 'Karim Azar', e: 'karim@dinelabs.co', role: 'Admin', status: 'Active', last: '2 days ago', brands: 0 },
      { n: 'Nour Fares', e: 'nour@dinelabs.co', role: 'Admin', status: 'Deactivated', last: '14 days ago', brands: 0 }
    ],
    payments: [
      { store: 'Casa', date: '15 Nov 2026', m: 'Cash · 1 month', by: 'Karim Azar' },
      { store: 'Block Party · Achrafieh', date: '4 Nov 2026', m: 'Whish · 1 month', by: 'Karim Azar' },
      { store: 'Sweet Tooth Bakery', date: '4 Nov 2026', m: 'Bank transfer · 1 year', by: 'Karim Azar', amt: 370 },
      { store: 'Block Party · Hamra', date: '1 Nov 2026', m: 'Cash · 1 month', by: 'Mariam Kapanadze' },
      { store: 'Juniper', date: '30 Oct 2026', m: 'Bank transfer · 1 month', by: 'Hasan C.' },
      { store: 'Burger Palace', date: '28 Oct 2026', m: 'Cash · 1 year', by: 'Karim Azar', amt: 370 }
    ]
  };
})();
