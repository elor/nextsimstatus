export function capitalize(word) {
  switch (word.length) {
    case 0:
      return ''
    case 1:
      return word.toUpperCase()
    default:
      return `${word[0].toUpperCase() + word.slice(1).toLowerCase()}`
  }
}
