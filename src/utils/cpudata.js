import { mergeWith, intersection } from 'lodash'
import { drainstates, failstates } from './nodeStates'
import splitStates from './splitStates'

function sum (A, B) {
  return (A || 0) + (B || 0)
}

function hasState (states, reference) {
  return !!intersection(states, reference).length
}

export default function cpudata (...nodes) {
  const cpudataPerNode = nodes.map(node => {
    const allocated = Number(node.CPUAlloc)
    const error = Number(node.CPUErr)
    const total = Number(node.CPUTot)
    const rest = total - allocated - error

    let free = 0
    let fail = 0
    let drain = 0

    const states = splitStates(node.State)

    if (hasState(states, drainstates)) {
      drain = rest
    } else if (hasState(states, failstates)) {
      fail = rest
    } else {
      free = rest
    }

    return { total, allocated, free, error, drain, fail }
  })

  const reduced = mergeWith({}, ...cpudataPerNode, sum)
  return reduced
}
