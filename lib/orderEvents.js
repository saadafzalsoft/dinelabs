import { EventEmitter } from 'events';

const globalForEvents = global;
if (!globalForEvents.__dinelabsOrderEvents) {
  globalForEvents.__dinelabsOrderEvents = new EventEmitter();
  globalForEvents.__dinelabsOrderEvents.setMaxListeners(500);
}

export const orderEvents = globalForEvents.__dinelabsOrderEvents;

export function emitNewOrder(tenantId, order) {
  if (!tenantId || !order) return;
  const tid = String(tenantId);
  orderEvents.emit('order:' + tid, order);
  orderEvents.emit('order:all', { tenantId: tid, order });
}
