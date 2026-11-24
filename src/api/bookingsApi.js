import {
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getSlotTimes, slotsNeeded } from '../utils/slots';

function makeSlotId(barberId, date, time) {
  return `${barberId}_${date}_${time}`;
}

// the slots that a booking takes: [{ id, time }]
function getBookingSlots(barberId, date, time, duration) {
  return getSlotTimes(time, slotsNeeded(duration)).map((slotTime) => ({
    id: makeSlotId(barberId, date, slotTime),
    time: slotTime,
  }));
}

function slotTakenError() {
  const error = new Error('Slot is already taken');
  error.code = 'slot-taken';
  return error;
}

export async function getTakenSlots(barberId, date) {
  const q = query(
    collection(db, 'slots'),
    where('barberId', '==', barberId),
    where('date', '==', date)
  );
  const snapshot = await getDocsFromServer(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function createBooking(data) {
  const slots = getBookingSlots(data.barberId, data.date, data.time, data.serviceDuration);
  const bookingRef = doc(collection(db, 'bookings'));

  await runTransaction(db, async (transaction) => {
    for (const slot of slots) {
      const snapshot = await transaction.get(doc(db, 'slots', slot.id));
      if (snapshot.exists()) {
        throw slotTakenError();
      }
    }

    transaction.set(bookingRef, {
      ...data,
      slotIds: slots.map((slot) => slot.id),
      createdAt: serverTimestamp(),
    });

    slots.forEach((slot) => {
      transaction.set(doc(db, 'slots', slot.id), {
        barberId: data.barberId,
        date: data.date,
        time: slot.time,
        userId: data.userId,
        bookingId: bookingRef.id,
      });
    });
  });

  return bookingRef.id;
}

export async function getMyBookings(uid) {
  // no orderBy here, so the query does not need an index
  const q = query(collection(db, 'bookings'), where('userId', '==', uid));
  const snapshot = await getDocsFromServer(q);
  const bookings = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

  bookings.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  return bookings;
}

export async function getBookingById(id) {
  const snapshot = await getDocFromServer(doc(db, 'bookings', id));
  if (!snapshot.exists()) {
    throw new Error('Booking not found');
  }
  return { id: snapshot.id, ...snapshot.data() };
}

export async function updateBooking(booking, changes) {
  const updated = { ...booking, ...changes };
  const newSlots = getBookingSlots(
    updated.barberId,
    updated.date,
    updated.time,
    updated.serviceDuration
  );
  const newSlotIds = newSlots.map((slot) => slot.id);

  // slots that stay the same are not touched
  const slotsToCreate = newSlots.filter((slot) => !booking.slotIds.includes(slot.id));
  const slotIdsToDelete = booking.slotIds.filter((id) => !newSlotIds.includes(id));

  await runTransaction(db, async (transaction) => {
    for (const slot of slotsToCreate) {
      const snapshot = await transaction.get(doc(db, 'slots', slot.id));
      if (snapshot.exists()) {
        throw slotTakenError();
      }
    }

    slotIdsToDelete.forEach((id) => {
      transaction.delete(doc(db, 'slots', id));
    });

    slotsToCreate.forEach((slot) => {
      transaction.set(doc(db, 'slots', slot.id), {
        barberId: updated.barberId,
        date: updated.date,
        time: slot.time,
        userId: booking.userId,
        bookingId: booking.id,
      });
    });

    transaction.update(doc(db, 'bookings', booking.id), { ...changes, slotIds: newSlotIds });
  });
}

export async function deleteBooking(booking) {
  const batch = writeBatch(db);
  batch.delete(doc(db, 'bookings', booking.id));
  booking.slotIds.forEach((id) => {
    batch.delete(doc(db, 'slots', id));
  });
  await batch.commit();
}
