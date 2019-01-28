import { sum } from 'lodash'

export default function cpudata (nodes) {
  const allocated = sum(nodes.map(node => Number(node.CPUAlloc)))
  const errored = sum(nodes.map(node => Number(node.CPUErr)))
  const total = sum(nodes.map(node => Number(node.CPUTot)))
  const free = total - allocated - errored

  return { total, allocated, free, errored }
}
