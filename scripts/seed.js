// Fills the services and barbers collections.
// Usage: node scripts/seed.js ../<service-account-key>.json

const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { services, barbers } = require('./seedData');

const keyPath = process.argv[2];

if (!keyPath) {
  console.log('Usage: node scripts/seed.js <path-to-service-account-key.json>');
  process.exit(1);
}

const serviceAccount = require(path.resolve(keyPath));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function saveCollection(name, items) {
  for (const item of items) {
    const { id, ...data } = item;
    // fixed ids, so running the script again does not create duplicates
    await db.collection(name).doc(id).set(data);
  }
  console.log(`${name}: ${items.length} documents saved`);
}

async function seed() {
  await saveCollection('services', services);
  await saveCollection('barbers', barbers);
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log('Seed failed:', error.message);
    process.exit(1);
  });
