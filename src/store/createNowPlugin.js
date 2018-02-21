import mqtt from "mqtt";

export default function createMQTTPlugin(interval_s) {
    return store => {
        window.setInterval(() => store.commit("setNow", new Date()), 1000 * interval_s)
    }
}
