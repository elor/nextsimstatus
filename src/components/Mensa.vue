<template>
  <v-container>
    <v-layout>
      <flex sm6 xs12>
        <v-card class="mx-3">
          <v-card-text>
              <div v-html="mensa">Loading page...</div>
          </v-card-text>
        </v-card>
      </flex>
      <v-card sm6 xs12>
        <v-card-text class="mx-3">
            <div v-html="cafeteria">Loading page...</div>
        </v-card-text>
      </v-card>
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
  computed: {
    mensa_html(){

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
