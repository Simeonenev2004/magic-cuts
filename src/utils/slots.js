import { formatDate } from './dates';

const SLOT_MINUTES = 30;

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function toTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

// all start times in the working hours, every 30 minutes
export function generateSlots(workStart, workEnd) {
  const slots = [];
  for (let m = toMinutes(workStart); m < toMinutes(workEnd); m += SLOT_MINUTES) {
    slots.push(toTime(m));
  }
  return slots;
}

export function slotsNeeded(duration) {
  return Math.ceil(duration / SLOT_MINUTES);
}

// the consecutive slots that one booking takes
export function getSlotTimes(startTime, count) {
  const times = [];
  for (let i = 0; i < count; i++) {
    times.push(toTime(toMinutes(startTime) + i * SLOT_MINUTES));
  }
  return times;
}

// start times that can be chosen for the given day
export function getAvailableTimes({ workStart, workEnd, duration, takenTimes, date, now = new Date() }) {
  const count = slotsNeeded(duration);
  const isToday = date === formatDate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return generateSlots(workStart, workEnd).filter((time) => {
    const start = toMinutes(time);

    if (start + duration > toMinutes(workEnd)) {
      return false;
    }
    if (isToday && start <= nowMinutes) {
      return false;
    }
    return getSlotTimes(time, count).every((slot) => !takenTimes.includes(slot));
  });
}
