<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-btn slot="activator" flat color="primary" outline>
      <v-icon>label_outline</v-icon>NodeLS
    </v-btn>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon @click.native="dialog = false" dark>
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title>NodeLS Syntax Validator</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-text-field append-icon="label_outline"
                      label="NodeList definition"
                      hide-details
                      :error="!(nodenames && nodenames.length)"
                      v-model="query">
        </v-text-field>
        <p class="text-xs-center mt-2 mb-1">
          <v-icon>arrow_downward</v-icon>
        </p>
        <v-text-field label="Node Names"
                      readonly
                      v-model="nodenames.join(',')">

        </v-text-field>
      </v-card-text>

    </v-card>
  </v-dialog>
</template>

<script>
  import { nodels } from "../utils/nodels";

  export default {
    data() {
      return {
        dialog: false,
        query: "sim[02,04-05,22,28]"
      };
    },
    computed: {
      nodenames() {
        return nodels(this.query);
      }
    }
  };
</script>
