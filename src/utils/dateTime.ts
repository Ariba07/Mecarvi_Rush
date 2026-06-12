// utils/dateTimeUtils.js
export const getFormattedDateTime = () => {
  // Get the current date and time
  const currentDate = new Date();

  // Format the date as "Day, Month Date Year" (e.g., "Monday, November 30 2024")
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayName = daysOfWeek[currentDate.getDay()];
  const monthName = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${dayName}, ${monthName} ${day} ${year}`;

  // Format the time as "At HH:MM AM/PM" (e.g., "At 06:30 PM")
  let hours = currentDate.getHours();
  const minutes = currentDate.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `At ${hours}:${minutes} ${ampm}`;

  return {
    currentDate: formattedDate,
    currentTime: formattedTime,
  };
};

export default getFormattedDateTime;
