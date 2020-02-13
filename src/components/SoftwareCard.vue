<template>
  <v-card width="250" class="ma-2 pa-2 flexcard" v-if="visible">
    <v-flex>
      <v-card-title class="pb-0">
        <v-img class="align-end" height="100px" :src="sanitized_src" contain>
          <h1 v-if="!hidetitle">{{title}}</h1>
        </v-img>
      </v-card-title>

      <GroupChip :group="usergroup" v-if="usergroup" />

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
import { mapState, mapGetters } from 'vuex'
import GroupChip from '@/components/GroupChip'

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
    'usergroup': {
      type: String,
      default: undefined
    },
    'href': String,
    'text': String
  },
  components: {
    GroupChip
  },
  data () {
    return {}
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['is_admin']),
    sanitized_src () {
      if (this.src && this.src.startsWith('http')) {
        return this.src
      }
      return `img/ext/icons/${this.src || this.title.toLowerCase()}.png`
    },
    sanitized_href () {
      return this.href || `https://mainsim.etit.tu-chemnitz.de/${this.title.toLowerCase()}`
    },
    visible () {
      return this.usergroup === undefined || this.is_admin || this.user.groups.includes(this.usergroup)
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

.float-right {
  float: right;
}
</style>
