const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

exports.validateRepeatDays = days => {
  if (days.length !== 0) {
    return days.every(day => weekDays.includes(day.toLowerCase()));
  }
  return false;
};
