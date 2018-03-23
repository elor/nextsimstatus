import axios from "axios";

const server = "enssim.etit.tu-chemnitz.de";

export default function createEnssimPlugin(url) {
  return store => {
    window.setInterval(() => {
      axios.get(`http://${server}/cgi-bin/status.sh?json`, { responseType: "json" })
        .then(response => store.commit("updateJSONData", "message"))
        .catch(error => store.commit("serverError", error));
    }, 500);
  };
};
