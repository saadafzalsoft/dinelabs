import { getDb } from '@/lib/db';
import { getTenantBySlug } from '@/lib/tenant';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Order Confirmed - DineLabs',
  description: 'Your order was received successfully.',
};

export default async function OrderConfirmationPage({ params }) {
  const { storename, id } = await params;

  const tenant = await getTenantBySlug(storename);
  if (!tenant) {
    notFound();
  }

  const db = await getDb();
  const order = await db.collection('orders').findOne({ _id: id.toString() });

  if (!order) {
    notFound();
  }

  const table = order.type === 'dine-in' 
    ? await db.collection('tables').findOne({ tenantId: tenant._id.toString(), name: order.customer.tableNo })
    : null;

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const origin = `${proto}://${host}`;

  // Format currency helper
  const formatPrice = (amount) => {
    return '$' + parseFloat(amount).toFixed(2).replace('.', ',');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh', padding: '60px 20px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Success check animation header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', fontSize: '40px', marginBottom: '24px' }}>
          ✓
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>
          Order Received!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Your order <strong>#{order.orderNo}</strong> has been submitted to {tenant.name} and is currently pending kitchen confirmation.
        </p>

        {/* Premium Scannable Table Ticket for Dine-In sessions */}
        {order.type === 'dine-in' && (
          <div style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '24px', 
            border: '2px solid #10b981', 
            padding: '24px', 
            textAlign: 'center', 
            marginBottom: '24px', 
            boxShadow: '0 10px 25px rgba(16, 185, 129, 0.06)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Ribbons / Badges */}
            <div style={{
              position: 'absolute',
              top: '14px',
              right: '-30px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              transform: 'rotate(45deg)',
              fontSize: '0.65rem',
              fontWeight: '900',
              padding: '4px 30px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Dine-In
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#10b981', fontSize: '24px', marginBottom: '16px' }}>
              🍽️
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px', color: 'var(--text-main)' }}>
              Table Ticket Pass
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '16px' }}>
              Present this pass or keep it open for your waiter.
            </p>

            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              borderRadius: '16px', 
              padding: '16px', 
              marginBottom: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px dashed var(--border-light)'
            }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Your Assigned Table
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '900', color: 'var(--brand-red)', margin: '4px 0' }}>
                {order.customer.tableNo}
              </span>
              {table && (
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  📍 {table.location} Section · 🪑 {table.chairs} Chairs
                </span>
              )}
            </div>

            {/* Waiter QR Code */}
            <div style={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid var(--border-light)', 
              borderRadius: '16px', 
              padding: '12px', 
              display: 'inline-block', 
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${origin}/manager/live-orders?orderNo=${order.orderNo}`
                )}`}
                alt="Waiter QR Ticket"
                style={{ width: '180px', height: '180px', display: 'block' }}
              />
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', lineHeight: 1.4, padding: '0 12px' }}>
              📲 Waitstaff Scanning Guide:<br />
              <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>
                Scan this card to instantly find order #<strong>{order.orderNo}</strong> on your device, approve the kitchen ticket, and match the table placement.
              </span>
            </div>
          </div>
        )}

        {/* Call support warning callout box */}
        <div style={{ backgroundColor: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '16px', borderRadius: '0 12px 12px 0', textAlign: 'left', marginBottom: '24px', fontSize: '0.85rem', color: '#b45309', fontWeight: '600' }}>
          ⚠️ Order cannot be cancelled or modified after submission. For any changes, please contact the restaurant directly.
        </div>

        {/* Card: Summary of customer fulfillment */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            Fulfillment details
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Fulfillment Mode</span>
              <span style={{ fontWeight: '700', textTransform: 'capitalize' }}>{order.type}</span>
            </div>

            {order.type === 'dine-in' ? (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Table Code</span>
                <span style={{ fontWeight: '700' }}>{order.customer.tableNo}</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name</span>
                  <span style={{ fontWeight: '700' }}>{order.customer.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone Number</span>
                  <span style={{ fontWeight: '700' }}>{order.customer.phone}</span>
                </div>
              </>
            )}

            {order.type === 'delivery' && (
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Delivery Address</span>
                <span style={{ fontWeight: '600', lineHeight: 1.4 }}>{order.customer.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card: Order Details Summary */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '24px', textAlign: 'left', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '16px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ fontWeight: '700' }}>{item.quantity}x {item.name}</div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {item.size && `${item.size}`}
                    {item.addons && item.addons.length > 0 && `, +${item.addons.join(', ')}`}
                    {item.removedIngredients && item.removedIngredients.length > 0 && `, (No ${item.removedIngredients.join(', ')})`}
                  </span>
                </div>
                <span style={{ fontWeight: '600' }}>{formatPrice(item.priceCalculated * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.type === 'delivery' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                <span>Delivery Fee</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: '800', borderTop: '1px dashed var(--border-light)', marginTop: '12px', paddingTop: '12px' }}>
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Back to menu button */}
        <Link 
          href={`/${storename}`} 
          className="checkout-btn"
          style={{ textDecoration: 'none', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          Return to Menu
        </Link>
      </div>
    </div>
  );
}
