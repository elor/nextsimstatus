import axios from './axios'

const config = {
  loginUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/login',
  verifyUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/check',
  renewUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/renew'
}

function login (store) {
  const { username, password } = store.credentials

  axios.post(config.loginUrl, { username, password })
    .then(response => {
      store.setCurrentUser(response.data.decoded)
      store.setAuthToken(response.data.token)
    })
    .catch(error => {
      console.error(error)
      logout()
    })

  store.credentials.password = undefined
}

function logout (store) {
  store.setCurrentUser(undefined)
}

function verify (store) {
  const token = store.token

  axios.post(config.verifyUrl, { token })
    .then(response => {
      store.setCurrentUser(response.data.decoded)
    })
    .catch(error => {
      console.error(error)
    })
}

function renew (store) {
  const token = store.token

  axios.post(config.renewUrl, { token })
    .then(response => {
      store.setCurrentUser(response.data.decoded)
      store.setAuthToken(response.data.token)
    })
    .catch(error => {
      console.error(error)
      logout()
    })
}

export default function createAuthPlugin () {
  return store => {
    store.subscribeAction(action => {
      switch (action.type) {
        case 'login':
          login(store)
          break
        case 'logout':
          logout(store)
          break
        case 'renewToken':
          renew(store)
          break
        case 'verify':
          verify(store)
      }
    })
  }
}
