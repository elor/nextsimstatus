import axios from 'axios'
import LoginStorage from '../utils/LoginStorage'
import { STORAGE_KEY } from '../config'

const config = {
  mainsim: {
    url: 'https://mainsim.etit.tu-chemnitz.de/control'
  }
}

async function control ({ url }, authentication, { action, nodes }) {
  if (!authentication) {
    throw new Error('No login token')
  }

  const postData = { action, nodes, authentication }
  console.log(postData)
  const { status, data } = await axios.post(url, postData)
  if (status !== 200 && status !== 0) {
    throw new Error(data)
  }

  return { status, data }
}

export default function createControlPlugin () {
  const storage = new LoginStorage(STORAGE_KEY)

  return store => {
    store.subscribeAction(action => {
      switch (action.type) {
        case 'mainsimControl':
          control(config.mainsim, storage.read(), action.payload)
            .then(({ status, data }) => store.commit('updateControl', data))
            .catch(errorMessage => store.commit('newError', errorMessage))
          break
      }
    })
  }
}
