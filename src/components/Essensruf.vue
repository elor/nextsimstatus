<template>
  <v-speed-dial v-model="fab" bottom right direction="left" transition="slide-x-reverse-transition">
    <template v-slot:activator>
      <v-btn v-model="fab" :color="logged_in ? 'primary' : 'grey'" dark fab>
        <v-icon>fa-bell</v-icon>
      </v-btn>
    </template>
    <v-btn fab dark small :color="logged_in ? 'indigo' : 'grey'" @click="sendMessage('coffee')">
      <v-icon>fa-coffee</v-icon>
    </v-btn>
    <v-btn fab dark small :color="logged_in ? 'indigo' : 'grey'" @click="sendMessage('icecream')">
      <v-icon>fa-ice-cream</v-icon>
    </v-btn>
    <v-btn fab dark small :color="logged_in ? 'red' : 'grey'" @click="sendMessage('cake')">
      <v-icon>fa-birthday-cake</v-icon>
    </v-btn>
    <v-btn fab dark small :color="logged_in ? 'green' : 'grey'" @click="sendMessage('lunch')">
      <v-icon>fa-utensils</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

const ESSENSRUF_URL = 'https://mainsimweb.etit.tu-chemnitz.de/essensruf'
const BROADCAST_URL = 'https://mainsimweb.etit.tu-chemnitz.de/broadcast'

const MESSAGES = {
  icecream: 'Es gibt Eis!',
  coffee: 'Kaffee ist fertig!',
  cake: 'Es gibt Lecker Kuchen!',
  test: 'Testnachricht, bitte ignorieren.'
}

export default {
  data: () => ({
    fab: false
  }),
  computed: {
    ...mapState(['user', 'jwtToken']),
    logged_in () {
      return this.user.name && this.jwtToken
    }
  },
  methods: {
    sendMessage (topic) {
      if (!this.logged_in) {
        alert('Du musst dich anmelden, um eine Nachricht zu schicken.')
        return
      }

      let url
      let message = ''
      switch (topic) {
        case 'cake':
        case 'coffee':
        case 'icecream':
        case 'test':
          url = BROADCAST_URL
          message = MESSAGES[topic]
          break
        case 'lunch':
          url = ESSENSRUF_URL
          break
        default:
          alert(`unknown message topic: ${topic}. Please contact Erik.`)
          return
      }

      console.group()
      console.log(`sending message. Topic: ${topic}`)
      console.log('Message:')
      console.log(message)
      console.groupEnd()

      if (confirm('Nachricht wirklich schicken?')) {
        axios.post(url, '', { headers: { Authorization: this.jwtToken, message } })
          .then(result => alert(result.data))
          .catch(error => alert(error))
      }
    }
  }
}
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
.v-speed-dial {
  position: absolute;
  margin: 0;
}

.v-btn--floating {
  position: relative;
}
</style>
