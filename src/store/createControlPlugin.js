import axios from 'axios'

const config = {
  mainsim: {
    nodesURL: 'https://mainsim.etit.tu-chemnitz.de/control/nodes',
    jobsURL: 'https://mainsim.etit.tu-chemnitz.de/control/jobs'
  }
}

async function control (url, authentication, payload) {
  if (!authentication) {
    throw new Error('No login token')
  }

  const postData = { ...payload, authentication }

  const { status, data } = await axios.post(url, postData)
  if (status !== 200 && status !== 0) {
    throw new Error(data)
  }

  return { status, data }
}

export default function createControlPlugin () {
  return store => {
    store.subscribeAction((action, state) => {
      switch (action.type) {
        case 'controlNodes':
          control(config.mainsim.nodesURL, state.jwtToken, action.payload)
            .then(({ status, data }) => store.commit('updateControl', data))
            .catch(errorMessage => store.commit('newError', errorMessage))
          break
        case 'controlJobs':
          control(config.mainsim.jobsURL, state.jwtToken, action.payload)
            .then(({ status, data }) => store.commit('updateControl', status, data))
            .catch(errorMessage => store.commit('newError', errorMessage))
          break
      }
    })
  }
}
