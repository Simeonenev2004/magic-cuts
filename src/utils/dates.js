const months = [
  'януари',
  'февруари',
  'март',
  'април',
  'май',
  'юни',
  'юли',
  'август',
  'септември',
  'октомври',
  'ноември',
  'декември',
];

export const weekdays = [
  'неделя',
  'понеделник',
  'вторник',
  'сряда',
  'четвъртък',
  'петък',
  'събота',
];

function pad(number) {
  return String(number).padStart(2, '0');
}

// uses the local parts of the date, so the day does not shift with the time zone
export function formatDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// 'YYYY-MM-DD' -> Date at local midnight
export function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// example: "1 декември 2026, вторник"
export function formatDateText(date) {
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${weekdays[date.getDay()]}`;
}

export function isPastBooking(booking) {
  const now = new Date();
  const today = formatDate(now);
  if (booking.date !== today) {
    return booking.date < today;
  }
  return booking.time <= formatTime(now);
}
