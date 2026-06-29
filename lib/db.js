import { MongoClient, ObjectId } from 'mongodb';
import { hashPassword } from './auth.js';
import fs from 'fs';
import path from 'path';

// Parse .env manually for instant local HMR runtime synchronization
try {
  let envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    envPath = '/Users/apple/Documents/dinelabs/.env';
  }
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
  // Graceful fallback
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dinelabs';
const isDev = process.env.NODE_ENV !== 'production';

// High-fidelity in-memory database store to fall back to if MongoDB is not available
let isMemoryDb = false;
let memoryStore = {
  tenants: [],
  users: [],
  categories: [],
  products: [],
  modifierGroups: [],
  orders: [],
  tables: []
};

// Seed function for Memory DB
async function seedMemoryDb() {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const kfcId = '6a1edf628bc82fe73f15def5';
  const bartartineId = '6a1edf628bc82fe73f15def6';

  const kfcTenant = {
    _id: kfcId,
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
    _id: bartartineId,
    slug: 'bartartine',
    name: 'bar text',
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

  memoryStore.tenants.push(kfcTenant, bartartineTenant);

  // Users
  const hashedSuperPassword = hashPassword('superadmin123');
  const hashedManagerPassword = hashPassword('manager123');

  memoryStore.users.push(
    {
      _id: '7a1edf628bc82fe73f15def5',
      email: 'super@dinelabs.co',
      password: hashedSuperPassword,
      role: 'superadmin',
      tenantId: null,
      createdAt: new Date(),
    },
    {
      _id: '7a1edf628bc82fe73f15def6',
      email: 'kfc@manager.com',
      password: hashedManagerPassword,
      role: 'manager',
      tenantId: kfcId,
      createdAt: new Date(),
    },
    {
      _id: '7a1edf628bc82fe73f15def7',
      email: 'bartartine@manager.com',
      password: hashedManagerPassword,
      role: 'manager',
      tenantId: bartartineId,
      createdAt: new Date(),
    }
  );

  // Modifier Groups
  const sizeModId = '6a1edf628bc82fe73f15def7';
  const addonModId = '6a1edf628bc82fe73f15def8';
  const removeModId = '6a1edf628bc82fe73f15def9';

  memoryStore.modifierGroups.push(
    {
      _id: sizeModId,
      tenantId: bartartineId,
      name: { en: 'Choose Size', ar: 'اختر الحجم' },
      type: 'variations',
      options: [
        { name: { en: 'Small', ar: 'صغير' }, price: 0.00 },
        { name: { en: 'Medium', ar: 'متوسط' }, price: 2.50 },
        { name: { en: 'Large', ar: 'كبير' }, price: 4.90 }
      ]
    },
    {
      _id: addonModId,
      tenantId: bartartineId,
      name: { en: 'Premium Addons', ar: 'إضافات مميزة' },
      type: 'addons',
      options: [
        { name: { en: 'Extra Cheese', ar: 'جبنة إضافية' }, price: 1.50 },
        { name: { en: 'Garlic Dipping Sauce', ar: 'صلصة الثوم الخاصة' }, price: 0.75 },
        { name: { en: 'Spicy Ranch Sauce', ar: 'صلصة رانش الحارة' }, price: 0.75 }
      ]
    },
    {
      _id: removeModId,
      tenantId: bartartineId,
      name: { en: 'Remove Ingredients', ar: 'إزالة المكونات' },
      type: 'removals',
      options: [
        { name: { en: 'Onions', ar: 'البصل' }, price: 0.00 },
        { name: { en: 'Mushrooms', ar: 'الفطر' }, price: 0.00 },
        { name: { en: 'Olives', ar: 'الزيتون الأسود' }, price: 0.00 }
      ]
    }
  );

  // Categories
  const offersCatId = '6a1edf628bc82fe73f15defa';
  const pizzasCatId = '6a1edf628bc82fe73f15defb';
  const sidesCatId = '6a1edf628bc82fe73f15defc';
  const drinksCatId = '6a1edf628bc82fe73f15defd';

  memoryStore.categories.push(
    {
      _id: offersCatId,
      tenantId: bartartineId,
      name: { en: 'Offers & Promotions', ar: 'العروض والخصومات' },
      order: 0,
      isPinned: true
    },
    {
      _id: pizzasCatId,
      tenantId: bartartineId,
      name: { en: 'Classic Pizzas', ar: 'البيتزا الكلاسيكية' },
      order: 1,
      isPinned: false
    },
    {
      _id: sidesCatId,
      tenantId: bartartineId,
      name: { en: 'Sides & Appetizers', ar: 'المقبلات والوجبات الجانبية' },
      order: 2,
      isPinned: false
    },
    {
      _id: drinksCatId,
      tenantId: bartartineId,
      name: { en: 'Beverages', ar: 'المشروبات المنعشة' },
      order: 3,
      isPinned: false
    }
  );

  // Products
  memoryStore.products.push(
    {
      _id: '8a1edf628bc82fe73f15def1',
      tenantId: bartartineId,
      name: { en: 'Korean BBQ Chicken', ar: 'دجاج كوري باربيكيو' },
      description: {
        en: 'Sweet and smoky Korean BBQ sauce, tender grilled chicken, red onions, and cilantro on a thin pan crust.',
        ar: 'صلصة باربيكيو كورية حلوة ومدخنة، دجاج مشوي طري، بصل أحمر، وكزبرة على عجينة مقلاة رقيقة.'
      },
      price: 16.90,
      imageUrl: '/assets/bbq_chicken_pizza.png',
      categories: [offersCatId, pizzasCatId],
      isAvailable: true,
      order: 0,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    {
      _id: '8a1edf628bc82fe73f15def2',
      tenantId: bartartineId,
      name: { en: 'Cheese Pizza', ar: 'بيتزا الجبن الكلاسيكية' },
      description: {
        en: 'Rich marinara sauce topped with premium mozzarella cheese and fresh basil on a hand-stretched crust.',
        ar: 'صلصة مارينارا الغنية تعلوها جبنة الموزاريلا الفاخرة والريحان الطازج على عجينة مفرودة يدوياً.'
      },
      price: 12.50,
      imageUrl: '/assets/cheese_pizza.png',
      categories: [pizzasCatId],
      isAvailable: true,
      order: 1,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    {
      _id: '8a1edf628bc82fe73f15def3',
      tenantId: bartartineId,
      name: { en: 'Vegetarian Supreme', ar: 'بيتزا الخضار الفاخرة' },
      description: {
        en: 'Loaded with bell peppers, red onions, mushrooms, black olives, and sweet corn over a rich tomato sauce base.',
        ar: 'مليئة بالفلفل الحلو، البصل الأحمر، الفطر، الزيتون الأسود، والذرة الحلوة على قاعدة صلصة الطماطم الغنية.'
      },
      price: 14.80,
      imageUrl: '/assets/veg_pizza.png',
      categories: [pizzasCatId],
      isAvailable: true,
      order: 2,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    {
      _id: '8a1edf628bc82fe73f15def4',
      tenantId: bartartineId,
      name: { en: 'Pepperoni Feast', ar: 'بيتزا بيبيروني لعشاق اللحوم' },
      description: {
        en: 'Crispy premium pepperoni slices piled high on melted mozzarella cheese and our signature seasoned pizza sauce.',
        ar: 'شرائح بيبيروني مقرمشة مكدسة فوق جبن الموزاريلا الذائب وصلصة البيتزا المتبلة المميزة لدينا.'
      },
      price: 15.90,
      imageUrl: '/assets/pep_pizza.png',
      categories: [pizzasCatId],
      isAvailable: true,
      order: 3,
      modifierGroups: [sizeModId, addonModId, removeModId]
    },
    {
      _id: '8a1edf628bc82fe73f15def5',
      tenantId: bartartineId,
      name: { en: 'Garlic Flatzz', ar: 'فلاتز بالثوم والأعشاب' },
      description: {
        en: 'Crisp flatbread brushed with garlic-infused olive oil, loaded with mozzarella and sprinkled with sea salt.',
        ar: 'خبز مسطح مقرمش مدهون بزيت الزيتون المنقوع بالثوم، محشو بالموزاريلا ومرشوش بملح البحر.'
      },
      price: 8.50,
      imageUrl: '/assets/flatzz.png',
      categories: [sidesCatId],
      isAvailable: true,
      order: 0,
      modifierGroups: [addonModId]
    },
    {
      _id: '8a1edf628bc82fe73f15def6',
      tenantId: bartartineId,
      name: { en: 'Chicken Sticks', ar: 'أصابع الدجاج المقرمشة' },
      description: {
        en: 'Premium chicken tender sticks seasoned with special herbs, deep fried to golden perfection.',
        ar: 'أصابع دجاج فيليه فاخرة متبلة بالأعشاب الخاصة، مقلية حتى اللون الذهبي المثالي.'
      },
      price: 9.20,
      imageUrl: '/assets/chicken_sticks.png',
      categories: [sidesCatId],
      isAvailable: true,
      order: 1,
      modifierGroups: [addonModId]
    },
    {
      _id: '8a1edf628bc82fe73f15def7',
      tenantId: bartartineId,
      name: { en: 'Coca-Cola', ar: 'كوكا كولا' },
      description: { en: 'Chilled classic Coca-Cola can.', ar: 'علبة كوكا كولا كلاسيكية باردة.' },
      price: 2.50,
      imageUrl: '/assets/coke.png',
      categories: [drinksCatId],
      isAvailable: true,
      order: 0,
      modifierGroups: []
    },
    {
      _id: '8a1edf628bc82fe73f15def8',
      tenantId: bartartineId,
      name: { en: 'Still Water', ar: 'مياه معدنية' },
      description: { en: 'Local mineral bottled water.', ar: 'زجاجة مياه معدنية طبيعية.' },
      price: 1.50,
      imageUrl: '/assets/water.png',
      categories: [drinksCatId],
      isAvailable: true,
      order: 1,
      modifierGroups: []
    }
  );

  // Orders
  memoryStore.orders.push(
    {
      _id: '9a1edf628bc82fe73f15def1',
      tenantId: bartartineId,
      orderNo: 10001,
      status: 'pending',
      type: 'delivery',
      customer: {
        name: 'John Doe',
        phone: '+961 70 123 456',
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
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      _id: '9a1edf628bc82fe73f15def2',
      tenantId: bartartineId,
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
      createdAt: new Date(Date.now() - 172800000),
    }
  );

  // Tables Seeding in Memory DB
  memoryStore.tables.push(
    {
      _id: 'aa1edf628bc82fe73f15def1',
      tenantId: bartartineId,
      name: 'Table 1',
      chairs: 4,
      location: 'Indoor',
      isBooked: false,
      createdAt: new Date()
    },
    {
      _id: 'aa1edf628bc82fe73f15def2',
      tenantId: bartartineId,
      name: 'Table 2',
      chairs: 2,
      location: 'Bar Area',
      isBooked: true,
      createdAt: new Date()
    },
    {
      _id: 'aa1edf628bc82fe73f15def3',
      tenantId: bartartineId,
      name: 'Table 3',
      chairs: 6,
      location: 'Terrace',
      isBooked: false,
      createdAt: new Date()
    },
    {
      _id: 'aa1edf628bc82fe73f15def4',
      tenantId: bartartineId,
      name: 'Table 4',
      chairs: 4,
      location: 'Indoor',
      isBooked: false,
      createdAt: new Date()
    },
    {
      _id: 'aa1edf628bc82fe73f15def5',
      tenantId: bartartineId,
      name: 'Table 5',
      chairs: 4,
      location: 'Terrace',
      isBooked: false,
      createdAt: new Date()
    }
  );
}

// Check MongoDB connection with custom timeout
let client;
let clientPromise;

async function tryConnectMongo() {
  try {
    const mongoClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });
    const promise = mongoClient.connect();
    await promise; // Test connection
    client = mongoClient;
    clientPromise = Promise.resolve(mongoClient);
    console.log('✅ Connected to MongoDB at', MONGODB_URI);
    
    // Configure database indexes asynchronously
    const db = mongoClient.db();
    Promise.all([
      db.collection('orders').createIndex({ tenantId: 1 }),
      db.collection('orders').createIndex({ createdAt: -1 }),
      db.collection('products').createIndex({ tenantId: 1 }),
      db.collection('users').createIndex({ tenantId: 1 }),
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('categories').createIndex({ tenantId: 1 })
    ]).then(() => {
      console.log('✅ Database indexes configured/checked.');
    }).catch(err => {
      console.warn('⚠️ Non-fatal index creation warning:', err.message);
    });

    return true;
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Initializing high-fidelity in-memory database fallback...');
    isMemoryDb = true;
    await seedMemoryDb();
    return false;
  }
}

// Initialise DB promise
let initPromise = tryConnectMongo();

export async function getDb() {
  await initPromise;
  if (!client) {
    const reconnected = await tryConnectMongo();
    if (reconnected) {
      isMemoryDb = false;
    }
  }
  if (isMemoryDb || !client) {
    return createMemoryDbInterface();
  }
  return client.db();
}

export default initPromise.then(() => client).catch(() => null);

// Query matching helper for In-Memory Database API Emulator
function matchItem(item, query) {
  for (const [key, value] of Object.entries(query)) {
    const itemVal = item[key];
    if (value && typeof value === 'object' && value.constructor === Object) {
      // Complex operator matching like $in or $ne
      for (const [op, val] of Object.entries(value)) {
        if (op === '$in') {
          const arr = Array.isArray(val) ? val.map(v => (v || '').toString()) : [];
          const itemValStr = (itemVal || '').toString();
          if (Array.isArray(itemVal)) {
            if (!itemVal.some(i => arr.includes((i || '').toString()))) return false;
          } else {
            if (!arr.includes(itemValStr)) return false;
          }
        } else if (op === '$ne') {
          if ((itemVal || '').toString() === (val || '').toString()) return false;
        } else {
          // Fallback direct matching
          if (itemVal !== value) return false;
        }
      }
    } else {
      // Standard direct match
      if (key === '_id' || key === 'tenantId') {
        // Support both string and ObjectId match
        if ((itemVal || '').toString() !== (value || '').toString()) return false;
      } else {
        if (itemVal !== value) return false;
      }
    }
  }
  return true;
}

// High-fidelity In-Memory Database API Emulator
function createMemoryDbInterface() {
  const collectionInterface = (collectionName) => {
    const store = memoryStore[collectionName];
    if (!store) {
      memoryStore[collectionName] = [];
    }

    return {
      find: (query = {}) => {
        let results = [...memoryStore[collectionName]].filter(item => matchItem(item, query));

        return {
          toArray: async () => results,
          sort: (sortQuery) => {
            const sortKey = Object.keys(sortQuery)[0];
            const sortOrder = sortQuery[sortKey];
            results.sort((a, b) => {
              if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
              if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
              return 0;
            });
            return { toArray: async () => results };
          },
          limit: (n) => {
            results = results.slice(0, n);
            return { toArray: async () => results };
          }
        };
      },

      findOne: async (query = {}) => {
        const results = memoryStore[collectionName];
        const match = results.find(item => matchItem(item, query));
        return match || null;
      },

      insertOne: async (doc) => {
        const newDoc = { ...doc };
        if (!newDoc._id) {
          newDoc._id = new ObjectId().toString();
        } else {
          newDoc._id = newDoc._id.toString();
        }
        memoryStore[collectionName].push(newDoc);
        return { insertedId: newDoc._id, acknowledged: true };
      },

      insertMany: async (docs) => {
        const insertedIds = {};
        const newDocs = docs.map((doc, idx) => {
          const newDoc = { ...doc };
          if (!newDoc._id) {
            newDoc._id = new ObjectId().toString();
          } else {
            newDoc._id = newDoc._id.toString();
          }
          insertedIds[idx] = newDoc._id;
          return newDoc;
        });
        memoryStore[collectionName].push(...newDocs);
        return { insertedIds, acknowledged: true };
      },

      updateOne: async (query, update) => {
        const results = memoryStore[collectionName];
        const index = results.findIndex(item => matchItem(item, query));

        if (index === -1) {
          return { matchedCount: 0, modifiedCount: 0 };
        }

        const currentItem = results[index];
        const setQuery = update.$set || {};
        const unsetQuery = update.$unset || {};

        const updatedItem = { ...currentItem, ...setQuery };
        for (const key of Object.keys(unsetQuery)) {
          delete updatedItem[key];
        }

        results[index] = updatedItem;
        return { matchedCount: 1, modifiedCount: 1 };
      },

      updateMany: async (query, update) => {
        const results = memoryStore[collectionName];
        let modifiedCount = 0;
        
        results.forEach((item, index) => {
          if (matchItem(item, query)) {
            const setQuery = update.$set || {};
            const unsetQuery = update.$unset || {};
            const updatedItem = { ...item, ...setQuery };
            for (const key of Object.keys(unsetQuery)) {
              delete updatedItem[key];
            }
            results[index] = updatedItem;
            modifiedCount++;
          }
        });

        return { matchedCount: modifiedCount, modifiedCount };
      },

      deleteOne: async (query) => {
        const results = memoryStore[collectionName];
        const index = results.findIndex(item => matchItem(item, query));

        if (index === -1) {
          return { deletedCount: 0 };
        }

        results.splice(index, 1);
        return { deletedCount: 1 };
      },

      deleteMany: async (query = {}) => {
        const results = memoryStore[collectionName];
        const initialCount = results.length;
        
        memoryStore[collectionName] = results.filter(item => !matchItem(item, query));

        const deletedCount = initialCount - memoryStore[collectionName].length;
        return { deletedCount };
      },

      countDocuments: async (query = {}) => {
        const results = memoryStore[collectionName];
        const matches = results.filter(item => matchItem(item, query));
        return matches.length;
      }
    };
  };

  return {
    collection: collectionInterface
  };
}
