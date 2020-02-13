<template>
  <v-card width="250" class="ma-2 pa-2 flexcard">
    <v-flex>
      <v-card-title class="pb-0">
        <v-img class="align-end" height="100px" :src="sanitized_src" contain>
          <h1 v-if="!hidetitle">{{title}}</h1>
        </v-img>
      </v-card-title>

      <v-card-text class="text--primary">
        <div>
          <slot></slot>
        </div>
      </v-card-text>
    </v-flex>

    <v-card-actions>
      <v-btn text :href="sanitized_href">Öffne {{title}}</v-btn>
      <v-btn fab flat small :href="sanitized_href" target="_blank">
        <v-icon small>fa-external-link-alt</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    'title': {
      type: String,
      default: ''
    },
    'src': {
      type: String,
      default: undefined
    },
    'hidetitle': {
      type: Boolean,
      default: false
    },
    'href': String,
    'text': String
  },
  data () {
    return {}
  },
  computed: {
    sanitized_src () {
      if (this.src && this.src.startsWith('http')) {
        return this.src
      }
      return `img/ext/icons/${this.src || this.title.toLowerCase()}.png`
    },
    sanitized_href () {
      return this.href || `https://mainsim.etit.tu-chemnitz.de/${this.title.toLowerCase()}`
    }
  }
}
</script>

<style scoped>
h1 {
  background-color: #ffffffa0;
}

.flexcard {
  display: flex;
  flex-direction: column;
}
</style>
