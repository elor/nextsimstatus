import { zipWith, sum } from 'lodash'
import colorConvert from 'color-convert'

export function mix (...hexColors) {
  const colors = hexColors.map(fromString)
  const mixedColor = zipWith(...colors,
    (...components) => Math.floor(sum(components) / components.length)
  )
  return toString(mixedColor)
}

export function fromString (hexRGB) {
  return colorConvert.hex.rgb(hexRGB)
}

export function toString (rgb) {
  return colorConvert.rgb.hex(rgb)
}

export function isDark (hexRGB, threshold = 0x30) {
  const HSL = colorConvert.hex.hsl(hexRGB)
  const L = HSL[2]
  console.log(`${hexRGB} => ${HSL}`)
  return L < threshold
}
