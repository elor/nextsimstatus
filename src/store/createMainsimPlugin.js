import mqtt from 'mqtt'
import zlib from 'zlib'
import graphqlquery from './graphqlquery'
import { request } from 'graphql-request'

let mqttClient

const config = {
  graphql: {
    enabled: undefined,
    interval: undefined,
    endpoint: 'https://mainsimweb.etit.tu-chemnitz.de/graphql',
    query: graphqlquery
  },
  mqtt: {
    enabled: undefined,
    endpoint: 'wss://mainsimweb.etit.tu-chemnitz.de/mqtt'
  }
}

function unpack64 (message) {
  const binary = Buffer.from(message.toString(), 'base64')
  const json = zlib.gunzipSync(binary).toString()
  return JSON.parse(json)
}

function unpack (message) {
  const json = zlib.gunzipSync(message).toString()
  return JSON.parse(json)
}

function clickDelay () {
  return new Promise(resolve => setTimeout(resolve, 500))
}

function fetch (store) {
  store.commit('startUpdating')

  let fetchPromise = request(config.graphql.endpoint, config.graphql.query)
    .then(data => {
      store.commit('updateNodes', data.nodes)
      store.commit('updateJobs', data.jobs)
      data.simpcs.forEach(simpc => store.commit('updateSimPC', simpc))
      store.commit('updateRacks', data.racks)
    })
    .catch(error => store.commit('newError', error))

  Promise.all([fetchPromise, clickDelay()]).then(
    () => store.commit('stopUpdating'),
    () => store.commit('stopUpdating')
  )
}

function registerGraphQL (store) {
  if (config.graphql.enabled) {
    // GraphQL Section
    fetch(store)
    if (config.graphql.interval > 0) {
      window.setInterval(() => fetch(store), config.graphql.interval)
    }
  }
}

function unregisterMQTT (store) {
  if (mqttClient) {
    mqttClient.end()
    mqttClient = undefined
  }
}

function registerMQTT (store) {
  unregisterMQTT(store)
  mqttClient = mqtt.connect(config.mqtt.endpoint)

  mqttClient.on('connect', () => {
    console.log('mqtt connected')
    if (config.mqtt.enabled) {
      mqttClient.subscribe('slurm/nodes')
      mqttClient.subscribe('slurm/jobs')
      mqttClient.subscribe('simpc/#')
      mqttClient.subscribe('racks/racks')
      mqttClient.subscribe('beegfs/quota')
    }
  })

  mqttClient.on('end', () => {
    console.log('mqtt disconnected')
  })

  mqttClient.on('message', (topic, message) => {
    try {
      switch (topic) {
        case 'slurm/nodes':
          store.commit('updateNodes', unpack64(message))
          break
        case 'slurm/jobs':
          store.commit('updateJobs', unpack64(message))
          break
        case (topic.match(/simpc\/simpc\d+/) || {}).input:
          store.commit('updateSimPC', unpack(message))
          break
        case 'racks/racks':
          store.commit('updateRacks', unpack64(message))
          break
        case 'beegfs/quota':
          store.commit('updateQuota', unpack64(message))
      }
    } catch (error) {
      store.commit('newError', error)
    }
  })

  mqttClient.on('error', error => store.commit('newError', error))
}

export default function createMainsimPlugin (sources) {
  config.mqtt.enabled = sources.mqtt
  config.graphql.enabled = sources.graphql
  config.graphql.interval = sources.graphql_interval

  return store => {
    registerGraphQL(store)
    registerMQTT(store)

    setInterval(() => {
      if (mqttClient && config.mqtt.enabled && !mqttClient.connected) {
        console.log('mqtt has disconnected. Trying to reconnect')
        registerMQTT(store)
      }
    }, 10000)

    store.subscribeAction(action => {
      switch (action.type) {
        case 'mainsimFetch':
          fetch(store)
          break
        case 'mqttReconnect':
          registerMQTT(store)
          break
      }
    })
  }
}
