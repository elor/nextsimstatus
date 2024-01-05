import { range, flattenDeep, flatten, uniq, padStart } from 'lodash'

export function nodels(definition) {
  const re = /([a-z0-9]+)(\[(\d+([,-]\d+)*)\])?/g
  const strictRe = /^([a-z0-9]+)(\[(\d+([,-]\d+)*)\])?(,([a-z0-9]+)(\[(\d+([,-]\d+)*)\])?)*$/

  if (!strictRe.test(definition)) {
    return []
  }

  const defs = matchAll(re, definition)

  const nodes = flatten(defs.map(def => def2nums(def.numdef).map(num => `${def.base}${num}`)))

  return uniq(nodes)
}

function matchAll(re, string) {
  const matches = []

  for (;;) {
    const match = re.exec(string)
    if (!match) {
      break
    }
    matches.push({ base: match[1], numdef: match[3] })
  }

  return matches
}

function def2nums(def) {
  if (!def) {
    return ['']
  }

  const parts = def.split(',')
  const nums = parts.map(part => {
    const match = /^(\d+)-(\d+)$/.exec(part)
    if (!match) {
      return part
    }

    // reproduce odd behavior of "nodels" command
    if (match[1].length > match[2].length) {
      return []
    }

    const first = Number(match[1])
    const last = Number(match[2])

    const numbers = range(first, last + 1)
    const digits = Math.min(match[1].length, match[2].length)

    return numbers.map(num => padStart(num, digits, '0'))
  })

  return flattenDeep(nums)
}
