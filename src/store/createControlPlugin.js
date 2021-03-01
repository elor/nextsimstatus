import axios from 'axios'

const config = {
  mainsim: {
    nodesURL: 'https://mainsim.etit.tu-chemnitz.de/control/nodes',
    jobsURL: 'https://mainsim.etit.tu-chemnitz.de/control/jobs',
    logsURL: 'https://mainsim.etit.tu-chemnitz.de/control/logs',
    jobscriptURL: 'https://mainsim.etit.tu-chemnitz.de/control/jobscripts'
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
        case 'controlLogs':
          control(config.mainsim.logsURL, state.jwtToken, action.payload)
            .then(({ status, data }) => { store.commit('updateControl', status, data); return data })
            .then(jobLogs => jobLogs.forEach(
              ({ JobId, StdOutFile, StdOut, StdErrFile, StdErr }) => store.commit('updateJobLog', { JobId, StdOutFile, StdOut, StdErrFile, StdErr })))
            .catch(errorMessage => action.payload.jobs.forEach(JobId => {
              store.commit('updateJobLog', { JobId, StdOutFile: '<error>', StdOut: errorMessage, StdErrFile: '<error>', StdErr: errorMessage })
            }))
          break
        case 'controlJobScript':
          control(config.mainsim.jobscriptURL, state.jwtToken, action.payload)
            .then(({ status, data }) => { store.commit('updateControl', status, data); return data })
            .then(jobScript => jobScript.forEach(
              ({ JobId, JobScript }) => store.commit('updateJobScript', { JobId, JobScript })))
            .catch(errorMessage => action.payload.jobs.forEach(JobId => {
              store.commit('updateJobScript', { JobId, JobScript: errorMessage })
            }))
          break
      }
    })
  }
}
