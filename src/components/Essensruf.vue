<template>
  <v-speed-dial
    v-model="fab"
    bottom
    right
    open-on-hover
    direction="left"
    transition="slide-y-transition"
  >
    <template v-slot:activator>
      <v-btn v-model="fab" :color="logged_in ? 'primary' : 'grey'" dark fab>
        <v-icon>message</v-icon>
      </v-btn>
    </template>
    <v-btn fab dark small :color="logged_in ? 'indigo' : 'grey'" @click="sendMessage('coffee')">
      <v-icon>local_cafe</v-icon>
    </v-btn>
    <v-btn fab dark small :color="logged_in ? 'red' : 'grey'" @click="sendMessage('cake')">
      <v-icon>cake</v-icon>
    </v-btn>
    <v-btn fab dark small :color="logged_in ? 'green' : 'grey'" @click="sendMessage('lunch')">
      <v-icon>restaurant</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

const ESSENSRUF_URL = 'https://mainsimweb.etit.tu-chemnitz.de/essensruf'

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
      let url
      switch (topic) {
        case 'cake':
          alert('Der Kuchenruf ist leider noch nicht verfügbar.\nBitte ruf stattdessen über den Gang.')
          return
        case 'coffee':
          alert('Der Kaffeeruf ist leider noch nicht verfügbar.\nBitte gib Erik unverzüglich Bescheid.')
          return
        case 'lunch':
          url = ESSENSRUF_URL
          break
        default:
          alert(`unknown message topic: ${topic}. Please contact Erik.`)
          return
      }

      if (!this.logged_in) {
        alert('Du musst dich anmelden, um eine Nachricht zu schicken.')
        return
      }

      console.log(`sending message. Topic: ${topic}`)

      axios.post(url, '', { headers: { Authorization: this.jwtToken } })
        .then(result => alert(result.data))
        .catch(error => alert(error))
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
