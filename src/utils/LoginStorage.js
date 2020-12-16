function storageSupport () {
  if (!window.localStorage) {
    return false
  }

  try {
    const testKey = 'mainsimweb-storage-supported'
    window.localStorage.setItem(testKey, testKey)
    window.localStorage.removeItem(testKey)
  } catch (e) {
    console.error('No localStorage support. Details:')
    console.error(e)
    return false
  }

  return true
}

export default class LoginStorage {
  constructor (key) {
    this.key = key
    this.supported = storageSupport()
  }

  read () {
    if (this.supported) {
      return window.localStorage.getItem(this.key)
    }
  }

  write (token) {
    if (this.supported) {
      return window.localStorage.setItem(this.key, token)
    }
  }

  clear () {
    if (this.supported) {
      return window.localStorage.removeItem(this.key)
    }
  }
}
