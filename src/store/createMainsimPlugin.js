import mqtt from "mqtt";
import zlib from "zlib";
import graphqlquery from "./graphqlquery";
import {
  request
} from "graphql-request";

const config = {
  graphql: {
    enabled: true,
    endpoint: "http://mainsimweb.etit.tu-chemnitz.de:1880/graphql",
    query: graphqlquery
  },
  mqtt: {
    enabled: true,
    host: "mainsimweb.etit.tu-chemnitz.de",
    port: 9001
  }
};

function unpack64(message) {
  const binary = Buffer.from(message.toString(), "base64");
  const json = zlib.gunzipSync(binary).toString();
  return JSON.parse(json);
}

function unpack(message) {
  const json = zlib.gunzipSync(message).toString();
  return JSON.parse(json);
}

export default function createMainsimPlugin() {
  return store => {
    if (config.graphql.enabled) {
      // GraphQL Section
      request(config.graphql.endpoint, config.graphql.query)
        .then(function(data) {
          console.log(data);
          store.commit("updateNodes", data.nodes);
          store.commit("updateJobs", data.jobs);
          data.simpcs.forEach(simpc => store.commit("updateSimPC", simpc));
        }).catch(function(error) {
          console.error(error);
          store.commit("newError", error);
        });
    }

    if (config.mqtt.enabled) {
      // MQTT Section
      const MQTTurl = `mqtt://${config.mqtt.host}:${config.mqtt.port}`;
      let client = mqtt.connect(MQTTurl);

      client.on("connect", () => client.subscribe("#"));

      client.on("message", (topic, message) => {
        switch (topic) {
          case "slurm/nodes":
            store.commit("updateNodes", unpack64(message));
            break;
          case "slurm/jobs":
            store.commit("updateJobs", unpack64(message));
            break;
          case (topic.match(/simpc\/simpc\d+/) || {}).input:
            store.commit("updateSimPC", unpack(message));
            break;
        }
      });

      client.on("error", error => store.commit("newError", error));
    }
  };
}
