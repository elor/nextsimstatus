<template>
  <v-container>
    <v-layout row wrap v-if="mensa || cafeteria">
      <v-flex md6 xs12 v-for="[type, menu] in Object.entries({mensa, cafeteria})" :key="type">
        <v-card class="ma-2">
          <v-card-title class="headline">{{capitalize(type)}} ({{formatMenuDate(menu.datum)}})</v-card-title>
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
                  <div>{{stripAllergens(essen.deutsch)}}</div>
                  <div v-if="essen.pr">
                    Preis:
                    <span v-for="[id, preis] in Object.entries(preise(essen.pr))" :key="id">
                      {{preis}}€
                      &nbsp;
                    </span>
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
import axios from "axios";

const URL = "https://mainsimweb.etit.tu-chemnitz.de/mensa";

export default {
  data() {
    return {
      mensa: undefined,
      cafeteria: undefined
    };
  },
  methods: {
    capitalize(text) {
      return `${text.charAt(0).toUpperCase()}${text.substr(1).toLowerCase()}`;
    },
    formatMenuDate(datum) {
      return `${datum.tag}.${datum.monat}.${datum.jahr}`;
    },
    stripAllergens(essen) {
      return essen
        .replace(/\(\d+(\s*,\s*\d*)*\)?/g, "")
        .replace(/\s*,\s*/g, ", ")
        .replace(/\s+/g, " ");
    },
    preise(pr) {
      if (!pr) {
        return [];
      }
      if (pr.$t) {
        return [pr.$t];
      }
      return pr.map(preis => preis.$t);
    },
    fetch() {
      axios
        .get(URL)
        .then(response => {
          this.mensa = response.data.mensa;
          this.cafeteria = response.data.cafeteria;
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.fetch();
  }
};
</script>