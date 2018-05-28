<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-text-field append-icon="edit"
                      label="Input"
                      hide-details
                      v-model="input">
        </v-text-field>
        <p class="text-xs-center mt-2 mb-1">
          <v-icon>arrow_downward</v-icon>
        </p>

        <div class="text-xs-center" v-for="(word, index) in words" :key="index+word.join()">
          <Element v-for="(part, position) in word" :key="position+part" :symbol="part" />
        </div>
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
      input: "One SimCrew Brain is inherently nerdy"
    };
  },
  computed: {
    words() {
      return this.input
        .split(" ")
        .map(word => (word.length > 64 ? word.substring(0, 64) + "…" : word))
        .map(word => possibilities(decomposition(word)).sort(sequenceSortFn)[0])
        .filter(word => word && word.length);
    }
  },
  components: {
    Element
  }
};
</script>
