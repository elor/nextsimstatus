<template>
  <v-dialog v-model="dialog" scrollable>
    <template v-slot:activator="{on}">
      <v-btn v-on="on" text color="primary" outlined>
        <slot name="button-content">
          <v-icon small class="mr-1">fa-code</v-icon>View Source
        </slot>
      </v-btn>
    </template>

    <v-card @keyup.esc="close">
      <v-toolbar dark color="primary">
        <v-toolbar-title>{{title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click.native="close" dark>
          <v-icon>fa-times</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-textarea auto-grow autofocus solo :value="json_value"></v-textarea>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['title', 'value'],
  data() {
    return {
      dialog: false
    }
  },
  computed: {
    json_value() {
      return JSON.stringify(this.value, undefined, '  ')
    }
  },
  methods: {
    close() {
      this.dialog = false
    }
  }
}
</script>
