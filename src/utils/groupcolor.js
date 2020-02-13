import usercolor from './usercolor'

const mapping = {
  'enas': '#179c7d'
}

export default function groupcolor (name) {
  if (mapping[name.toLowerCase()]) {
    return mapping[name.toLowerCase()]
  }

  return usercolor(name)
}
