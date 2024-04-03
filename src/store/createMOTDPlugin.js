import axios from 'axios'

const URL = 'https://mainsim.etit.tu-chemnitz.de/motd'

export default function createMOTDPlugin() {
  return store => {
    function updateMOTD(store) {
      axios.get(URL)
        .then(response => { store.commit('updateMOTD', response.data) })
        .catch(_ => { store.commit('updateMOTD', 'Error fetching MOTD') })
    }

    updateMOTD(store)

    window.setInterval(() => {
      updateMOTD(store)
    }, 1000 * 60) // update every minute
  }
}
