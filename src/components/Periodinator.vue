<template>
  <v-container fluid>
    <v-card>
      <v-card-text>
        <v-text-field append-icon="edit"
                      label="Input"
                      hide-details
                      :error="!valid"
                      v-model="input">
        </v-text-field>
        <p class="text-xs-center mt-2 mb-1">
          <v-icon>arrow_downward</v-icon>
        </p>

        <h2 class="text-xs-center mt-2" v-for="word in words">
          <span v-for="part in word" :style="{color: part.valid ? '#11a621' : '#b92109'}">{{ part.text }} </span>
        </h2>
      </v-card-text>

    </v-card>
  </v-container>
</template>

<script>
  const elements = ["Ac", "Ag", "Al", "Am", "Ar", "As", "At", "Au", "Ba", "Be", "Bh", "Bi", "Bk", "Br", "Ca", "Cd", "Ce", "Cf", "Cl", "Cn", "Cm", "Cs", "Co", "Cr", "Cu", "Db", "Ds", "Dy", "Er", "Es", "Eu", "Fe", "Fl", "Fm", "Fr", "Ga", "Gd", "Ge", "He", "Hf", "Hg", "Ho", "Hs", "In", "Ir", "Kr", "La", "Li", "Lr", "Lu", "Lv", "Mc", "Md", "Mg", "Mn", "Mo", "Mt", "Na", "Nb", "Nd", "Ne", "Nh", "Ni", "No", "Np", "Og", "Os", "Pa", "Pb", "Pd", "Pm", "Po", "Pr", "Pt", "Pu", "Ra", "Rb", "Re", "Rf", "Rg", "Rh", "Rn", "Ru", "Sb", "Sc", "Se", "Sg", "Si", "Sm", "Sn", "Sr", "Ta", "Tb", "Tc", "Te", "Th", "Ti", "Tl", "Tm", "Ts", "Xe", "Yb", "Zn", "Zr", "B", "C", "F", "H", "I", "K", "N", "O", "P", "S", "U", "V", "W", "Y"];
  const fullRegex = new RegExp(`^(${elements.join("|")}|\\s)+$`, "i");
  const partRegex = new RegExp(`(${elements.join("|")})+`, "i");

  export default {
    data() {
      return {
        input: "I am Banana Boy",
        elements
      };
    },
    computed: {
      valid() {
        return this.validate(this.input);
      },
      capitalized() {
        return this.capitalize(this.input);
      },
      input_words() {
        return this.input.replace(/\s+/g, " ").split(" ").filter(word => word.length);
      },
      words() {
        return this.input_words.map(word => {
          return [...this.extractParts(word)].map(part => {
            if (part.valid) {
              return this.capitalize(part.text).map(part => ({ text: part, valid: true }));
            } else {
              return [part];
            }
          }).reduce((a, b) => a.concat(b));
        });
      }
    },
    methods: {
      extractParts: function* (string) {
        while (string.length) {
          let match = partRegex.exec(string);

          if (!match) {
            yield { text: string, valid: false };
            break;
          }

          if (match.index > 0) {
            yield { text: string.slice(0, match.index), valid: false };
          }
          yield { text: match[0], valid: true };

          string = string.slice(match.index + match[0].length);
        }
      },
      capitalize(string) {
        if (!string) {
          return [];
        }

        string = string.replace(/^\s+/, "");

        if (this.elements.some(element => string.toLowerCase() === element.toLowerCase())) {
          return [string[0].toUpperCase() + string.slice(1).toLowerCase()];
        }

        let candidates = this.elements.filter(element => string.toLowerCase().startsWith(element.toLowerCase()));
        if (candidates.length === 0) {
          return undefined;
        }

        for (let candidate of candidates) {
          let rest = this.capitalize(string.slice(candidate.length));

          if (rest) {
            return [candidate, ...rest];
          }
        }

        return undefined;
      },
      validate(string) {
        return fullRegex.test(string);
      }
    }
  };
</script>

<style scoped>
</style>
