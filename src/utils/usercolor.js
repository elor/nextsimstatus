import md5 from './md5'
import { range, zipWith, sum } from 'lodash'

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
  alloc: colors.blue
}

const muteColor = 'ffffff'

function mix (...hexColors) {
  const colors = hexColors.map(stringToColor)
  const mixedColor = zipWith(...colors,
    (...components) => Math.floor(sum(components) / components.length)
  )
  return colorToString(mixedColor)
}

function stringToColor (colorString) {
  return range(0, 6, 2)
    .map(start => colorString.substr(start, 2))
    .map(twoHexDigits => parseInt(twoHexDigits, 16))
}

function colorToString (colorArray) {
  return colorArray.map(component => component.toString(16)).join('')
}

export default function usercolor (name, muted = false) {
  if (mapping[name.toLowerCase()]) {
    return mapping[name.toLowerCase()]
  }

  let hexColor = md5(name + md5(name)).substr(19, 6)

  if (muted) {
    hexColor = mix(hexColor, muteColor)
  }

  return `#${hexColor}`
}
