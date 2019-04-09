import { range, zipWith, sum } from 'lodash'

export function mix (...hexColors) {
  const colors = hexColors.map(fromString)
  const mixedColor = zipWith(...colors,
    (...components) => Math.floor(sum(components) / components.length)
  )
  return toString(mixedColor)
}

export function fromString (colorString) {
  return range(0, 6, 2)
    .map(start => colorString.substr(start, 2))
    .map(twoHexDigits => parseInt(twoHexDigits, 16))
}

export function toString (colorArray) {
  return colorArray.map(component => component.toString(16)).join('')
}
