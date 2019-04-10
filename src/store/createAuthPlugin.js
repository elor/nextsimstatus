import axios from 'axios'
import jwt from 'jsonwebtoken'
import LoginStorage from '../utils/LoginStorage'
import { STORAGE_KEY } from '../config'

const config =
{
  loginUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/login',
  verifyUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/token/check',
  renewUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/token/renew',
  storageKey: 'mainsimweb-auth-token'
}

function login (payload, store, storage) {
  const { username, password } = payload

  axios.post(config.loginUrl, { username, password })
    .then(response => {
      storage.write(response.data.token)
      store.commit('setUser', { user: response.data.decoded, token: response.data.token })
    })
    .catch(error => {
      console.error(error)
      logout(store, storage)
    })
}

function logout (store, storage) {
  store.commit('setUser', {})
  storage.clear()
}

function verify (store, storage) {
  const token = storage.read()

  if (!token) {
    return logout(store, storage)
  }

  axios.post(config.verifyUrl, { token })
    .then(response => {
      store.commit('setUser', { user: response.data.decoded, token })
      if (response.data.shouldRenew) {
        renew(store, storage)
      }
    })
    .catch(error => {
      console.error(error)
      logout(store, storage)
    })
}

function init (store, storage) {
  const token = storage.read()

  if (!token) {
    return logout(store, storage)
  }

  const decoded = jwt.decode(token)
  if (!decoded) {
    return logout(store, storage)
  }

  store.commit('setUser', { user: decoded, token })

  verify(store, storage)
}

function renew (store, storage) {
  const token = storage.read()

  axios.post(config.renewUrl, { token })
    .then(response => {
      storage.write(response.data.token)
      store.commit('setUser', { user: response.data.decoded, token: response.data.token })
    })
    .catch(error => {
      console.error(error)
      logout()
    })
}

export default function createAuthPlugin () {
  const storage = new LoginStorage(STORAGE_KEY)

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
