import { formatDate, weekdays } from './dates';

// every function returns an error message or an empty string

export function validateEmail(email) {
  const value = email.trim();
  if (!value) return 'Въведи имейл.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Невалиден имейл адрес.';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Въведи парола.';
  if (password.length < 6) return 'Паролата трябва да е поне 6 символа.';
  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return 'Повтори паролата.';
  if (password !== confirmPassword) return 'Паролите не съвпадат.';
  return '';
}

export function validateName(name) {
  const value = name.trim();
  if (!value) return 'Въведи име.';
  if (value.length < 2) return 'Името трябва да е поне 2 символа.';
  return '';
}

export function validatePhone(phone) {
  const value = phone.replace(/\s/g, '');
  if (!value) return 'Въведи телефон.';
  if (!/^(08\d{8}|\+3598\d{8})$/.test(value)) {
    return 'Невалиден номер. Пример: 0888123456';
  }
  return '';
}

export function validateBarber(barberId) {
  if (!barberId) return 'Избери фризьор.';
  return '';
}

// date is a Date object or null, barber is the chosen barber or undefined
export function validateBookingDate(date, barber) {
  if (!date) return 'Избери дата.';
  if (formatDate(date) < formatDate(new Date())) return 'Датата е в миналото.';
  if (barber && barber.daysOff.includes(date.getDay())) {
    return `Салонът не работи в ${weekdays[date.getDay()]}.`;
  }
  return '';
}

export function validateTime(time) {
  if (!time) return 'Избери час.';
  return '';
}

export function validateNote(note) {
  if (note.length > 200) return 'Бележката е най-много 200 символа.';
  return '';
}
