const express = require("express");
const axios = require("axios");
const graphqlHTTP = require("express-graphql");
const serverSchema = require("./graphqlschema");

var store = {
  nodes: [],
  jobs: [],
  users: [],
  simpcs: [],
  lastupdate: new Date(0)
};

function updateStore(newStore) {
  store = newStore;
}

function queryStoreUpdate() {
  axios.get("http://mainsimweb.etit.tu-chemnitz.de:1880/all")
    .then(response => updateStore(response.data))
    .catch(error => console.error(error));
}

queryStoreUpdate();
setInterval(queryStoreUpdate, 1000);

let getDataCallback = () => store;

let root = {
  lastupdate: () => getDataCallback().lastupdate,
  nodes: () => getDataCallback().nodes,
  jobs: () => getDataCallback().jobs,
  users: () => Object.values(getDataCallback().users),
  simpcs: () => Object.values(getDataCallback().simpcs)
};

let app = express();
app.use("/graphql", graphqlHTTP({
  schema: serverSchema,
  rootValue: root,
  graphiql: true
}));

app.listen(8080, () => console.log("Listening on :8080/graphql"));
