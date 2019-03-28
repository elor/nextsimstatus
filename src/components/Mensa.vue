<template>
  <v-container>
    <v-layout row wrap>

      <v-flex lg6 xs12>
        <v-card class="ma-2">
          <v-card-title class="headline">Mensa</v-card-title>
          <v-card-text>
            <div v-html="mensa">Loading page...</div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex lg6 xs12>
        <v-card class="ma-2">
          <v-card-title class="headline">Cafeteria</v-card-title>
          <v-card-text>
            <div v-html="cafeteria">Loading page...</div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios"

const URL = "https://mainsimweb.etit.tu-chemnitz.de/mensa"

export default {
  data() {
    return {
      mensa: undefined,
      cafeteria: undefined
    }
  },
  methods: {
    parseMenu(json){
      return JSON.parse(json).rss.channel.item["content:encoded"]
    },
    fetch(){
      axios.get(URL)
      .then(response => {
        this.mensa = this.parseMenu(response.data.mensa)
        this.cafeteria = this.parseMenu(response.data.cafeteria)
      })
      .catch(error => this.content = `Error fetching the menu: <br> ${error}`)
    }
  },
  mounted () {
    this.fetch()
  }
}
</script>
