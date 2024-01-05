export default function createNowTimePlugin(intervalMilliSeconds) {
  return store => {
    window.setInterval(() => store.commit('updateNowDate', new Date()), intervalMilliSeconds)
  }
}
