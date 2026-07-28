import { getCountryTimezone, getStoreLocalTime, checkIfStoreOpen } from '../lib/timezone.js';

console.log('--- Testing Country Timezone Mappings ---');
console.log('Lebanon:', getCountryTimezone('Lebanon'));
console.log('Georgia:', getCountryTimezone('Georgia'));
console.log('United Arab Emirates:', getCountryTimezone('United Arab Emirates'));
console.log('United States:', getCountryTimezone('United States'));
console.log('Unknown Country:', getCountryTimezone('Atlantis'));

console.log('\n--- Testing Local Time Calculation ---');
console.log('Store time in Georgia:', getStoreLocalTime('Georgia'));
console.log('Store time in Lebanon:', getStoreLocalTime('Lebanon'));
console.log('Store time in UAE:', getStoreLocalTime('United Arab Emirates'));

console.log('\n--- Testing Store Open Checks ---');
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Test 1: Store open all day (00:00 - 23:59)
const openAllDay = daysOfWeek.map(day => ({ day, open: '00:00', close: '23:59', isOpen: true }));
console.log('Always open store (Georgia):', checkIfStoreOpen(openAllDay, 'Georgia'));

// Test 2: Store closed on all days
const closedAllDay = daysOfWeek.map(day => ({ day, open: '09:00', close: '22:00', isOpen: false }));
console.log('Closed store (Lebanon):', checkIfStoreOpen(closedAllDay, 'Lebanon'));

// Test 3: Overnight hours (18:00 - 04:00)
const overnightSchedule = daysOfWeek.map(day => ({ day, open: '18:00', close: '04:00', isOpen: true }));
console.log('Overnight store (UAE):', checkIfStoreOpen(overnightSchedule, 'United Arab Emirates'));

console.log('\nAll timezone tests executed successfully!');
