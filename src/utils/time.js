function appendTimeValue(string, value, singular, plural) {
  switch (value) {
    case 0:
      return string
    case 1:
      return `${string}, ${value} ${singular}`
    default:
      return `${string}, ${value} ${plural}`
  }
}

export function format(seconds) {
  if (seconds === undefined) {
    return undefined
  }

  seconds = Math.floor(seconds)
  const minutes = Math.floor(seconds / 60) % 60
  const hours = Math.floor(seconds / 3600) % 24
  const days = Math.floor(seconds / 86400)
  seconds = seconds % 60

  let string = ''
  string = appendTimeValue(string, days, 'day', 'days')
  string = appendTimeValue(string, hours, 'hour', 'hours')
  string = appendTimeValue(string, minutes, 'minute', 'minutes')

  if (!string) {
    string = appendTimeValue(string, seconds || '0', 'second', 'seconds')
  }

  return string.replace(/^\s*,?\s*|,?\s*$/g, '')
}
