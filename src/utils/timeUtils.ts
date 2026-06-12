export const convertTo24HourFormat = (timeStr: string) => {
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':');
  let hourNum = parseInt(hours, 10);

  if (period === 'PM' && hourNum !== 12) {
    hourNum += 12;
  } else if (period === 'AM' && hourNum === 12) {
    hourNum = 0;
  }

  return `${hourNum.toString().padStart(2, '0')}:${minutes}`;
};
