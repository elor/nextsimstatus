<template>
  <v-container fluid>
    <v-card>
      <v-card-title xs4>
        <v-text-field append-icon="label_outline"
                      label="NodeList definition"
                      hide-details
                      :error="!(nodenames && nodenames.length)"
                      v-model="query">
        </v-text-field>
      </v-card-title>
      <p class="text-xs-center">
        {{nodenames.join(",")}}
      </p>
    </v-card>
  </v-container>
</template>

<script>
  import { nodels } from "../utils/nodels";

  export default {
    data() {
      return {
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
