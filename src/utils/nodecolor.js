export default function nodecolor (node) {
  switch (true) {
    case node.CPUAlloc && node.CPULoad > node.CPUAlloc * 1.2:
      return 'red'
    case node.CPUAlloc === node.CPUTot:
      return 'light-blue'
    default:
      return 'green'
  }
}
