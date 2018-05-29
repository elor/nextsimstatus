<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-text-field append-icon="edit"
                      label="Input"
                      hide-details
                      multi-line
                      v-model="input">
        </v-text-field>
        <p class="text-xs-center mt-2 mb-1">
          <v-icon>arrow_downward</v-icon>
        </p>

        <p class="text-xs-center mt-4">
          <span class="mr-4 mb-3 word" v-for="(word, index) in words" :key="index+word.join()">
            <Element v-for="(part, position) in word" :key="position+part" v-if="part !== '\n'" :symbol="part" :color="colors[index][position]" />
            <br v-else>
          </span>
        </p>
      </v-card-text>


    </v-card>
  </v-container>
</template>

<script>
import { elements } from "../utils/elements";
import { flatten, range, uniq } from "lodash";
import Element from "./PeriodinatorElement";

function capitalize(string) {
  return string[0].toUpperCase() + string.substring(1).toLowerCase();
}

function decomposition(word) {
  return range(word.length)
    .map(i => word.substring(i, i + 2))
    .map(s => {
      return [s, s.substring(0, 1)]
        .filter(s => s.length)
        .map(s => capitalize(s))
        .filter(s => elements[s]);
    })
    .map(a => uniq(a))
    .map((a, i) => (a.length ? a : [word[i].toLowerCase()]));
}

function possibilities(graph) {
  if (graph.length === 0) {
    return [];
  }
  if (graph.length === 1) {
    return graph;
  }
  if (graph.length === 2 && graph[0][0].length === 2) {
    return [[graph[0][0]]];
  }

  return flatten(
    graph[0].map(s => {
      const remainder = graph.slice(s.length);

      return possibilities(remainder).map(p => [s].concat(p));
    })
  );
}

function numMismatches(sequence) {
  return sequence.filter(part => part.toLowerCase() === part).length;
}

function sequenceSortFn(a, b) {
  return numMismatches(a) - numMismatches(b) || a.length - b.length;
}

export default {
  data() {
    return {
      input: "und so schreiten wir ohne pause sicheren fusses gen promotion"
    };
  },
  computed: {
    words() {
      return this.input
        .split(" ")
        .map(word => (word.length > 64 ? word.substring(0, 64) + "…" : word))
        .map(word => possibilities(decomposition(word)).sort(sequenceSortFn)[0])
        .filter(word => word && word.length);
    },
    colors() {
      const lengths = this.words.map(word => word.length);
      const offsets = lengths.map((_, index) =>
        lengths.slice(0, index).reduce((a, b) => a + b, 0)
      );

      return this.words.map((word, index) =>
        word.map(
          (part, position) =>
            part === part.toLowerCase()
              ? "error"
              : (offsets[index] + position) % 8
        )
      );
    }
  },
  components: {
    Element
  }
};
</script>

<style>
.word {
  display: inline-block;
  white-space: nowrap;
}
</style>
