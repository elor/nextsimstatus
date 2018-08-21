import mqtt from "mqtt";
import zlib from "zlib";

const host = "mainsimweb.etit.tu-chemnitz.de";
const port = 9001;
const url = `mqtt://${host}:${port}`;

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
    let client = mqtt.connect(url);

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
