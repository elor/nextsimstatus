<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-textarea append-icon="fa-pen" label="Input" hide-details v-model="input"></v-textarea>

        <v-layout wrap>
          <v-flex xs="12" md="4">
            <v-checkbox label="nur Vollständige" v-model="filter.complete"></v-checkbox>
          </v-flex>
          <v-flex xs="12" md="4">
            <v-checkbox label="als Text" v-model="filter.rawtext"></v-checkbox>
          </v-flex>
          <v-flex xs="12" md="4">
            <v-btn @click="pickRandom">Zufall</v-btn>
          </v-flex>
        </v-layout>
        <p class="text-xs-center mt-2 mb-1">
          <v-icon>fa-arrow-down</v-icon>
        </p>

        <p class="text-xs-center mt-5">
          <span v-for="(line, lineno) in lines" :key="lineno">
            <span
              class="mr-4 mb-3 word"
              v-for="(word, index) in line.filter(word => !filter.complete || !numMismatches(word))"
              :key="index+word.join()"
            >
              <Element
                v-for="(part, position) in word"
                :key="position+part"
                :symbol="part"
                :color="colors[lineno][index][position]"
                :rawtext="filter.rawtext"
              />
              <span>&nbsp;</span>
            </span>
            <br />
          </span>
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { elements } from '../utils/elements'
import { flatten, range, uniq } from 'lodash'
import Element from './PeriodinatorElement'
import { capitalize } from '../utils/capitalize'
import random from '../utils/random'
import examples from '../assets/periodinator-examples'

function deumlaut(string) {
  return string
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
}

function decomposition(word) {
  word = deumlaut(word.toLowerCase())
  return range(word.length)
    .map(i => word.substring(i, i + 2))
    .map(s => {
      return [s, s.substring(0, 1)]
        .filter(s => s.length)
        .map(s => capitalize(s))
        .filter(s => elements[s])
    })
    .map(a => uniq(a))
    .map((a, i) => (a.length ? a : [word[i]]))
}

function possibilities(graph) {
  if (graph.length === 0) {
    return []
  }
  if (graph.length === 1) {
    return graph
  }
  if (graph.length === 2 && graph[0][0].length === 2) {
    return [[graph[0][0]]]
  }

  return flatten(
    graph[0].map(s => {
      const remainder = graph.slice(s.length)

      return possibilities(remainder).map(p => [s].concat(p))
    })
  )
}

function numMismatches(sequence) {
  return sequence.filter(part => part.toLowerCase() === part).length
}

function sequenceSortFn(a, b) {
  return numMismatches(a) - numMismatches(b) || a.length - b.length
}

export default {
  data() {
    return {
      input: random.pick(examples),
      filter: {
        complete: false,
        rawtext: false
      }
    }
  },
  computed: {
    lines() {
      return this.input.split('\n').map(line => {
        return line
          .split(/\s+/)
          .map(word => (word.length > 64 ? word.substring(0, 64) + '…' : word))
          .map(
            word => possibilities(decomposition(word)).sort(sequenceSortFn)[0]
          )
          .filter(word => word && word.length)
      })
    },
    colors() {
      return this.lines.map(words => {
        const lengths = words.map(word => word.length)
        const offsets = lengths.map((_, index) =>
          lengths.slice(0, index).reduce((a, b) => a + b, 0)
        )

        return words.map((word, index) =>
          word.map(
            (part, position) =>
              part === part.toLowerCase()
                ? 'error'
                : (offsets[index] + position) % 8
          )
        )
      })
    }
  },
  methods: {
    numMismatches,
    pickRandom() {
      this.input = random.pick(
        examples.filter(sentence => sentence !== this.input)
      )
    }
  },
  components: {
    Element
  }
}
</script>

<style>
.word {
  display: inline-block;
  white-space: nowrap;
}
</style>
