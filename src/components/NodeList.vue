<template>
  <v-dialog v-model="dialog" max-width="500">
    <template v-slot:activator="{on}">
      <v-btn v-on="on" text color="primary" outlined>
        NodeLS
        &nbsp;
        <v-icon small>fa-tag</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click.native="dialog = false" dark>
          <v-icon>fa-times</v-icon>
        </v-btn>
        <v-toolbar-title>NodeLS Syntax Validator</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-text-field
          append-icon="fa-tag"
          label="NodeList definition"
          hide-details
          :error="!(nodenames && nodenames.length)"
          v-model="query"
        ></v-text-field>
        <p class="text-xs-center mt-2 mb-1">
          <v-icon>fa-arrow-down</v-icon>
        </p>
        <v-text-field label="Node Names" readonly :value="nodenames.join(',')"></v-text-field>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { nodels } from '../utils/nodels'

export default {
  data () {
    return {
      dialog: false,
      query: 'sim[02,04-05,22,28]'
    }
  },
  computed: {
    nodenames () {
      return nodels(this.query)
    }
  }
}
</script>
