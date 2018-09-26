import mqtt from "mqtt";
import zlib from "zlib";
import axios from "axios";

const host = "mainsimweb.etit.tu-chemnitz.de";
const MQTTport = 9001;
const HTTPport = 1880;
const MQTTurl = `mqtt://${host}:${MQTTport}`;
const HTTPurl = `http://${host}:${HTTPport}/all`;

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
    // HTTP Section
    axios.get(HTTPurl).then(function(response) {
      const data = response.data;
      console.log(data);
      store.commit("updateNodes", data.nodes);
      store.commit("updateJobs", data.jobs);
      Object.values(data.simpcs).forEach(simpc => store.commit("updateSimPC", simpc));
    }).catch(function(error) {
      console.error(error);
      store.commit("newError", error);
    });

    // MQTT Section
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
  };
}
