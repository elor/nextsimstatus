import usercolor from './usercolor'

const mapping = {
  enas: '#179c7d',
  admins: '#1976d2'
}

export default function groupcolor(name) {
  if (mapping[name.toLowerCase()]) {
    return mapping[name.toLowerCase()]
  }

  return usercolor(name)
}
