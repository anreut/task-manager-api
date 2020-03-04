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

exports.validateDate = value => {
  if (typeof value === 'number') {
    return new Date(value).getTime() > 0;
  }
  return false;
};
