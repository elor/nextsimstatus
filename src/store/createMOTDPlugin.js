import axios from 'axios'

const URL = 'https://nextsimstatus.etit.tu-chemnitz.de/motd'

export default function createMOTDPlugin() {
  return store => {
    function updateMOTD(store) {
      axios.get(URL)
        .then(response => { store.commit('updateMOTD', response.data) })
        .catch(_ => { store.commit('updateMOTD', 'Error fetching MOTD') })
    }

    updateMOTD(store)

    const oneMinute = 1000 * 60

    window.setInterval(() => {
      updateMOTD(store)
    }, oneMinute) // update every minute

    store.subscribeAction(action => {
      switch (action.type) {
        case 'updateMOTD':
          updateMOTD(store)
          break
      }
    })
  }
}
