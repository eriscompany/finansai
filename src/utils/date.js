export function daysUntil(dateValue) {
  return Math.ceil((new Date(`${dateValue}T12:00:00`) - new Date()) / 86400000);
}
