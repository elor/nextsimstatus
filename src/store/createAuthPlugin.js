import axios from 'axios'
import jwt from 'jsonwebtoken'

const config =
{
  loginUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/login',
  verifyUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/token/check',
  renewUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/token/renew',
  storageKey: 'mainsimweb-login-token',
  supportKey: 'mainsimweb-storage-supported'
}

function storageSupport () {
  if (!window.localStorage) {
    return false
  }

  try {
    window.localStorage.setItem(config.supportKey, config.supportKey)
    window.localStorage.removeItem(config.storageKey)
  } catch (e) {
    console.error('No localStorage support. Details:')
    console.error(e)
    return false
  }

  return true
}

class LoginStorage {
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

function login (payload, store, storage) {
  const { username, password } = payload

  axios.post(config.loginUrl, { username, password })
    .then(response => {
      storage.write(response.data.token)
      store.commit('setUser', response.data.decoded)
    })
    .catch(error => {
      console.error(error)
      logout(store, storage)
    })
}

function logout (store, storage) {
  store.commit('setUser', undefined)
  storage.clear()
}

function verify (store, storage) {
  const token = storage.read()

  axios.post(config.verifyUrl, { token })
    .then(response => {
      storage.write(response.data.token)
      store.commit('setUser', response.data.decoded)
    })
    .catch(error => {
      console.error(error)
      logout(store, storage)
    })
}

function init (store, storage) {
  const token = storage.read()
  if (!token) {
    logout(store, storage)
  }

  const decoded = jwt.decode(token)
  if (!decoded) {
    logout(store, storage)
  }

  store.commit('setUser', decoded)

  verify(store, storage)
}

function renew (store, storage) {
  const token = storage.read()

  axios.post(config.renewUrl, { token })
    .then(response => {
      storage.write(response.data.token)
      store.commit('setUser', response.data.decoded)
    })
    .catch(error => {
      console.error(error)
      logout()
    })
}

export default function createAuthPlugin () {
  const storage = new LoginStorage(config.storageKey)

  return store => {
    init(store, storage)

    store.subscribeAction(action => {
      switch (action.type) {
        case 'login':
          login(action.payload, store, storage)
          break
        case 'logout':
          logout(store, storage)
          break
        case 'renewToken':
          renew(store, storage)
          break
        case 'verifyToken':
          verify(store, storage)
      }
    })
  }
}
