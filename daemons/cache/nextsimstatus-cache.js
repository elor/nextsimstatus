#!/usr/bin/node

const receiver = require('./receiver')
const listener = require('./listener')
const assert = require('assert')
const args = require('minimist')(process.argv.slice(-1))

const PORT = Number(args._[0]) || 8080

let store = {
  nodes: [],
  jobs: [],
  users: {},
  simpcs: {},
  racks: [],
  quotas: {
    user: [],
    group: [],
    project: [],
    df: []
  },
  lastupdate: new Date(0),
  cachestart: new Date()
}

const receiveFuncs = {
  nodes (nodes) {
    store.nodes = nodes
  },
  jobs (jobs) {
    store.jobs = jobs
  },
  users (users) {
    store.users = users
  },
  simpc (simpc) {
    store.simpcs[simpc.hostname] = simpc
  },
  racks (racks) {
    store.racks = racks
  },
  quotas (quotas) {
    store.quotas = quotas
  },
  users (users) {
    store.users = users
  },
  newError(error) {
    console.log(error)
  }
}

function updateCallback (topic, message) {
  console.log(`received ${topic}`)
  store.lastupdate = new Date()
  receiveFuncs[topic](message)
}

function getDataCallback () {
  return store
}

function print () {
  const now = new Date().toISOString()
  const lastupdate = store.lastupdate.toISOString()
  console.log(`${now}: ${lastupdate}`)
}

let mqttClient = receiver.connect(updateCallback)
assert(mqttClient)
let httpServer = listener.listen(PORT, getDataCallback)
assert(httpServer)

let printerval = setInterval(print, 5000)
assert(printerval)

print()
