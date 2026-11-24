const services = [
  {
    id: 'haircut',
    name: 'Мъжко подстригване',
    price: 10,
    duration: 30,
    icon: 'content-cut',
    order: 1,
    description:
      'Класическо подстригване с ножица и машинка, с измиване и оформяне накрая. Подходящо за всяка дължина на косата.',
  },
  {
    id: 'fade',
    name: 'Фейд',
    price: 12,
    duration: 40,
    icon: 'hair-dryer',
    order: 2,
    description:
      'Плавно преливане отстрани и отзад, от нула до избраната дължина. За хора, които искат модерна и поддържана прическа.',
  },
  {
    id: 'beard',
    name: 'Оформяне на брада',
    price: 6,
    duration: 20,
    icon: 'face-man',
    order: 3,
    description:
      'Подравняване и оформяне на брадата с машинка и изчистване на контурите. Подходящо и за къса, и за дълга брада.',
  },
  {
    id: 'haircut-beard',
    name: 'Подстригване + брада',
    price: 15,
    duration: 50,
    icon: 'face-man-shimmer',
    order: 4,
    description:
      'Подстригване и оформяне на брада в едно посещение. Най-удобният избор, ако искаш цялостна промяна.',
  },
  {
    id: 'kids',
    name: 'Детско подстригване',
    price: 8,
    duration: 30,
    icon: 'human-child',
    order: 5,
    description:
      'Подстригване за деца до 12 години. Работим спокойно и без бързане, за да се чувства детето добре.',
  },
  {
    id: 'razor-shave',
    name: 'Бръснене с бръснач',
    price: 8,
    duration: 25,
    icon: 'razor-double-edge',
    order: 6,
    description:
      'Традиционно бръснене с топла кърпа, пяна и бръснач. За гладка кожа и малко почивка в стола.',
  },
];

const barbers = [
  {
    id: 'dimitar',
    name: 'Димитър Иванов',
    specialty: 'Фейд и модерни прически',
    order: 1,
    workStart: '08:00',
    workEnd: '19:00',
    daysOff: [0],
  },
  {
    id: 'dzhoshkun',
    name: 'Джошкун',
    specialty: 'Класически подстригвания и брада',
    order: 2,
    workStart: '08:00',
    workEnd: '19:00',
    daysOff: [0],
  },
];

module.exports = { services, barbers };
