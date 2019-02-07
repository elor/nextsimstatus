import axios from './axios'

const config = {
  loginUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/login',
  verifyUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/check',
  renewUrl: 'https://mainsimweb.etit.tu-chemnitz.de/auth/renew'
}

function login (store) {

}

function logout (store) {

}

function renew (store) {

}

function verify (store) {

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
