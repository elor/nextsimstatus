<template>
  <v-container fluid>
    <v-text-field append-icon="fa-search" label="Search" single-line hide-details v-model="search"></v-text-field>
    <v-expansion-panels multiple inset v-model="panels">
      <v-expansion-panel v-for="item in parsed_items" :key="item.title">
        <v-expansion-panel-header>{{item.title}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-html="item.html"/>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { Parser, HtmlRenderer } from 'commonmark'
import manual from '@/manual'

export default {
  data() {
    return {
      items: manual,
      search: '',
      panels: [0]
    }
  },
  computed: {
    parsed_items() {
      return this.filtered_items.map(item => ({
        ...item,
        html: item.html || this.parse(item.markdown)
      }))
    },
    panel() {
      return this.items.map(item => !!item.active)
    },
    filtered_items() {
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
    parse(markdown) {
      const reader = new Parser()
      const writer = new HtmlRenderer()
      return writer.render(reader.parse(markdown))
    }
  }
}
</script>
