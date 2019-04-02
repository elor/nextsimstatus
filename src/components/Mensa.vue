<template>
  <v-container>
    <v-layout row wrap v-if="mensa || cafeteria">
      <v-flex xs12>
        <v-btn color="primary" @click="essensruf" :disabled="!logged_in">Essensruf</v-btn>
        <i v-if="!logged_in">Anmeldung notwendig</i>
      </v-flex>

      <v-flex md6 xs12 v-for="[type, menu] in Object.entries({mensa, cafeteria})" :key="type">
        <v-card class="ma-2">
          <v-card-title class="headline">{{menu.name}} - {{menu.datum_str}}</v-card-title>
        </v-card>
        <v-card v-for="essen in menu.essen" :key="essen.id" class="mx-2">
          <v-layout>
            <v-flex xs4>
              <v-img :src="essen.img_big" height="150px" contain></v-img>
            </v-flex>
            <v-flex xs8>
              <v-card-title primary-title>
                <div>
                  <div class="headline">{{essen.kategorie}}</div>
                  <div>{{essen.deutsch_short}}</div>
                  <div v-if="essen.pr">
                    Preis:
                    <span
                      v-for="[id, preis] in Object.entries(essen.preise)"
                      :key="id"
                      class="mx-2"
                    >{{preis}}</span>
                  </div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

const MENU_URL = 'https://mainsimweb.etit.tu-chemnitz.de/mensa'
const ESSENSRUF_URL = 'https://mainsimweb.etit.tu-chemnitz.de/essensruf'

export default {
  data () {
    return {
      mensa: undefined,
      cafeteria: undefined
    }
  },
  computed: {
    ...mapState(['user', 'jwtToken']),
    logged_in () {
      return this.user.name && this.jwtToken
    }
  },
  methods: {
    fetch () {
      axios.get(MENU_URL)
        .then(response => {
          this.mensa = response.data.mensa
          this.cafeteria = response.data.cafeteria
        })
        .catch(error => {
          console.error(error)
        })
    },
    essensruf () {
      if (this.logged_in) {
        axios.post(ESSENSRUF_URL, '', { headers: { Authorization: this.jwtToken } })
          .then(result => alert(result.data))
          .catch(error => alert(error))
      } else {
        alert('Du musst dich erst anmelden.')
      }
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>
