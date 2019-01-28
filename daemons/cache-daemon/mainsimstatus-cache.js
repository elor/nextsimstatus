#!/usr/bin/node

const receiver = require("./receiver");
const listener = require("./listener");

let store = {
  nodes: {},
  jobs: {},
  users: {},
  simpcs: {},
  lastupdate: new Date(0),
  cachestart: new Date()
};

const receiveFuncs = {
  nodes(msg) {
    store.nodes = msg;
  },
  jobs(msg) {
    store.jobs = msg;
  },
  users(msg) {
    store.users = msg;
  },
  simpc(simpc) {
    store.simpcs[simpc.hostname] = simpc;
  }
};

function updateCallback(topic, message) {
  store.lastupdate = new Date();
  receiveFuncs[topic](message);
}

function getDataCallback() {
  return store;
}

function print() {
  const now = new Date().toISOString();
  const lastupdate = store.lastupdate.toISOString();
  console.log(`${now}: ${lastupdate}`);
}

let mqttClient = receiver.connect(updateCallback);
let httpServer = listener.listen(8080, getDataCallback);

let printerval = setInterval(print, 5000);
print();
