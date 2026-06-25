export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getTenantBySlug, getTenantProducts, getTenantCategories, getTenantModifierGroups } from '@/lib/tenant';
import StorefrontClient from './StorefrontClient';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';

export async function generateMetadata({ params }) {
  const { storename } = await params;
  const tenant = await getTenantBySlug(storename);
  if (!tenant) {
    return {
      title: 'Store Not Found - DineLabs',
    };
  }
  return {
    title: `${tenant.name} - Dynamic Digital Menu | DineLabs`,
    description: `Browse the digital menu for ${tenant.name}. Frictionless ordering and fresh ingredients.`,
  };
}

export default async function StorefrontPage({ params }) {
  const { storename } = await params;
  const tenant = await getTenantBySlug(storename);

  if (!tenant) {
    notFound();
  }

  // Log page view to database
  try {
    const db = await getDb();
    db.collection('page_views').insertOne({
      tenantId: tenant._id.toString(),
      createdAt: new Date()
    }).catch(err => console.error('Failed to log page view asynchronously:', err));
  } catch (err) {
    console.error('Failed to establish db connection for views tracking:', err);
  }

  // Fetch all related catalog data for this tenant
  const rawProducts = await getTenantProducts(tenant._id);
  const rawCategories = await getTenantCategories(tenant._id);
  const rawModifierGroups = await getTenantModifierGroups(tenant._id);

  // Serialize MongoDB ObjectIds/Documents to plain JS objects for Client Component hydration
  const products = JSON.parse(JSON.stringify(rawProducts));
  const categories = JSON.parse(JSON.stringify(rawCategories));
  const modifierGroups = JSON.parse(JSON.stringify(rawModifierGroups));
  const serializedTenant = JSON.parse(JSON.stringify(tenant));

  return (
    <StorefrontClient
      tenant={serializedTenant}
      initialProducts={products}
      initialCategories={categories}
      initialModifierGroups={modifierGroups}
    />
  );
}
