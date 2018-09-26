const receiver = require("./receiver");
const listener = require("./listener");

let store = {
  nodes: {},
  jobs: {},
  users: {},
  simpcs: {},
  lastupdate: ""
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
};

let client = receiver.connect(updateCallback);
let server = listener.listen(8080, getDataCallback);
