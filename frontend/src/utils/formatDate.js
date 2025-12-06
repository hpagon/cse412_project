/**
 * Format a date string or timestamp to a readable date (MM/DD/YYYY)
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateValue) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return dateValue; // Return original if invalid

  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

/**
 * Format a time string to readable format (HH:MM AM/PM)
 * @param {string} timeValue - The time to format
 * @returns {string} Formatted time string
 */
export const formatTime = (timeValue) => {
  if (!timeValue) return "N/A";

  // If already in HH:MM:SS format, parse it
  const parts = timeValue.split(":");
  if (parts.length >= 2) {
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return timeValue;
};
