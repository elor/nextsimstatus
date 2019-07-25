import md5 from './md5'

const colors = {
  blue: '#03a9f4',
  green: '#4caf50',
  red: '#f44336',
  plum: '#c37cfc'
}

const mapping = {
  free: colors.green,
  error: colors.red,
  err: colors.red,
  fail: colors.red,
  drain: colors.plum,
  alloc: colors.blue,
  'a.zienert': '#034f84'
}

export default function usercolor (name) {
  if (mapping[name.toLowerCase()]) {
    return mapping[name.toLowerCase()]
  }

  let hexColor = md5(name + md5(name)).substr(19, 6)

  return `#${hexColor}`
}
