import md5 from './md5'

const colors = {
  blue: '#03a9f4',
  green: '#4caf50',
  red: '#f44336',
  orange: '#fb8c00',
  plum: '#c37cfc'
}

const mapping = {
  free: colors.green,
  error: colors.red,
  err: colors.red,
  fail: colors.red,
  drain: colors.plum,
  alloc: colors.blue,
  reserved: colors.orange,
  'a.zienert': '#034f84'
}

export default function usercolor(name) {
  if (mapping[name.toLowerCase()]) {
    return mapping[name.toLowerCase()]
  }

  const hexColor = md5(name + md5(name)).substr(19, 6)

  return `#${hexColor}`
}
