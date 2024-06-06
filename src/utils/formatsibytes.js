export default function formatSIbytes(kbytes) {
  let suffix = 'kB'
  let count = Number(kbytes) || 0

  if (count > 1024 ** 3) {
    count /= 1024 ** 3
    suffix = 'TB'
  } else if (count > 1024 ** 2) {
    count /= 1024 ** 2
    suffix = 'GB'
  } else if (count > 1024) {
    count /= 1024
    suffix = 'MB'
  }

  return `${count.toFixed(2)} ${suffix}`
}
