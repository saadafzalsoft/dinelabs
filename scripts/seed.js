import { MongoClient } from 'mongodb';
import { hashPassword } from '../lib/auth.js';
import { createTranslationMap } from '../lib/translate.js';
import fs from 'fs';
import path from 'path';

// Parse .env manually for standalone runner support
try {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.log("No .env file found, using defaults");
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dinelabs';

async function seed() {
  console.log('Connecting to database at:', MONGODB_URI);
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  console.log('Clearing existing data...');
  await db.collection('tenants').deleteMany({});
  await db.collection('users').deleteMany({});
  await db.collection('categories').deleteMany({});
  await db.collection('products').deleteMany({});
  await db.collection('modifierGroups').deleteMany({});
  await db.collection('orders').deleteMany({});
  await db.collection('tables').deleteMany({});

  console.log('Seeding tenants...');
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const kfcTenantId = '507f1f77bcf86cd799439011';
  const bartartineTenantId = '507f1f77bcf86cd799439012';

  const kfcTenant = {
    _id: kfcTenantId,
    slug: 'kfc',
    name: 'KFC Storefront',
    logoUrl: '/assets/logos/kfc.png',
    tier: 2,
    status: 'active',
    enabledModes: { dineIn: true, pickup: true, delivery: true },
    openingHours: daysOfWeek.map(day => ({ day, open: '10:00', close: '23:30', isOpen: true })),
    waitTimes: { delivery: 30, pickup: 15 },
    baseCurrency: 'USD',
    languages: ['en', 'ar'],
    defaultLanguage: 'en',
    createdAt: new Date(),
  };

  const bartartineTenant = {
    _id: bartartineTenantId,
    slug: 'bartartine',
    name: 'bar tartine',
    logoUrl: '/assets/logos/bartartine.png',
    tier: 3, // Tier 3 Hospitality
    status: 'active',
    enabledModes: { dineIn: true, pickup: true, delivery: true },
    openingHours: daysOfWeek.map(day => ({ day, open: '07:30', close: '23:00', isOpen: true })),
    waitTimes: { delivery: 45, pickup: 15 },
    baseCurrency: 'USD',
    languages: ['en', 'ar'],
    defaultLanguage: 'en',
    createdAt: new Date(),
  };

  await db.collection('tenants').insertMany([kfcTenant, bartartineTenant]);

  console.log('Seeding physical tables...');
  const seededTables = [
    {
      tenantId: bartartineTenantId,
      name: 'Table 1',
      chairs: 4,
      location: 'Indoor',
      x: 18,
      y: 22,
      shape: 'square',
      view: 'Window View',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 2',
      chairs: 4,
      location: 'Indoor',
      x: 38,
      y: 22,
      shape: 'square',
      view: 'Window View',
      isBooked: true, // Table 2 is occupied by default
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 3',
      chairs: 4,
      location: 'Indoor',
      x: 62,
      y: 22,
      shape: 'square',
      view: 'Window View',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 4',
      chairs: 4,
      location: 'Indoor',
      x: 82,
      y: 22,
      shape: 'square',
      view: 'Window View',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 5',
      chairs: 2,
      location: 'Terrace',
      x: 12,
      y: 44,
      shape: 'square',
      view: 'Garden View',
      isBooked: true, // Table 5 is occupied
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 6',
      chairs: 2,
      location: 'Terrace',
      x: 12,
      y: 58,
      shape: 'square',
      view: 'Garden View',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 7',
      chairs: 2,
      location: 'Terrace',
      x: 12,
      y: 72,
      shape: 'square',
      view: 'Garden View',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 8',
      chairs: 6,
      location: 'Indoor',
      x: 38,
      y: 46,
      shape: 'round',
      view: 'Main Hall',
      isBooked: true, // Table 8 is occupied
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 9',
      chairs: 6,
      location: 'Indoor',
      x: 62,
      y: 46,
      shape: 'round',
      view: 'Main Hall',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 10',
      chairs: 6,
      location: 'Indoor',
      x: 38,
      y: 64,
      shape: 'round',
      view: 'Main Hall',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 11',
      chairs: 6,
      location: 'Indoor',
      x: 62,
      y: 64,
      shape: 'round',
      view: 'Main Hall',
      isBooked: true, // Table 11 is occupied
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 12',
      chairs: 2,
      location: 'Indoor',
      x: 88,
      y: 44,
      shape: 'square',
      view: 'Regular Hall',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 13',
      chairs: 2,
      location: 'Indoor',
      x: 88,
      y: 58,
      shape: 'square',
      view: 'Regular Hall',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 14',
      chairs: 2,
      location: 'Indoor',
      x: 88,
      y: 72,
      shape: 'square',
      view: 'Regular Hall',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 15',
      chairs: 4,
      location: 'Bar Area',
      x: 38,
      y: 86,
      shape: 'square',
      view: 'Counter View',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: bartartineTenantId,
      name: 'Table 16',
      chairs: 4,
      location: 'Bar Area',
      x: 62,
      y: 86,
      shape: 'square',
      view: 'Counter View',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: kfcTenantId,
      name: 'Booth A',
      chairs: 6,
      location: 'Main Hall',
      x: 30,
      y: 40,
      shape: 'square',
      view: 'Regular',
      isBooked: false,
      createdAt: new Date()
    },
    {
      tenantId: kfcTenantId,
      name: 'Table B1',
      chairs: 2,
      location: 'Window',
      x: 70,
      y: 40,
      shape: 'square',
      view: 'Regular',
      isBooked: false,
      createdAt: new Date()
    }
  ];

  await db.collection('tables').insertMany(seededTables);

  console.log('Seeding users...');
  const hashedSuperPassword = hashPassword('superadmin123');
  const hashedManagerPassword = hashPassword('manager123');

  const superAdmin = {
    email: 'super@dinelabs.co',
    password: hashedSuperPassword,
    role: 'superadmin',
    tenantId: null,
    createdAt: new Date(),
  };

  const kfcManager = {
    email: 'kfc@manager.com',
    password: hashedManagerPassword,
    role: 'manager',
    tenantId: kfcTenantId,
    createdAt: new Date(),
  };

  const bartartineManager = {
    email: 'bartartine@manager.com',
    password: hashedManagerPassword,
    role: 'manager',
    tenantId: bartartineTenantId,
    createdAt: new Date(),
  };

  await db.collection('users').insertMany([superAdmin, kfcManager, bartartineManager]);

  console.log('Seeding modifier groups...');
  // Tripartite modifiers for KFC & Bartartine
  const sizesGroup = {
    tenantId: bartartineTenantId,
    name: await createTranslationMap('Choose Size'),
    type: 'variations',
    options: [
      { name: await createTranslationMap('Small'), price: 0.00 },
      { name: await createTranslationMap('Medium'), price: 2.50 },
      { name: await createTranslationMap('Large'), price: 4.90 }
    ]
  };

  const addonsGroup = {
    tenantId: bartartineTenantId,
    name: await createTranslationMap('Premium Addons'),
    type: 'addons',
    options: [
      { name: await createTranslationMap('Extra Cheese'), price: 1.50 },
      { name: await createTranslationMap('Garlic Dipping Sauce'), price: 0.75 },
      { name: await createTranslationMap('Spicy Ranch Sauce'), price: 0.75 }
    ]
  };

  const removalsGroup = {
    tenantId: bartartineTenantId,
    name: await createTranslationMap('Remove Ingredients'),
    type: 'removals',
    options: [
      { name: await createTranslationMap('Onions'), price: 0.00 },
      { name: await createTranslationMap('Mushrooms'), price: 0.00 },
      { name: await createTranslationMap('Olives'), price: 0.00 }
    ]
  };

  const modResult = await db.collection('modifierGroups').insertMany([sizesGroup, addonsGroup, removalsGroup]);
  const sizeModId = modResult.insertedIds[0];
  const addonModId = modResult.insertedIds[1];
  const removeModId = modResult.insertedIds[2];

  console.log('Seeding categories...');
  const btCategories = [
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Offers & Promotions'),
      order: 0,
      isPinned: true, // Starred pinned category for top display
    },
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Classic Pizzas'),
      order: 1,
      isPinned: false,
    },
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Sides & Appetizers'),
      order: 2,
      isPinned: false,
    },
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Beverages'),
      order: 3,
      isPinned: false,
    }
  ];

  const catResult = await db.collection('categories').insertMany(btCategories);
  const offersCatId = catResult.insertedIds[0];
  const pizzasCatId = catResult.insertedIds[1];
  const sidesCatId = catResult.insertedIds[2];
  const drinksCatId = catResult.insertedIds[3];

  console.log('Seeding products...');
  const btProducts = [
    // Pinned / Offers Pizza
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Korean BBQ Chicken'),
      description: await createTranslationMap('Sweet and smoky Korean BBQ sauce, tender grilled chicken, red onions, and cilantro on a thin pan crust.'),
      price: 16.90,
      imageUrl: '/assets/bbq_chicken_pizza.png',
      categories: [offersCatId, pizzasCatId],
      isAvailable: true,
      order: 0,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    // Classic Pizzas
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Cheese Pizza'),
      description: await createTranslationMap('Rich marinara sauce topped with premium mozzarella cheese and fresh basil on a hand-stretched crust.'),
      price: 12.50,
      imageUrl: '/assets/cheese_pizza.png',
      categories: [pizzasCatId],
      isAvailable: true,
      order: 1,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Vegetarian Supreme'),
      description: await createTranslationMap('Loaded with bell peppers, red onions, mushrooms, black olives, and sweet corn over a rich tomato sauce base.'),
      price: 14.80,
      imageUrl: '/assets/veg_pizza.png',
      categories: [pizzasCatId],
      isAvailable: true,
      order: 2,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Pepperoni Feast'),
      description: await createTranslationMap('Crispy premium pepperoni slices piled high on melted mozzarella cheese and our signature seasoned pizza sauce.'),
      price: 15.90,
      imageUrl: '/assets/pep_pizza.png',
      categories: [pizzasCatId],
      isAvailable: true,
      order: 3,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    // Sides
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Garlic Flatzz'),
      description: await createTranslationMap('Crisp flatbread brushed with garlic-infused olive oil, loaded with mozzarella and sprinkled with sea salt.'),
      price: 8.50,
      imageUrl: '/assets/flatzz.png',
      categories: [sidesCatId],
      isAvailable: true,
      order: 0,
      modifierGroups: [addonModId]
    },
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Chicken Sticks'),
      description: await createTranslationMap('Premium chicken tender sticks seasoned with special herbs, deep fried to golden perfection.'),
      price: 9.20,
      imageUrl: '/assets/chicken_sticks.png',
      categories: [sidesCatId],
      isAvailable: true,
      order: 1,
      modifierGroups: [addonModId]
    },
    // Drinks
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Coca-Cola'),
      description: await createTranslationMap('Chilled classic Coca-Cola can.'),
      price: 2.50,
      imageUrl: '/assets/coke.png',
      categories: [drinksCatId],
      isAvailable: true,
      order: 0,
      modifierGroups: []
    },
    {
      tenantId: bartartineTenantId,
      name: await createTranslationMap('Still Water'),
      description: await createTranslationMap('Local mineral bottled water.'),
      price: 1.50,
      imageUrl: '/assets/water.png',
      categories: [drinksCatId],
      isAvailable: true,
      order: 1,
      modifierGroups: []
    }
  ];

  await db.collection('products').insertMany(btProducts);

  console.log('Seeding mock orders...');
  const sampleOrder1 = {
    tenantId: bartartineTenantId,
    orderNo: 10001,
    status: 'pending', // Pending order triggers audio loop!
    type: 'delivery',
    customer: {
      name: 'John Doe',
      phone: '+96170123456',
      email: 'john@example.com',
      address: 'Hamra Street, Building 45, 3rd Floor, Beirut',
      tableNo: null
    },
    items: [
      {
        name: 'Korean BBQ Chicken',
        price: 16.90,
        quantity: 1,
        size: 'Medium',
        addons: ['Extra Cheese'],
        removedIngredients: ['Onions'],
        priceCalculated: 20.90
      }
    ],
    subtotal: 20.90,
    deliveryFee: 3.50,
    total: 24.40,
    language: 'en',
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  };

  const sampleOrder2 = {
    tenantId: bartartineTenantId,
    orderNo: 10002,
    status: 'completed',
    type: 'dine-in',
    customer: {
      name: 'Guest Diner',
      phone: '',
      email: '',
      address: '',
      tableNo: 'Table 5'
    },
    items: [
      {
        name: 'Cheese Pizza',
        price: 12.50,
        quantity: 2,
        size: 'Large',
        addons: [],
        removedIngredients: [],
        priceCalculated: 17.40
      }
    ],
    subtotal: 34.80,
    deliveryFee: 0.00,
    total: 34.80,
    language: 'en',
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  };

  await db.collection('orders').insertMany([sampleOrder1, sampleOrder2]);

  console.log('Database seeded successfully!');
  await client.close();
  process.exit(0);
}

seed().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
