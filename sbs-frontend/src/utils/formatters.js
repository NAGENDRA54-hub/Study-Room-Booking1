export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value ?? 0))
}

export function formatDateTime(value) {
  if (!value) return 'Not set'

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function toDateTimeLocalInput(value) {
  const date = value ? new Date(value) : new Date()
  const timezoneOffset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}
