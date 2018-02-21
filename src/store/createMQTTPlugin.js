import mqtt from "mqtt";

export default function createMQTTPlugin(url) {
    let client = mqtt.connect(url);
    client.subscribe("test");

    return store => {
        client.on("message", (topic, message) => {
            store.commit("newMessage", JSON.parse(message));
        })
    }
}
