<template>
  <v-list>
    <template v-for="error in errors">
      <v-list-item :key="error.message || ''">
        <v-list-item-content>
          <v-list-item-title v-text="error.message"></v-list-item-title>
          <v-list-item-sub-title v-text="error.date.toLocaleString()"></v-list-item-sub-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider :key="`${error.message || ''}-divider`"></v-divider>
    </template>
    <v-list-item>
      <v-list-item-sub-title class="text-xs-center">
        {{errors.length}} errors captured
      </v-list-item-sub-title>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['errors'])
  }
}
</script>
