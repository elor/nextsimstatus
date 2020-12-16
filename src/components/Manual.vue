<template>
  <v-container fluid>
    <v-text-field append-icon="fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
    <v-expansion-panel v-model="panel" expand inset focusable>
      <v-expansion-panel-content v-for="item in parsed_items" :key="item.title">
        <h3 slot="header">{{item.title}}</h3>
        <v-card>
          <v-card-text v-html="item.html"></v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-container>
</template>

<script>
import commonmark from 'commonmark'
import manual from '@/manual'

export default {
  data () {
    return {
      items: manual,
      search: ''
    }
  },
  computed: {
    parsed_items () {
      return this.filtered_items.map(item => ({
        ...item,
        html: item.html || this.parse(item.markdown)
      }))
    },
    panel () {
      return this.items.map(item => !!item.active)
    },
    filtered_items () {
      if (!this.search) {
        return this.items
      }

      const regex = new RegExp(this.search, 'i')
      return this.items.filter(
        item => regex.test(item.title) || regex.test(item.markdown)
      )
    }
  },
  methods: {
    parse (markdown) {
      const reader = new commonmark.Parser()
      const writer = new commonmark.HtmlRenderer()
      return writer.render(reader.parse(markdown))
    }
  }
}
</script>
