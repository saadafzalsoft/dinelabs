import { getDb } from './db.js';

export async function getTenantBySlug(slug) {
  if (!slug) return null;
  const db = await getDb();
  return await db.collection('tenants').findOne({ slug: slug.toLowerCase() });
}

export async function getTenantProducts(tenantId) {
  const db = await getDb();
  return await db.collection('products')
    .find({ tenantId: tenantId.toString() })
    .sort({ order: 1 })
    .toArray();
}

export async function getTenantCategories(tenantId) {
  const db = await getDb();
  return await db.collection('categories')
    .find({ tenantId: tenantId.toString() })
    .sort({ order: 1 })
    .toArray();
}

export async function getTenantModifierGroups(tenantId) {
  const db = await getDb();
  return await db.collection('modifierGroups')
    .find({ tenantId: tenantId.toString() })
    .toArray();
}
