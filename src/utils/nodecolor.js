export default function nodecolor(node) {
  switch (true) {
    case node.CPUAlloc && node.CPULoad > node.CPUTot * 1.1:
      return 'red'
    case node.CPUAlloc === node.CPUTot:
      return 'light-blue'
    default:
      return 'green'
  }
}
