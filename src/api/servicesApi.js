import {
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// the "FromServer" versions fail when there is no connection
// instead of returning an empty result from the cache

export async function getServices() {
  const q = query(collection(db, 'services'), orderBy('order'));
  const snapshot = await getDocsFromServer(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function getServiceById(id) {
  const snapshot = await getDocFromServer(doc(db, 'services', id));
  if (!snapshot.exists()) {
    throw new Error('Service not found');
  }
  return { id: snapshot.id, ...snapshot.data() };
}

export async function getBarbers() {
  const q = query(collection(db, 'barbers'), orderBy('order'));
  const snapshot = await getDocsFromServer(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
