<template>
  <v-snackbar color="error" v-if="error" v-model="active" top :timeout="6000">
    {{error.message}}
    <v-btn color="primary" text @click="active=false">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    error: Object
  },
  data () {
    return {
      active: false
    }
  },
  computed: {
    ...mapState(['errors'])
  },
  mounted () {
    this.active = true
  }
}
</script>
