export function formatTry(value) {
  return `₺${Math.abs(Number(value) || 0).toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

export function formatDateTR(dateValue) {
  return new Date(`${dateValue}T12:00:00`).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short"
  });
}
