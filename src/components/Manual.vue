<template>
  <v-container fluid>
    <v-expansion-panel v-model="panel"
                       expand
                       inset
                       focusable>

      <v-expansion-panel-content v-for="item in parsed_items" :key="item.title">
        <h3 slot="header">{{item.title}}</h3>
        <v-card>
          <v-card-text v-html="item.html">
          </v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</template>

<script>
import commonmark from "commonmark";
import manual from "@/manual";

export default {
  data() {
    return {
      items: manual
    };
  },
  computed: {
    parsed_items() {
      return this.items.map(item => ({
        ...item,
        html: item.html || this.parse(item.markdown)
      }));
    },
    panel() {
      return this.items.map(item => !!item.active);
    }
  },
  methods: {
    parse(markdown) {
      let reader = new commonmark.Parser();
      let writer = new commonmark.HtmlRenderer();
      return writer.render(reader.parse(markdown));
    }
  }
};
</script>
