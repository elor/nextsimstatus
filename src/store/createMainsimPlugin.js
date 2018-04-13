import mqtt from "mqtt";

const host = "mainsimweb.etit.tu-chemnitz.de";
const port = 8080;
const url = `mqtt://${host}:${port}`;

export default function createMainsimPlugin() {
  return store => {
    let client = mqtt.connect(url);

    client.on("connect", () => client.subscribe("#"));

    client.on("message", (topic, message) => {
      switch (topic) {
        case "slurm/nodes":
          store.commit("updateNodes", JSON.parse(message.toString()));
          break;
        case "slurm/jobs":
          store.commit("updateJobs", JSON.parse(message.toString()));
          break;
        case "slurm/users":
          store.commit("updateUsers", JSON.parse(message.toString()));
          break;
      }
    });

    client.on("error", error => store.commit("newError", error));
  };
};
