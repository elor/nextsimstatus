<template>
  <v-container>
    <v-layout row wrap v-if="mensa || cafeteria">
      <v-flex md6 xs12 v-for="[type, menu] in Object.entries({mensa, cafeteria})" :key="type">
        <v-card class="ma-2">
          <v-card-title class="headline">{{capitalize(type)}} ({{formatMenuDate(menu.datum)}})</v-card-title>
          <v-card-text>
            <v-card v-for="essen in menu.essen" :key="essen.id">
              <v-layout>
                <v-flex xs4>
                  <v-img :src="essen.img_big" height="150px" contain></v-img>
                </v-flex>
                <v-flex xs8>
                  <v-card-title primary-title>
                    <div>
                      <div class="headline">{{essen.kategorie}}</div>
                      <div>{{essen.deutsch}}</div>
                      <div v-if="essen.pr">
                        Preis:
                        <span v-for="preis in preise(essen.pr)" :key="preis">{{preis}}€</span>
                      </div>
                    </div>
                  </v-card-title>
                </v-flex>
              </v-layout>
            </v-card>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

const URL = "https://mainsimweb.etit.tu-chemnitz.de/mensa";

const TESTDATA = {
  mensa: {
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:noNamespaceSchemaLocation": "speiseplan.xsd",
    datum: {
      tag: "1",
      monat: "4",
      jahr: "2019"
    },
    essen: [
      {
        id: "7279",
        kategorie: "Campusteller",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/7279.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/7279.png",
        schwein: "false",
        rind: "false",
        vegetarisch: "true",
        alkohol: "false",
        deutsch:
          "Blumenkohl-Käse-Medaillon (15,19,21,81) oder Putenschnitzel mit Zitronenecke (54,81), Sättigungs- und Gemüsebeilagen nach Angebot und Wahl"
      },
      {
        id: "7282",
        kategorie: "Heiße Theke - Pastatheke",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/7282.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/7282.png",
        schwein: "true",
        rind: "true",
        vegetarisch: "false",
        alkohol: "false",
        deutsch:
          "Nudelvariation (81), zur Auswahl: vegan: Tomaten-Kräuter-Soße (81), Schinken-Erbsen-Soße (2,19,51,81), geriebener Gouda (1,19) oder Cheddar (19)",
        pr: [
          {
            gruppe: "S",
            $t: "1.90"
          },
          {
            gruppe: "M",
            $t: "3.80"
          },
          {
            gruppe: "G",
            $t: "4.65"
          }
        ]
      },
      {
        id: "7284",
        kategorie: "Heiße Theke - Suppe",
        bewertung: "0",
        img: "false",
        schwein: "false",
        rind: "false",
        vegetarisch: "true",
        alkohol: "false",
        deutsch: "Maiscremesuppe (19)",
        pr: [
          {
            gruppe: "S",
            $t: "1.40"
          },
          {
            gruppe: "M",
            $t: "2.95"
          },
          {
            gruppe: "G",
            $t: "3.90"
          }
        ]
      },
      {
        id: "7278",
        kategorie: "Schneller Teller",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/7278.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/7278.png",
        schwein: "false",
        rind: "false",
        vegetarisch: "false",
        alkohol: "false",
        deutsch:
          "Putenschnitzel mit Zitronenecke (54,81), Kräutermayo-Dip (9,15,19), Buttermöhren (19), Pommes frites",
        pr: [
          {
            gruppe: "S",
            $t: "2.20"
          },
          {
            gruppe: "M",
            $t: "4.05"
          },
          {
            gruppe: "G",
            $t: "5.05"
          }
        ]
      },
      {
        id: "7280",
        kategorie: "Wok",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/7280.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/7280.png",
        schwein: "false",
        rind: "false",
        vegetarisch: "false",
        alkohol: "true",
        deutsch:
          "Yakisoba mit Hähnchen, Spitzkohl, Sojasprossen, Karotten und Porree (1,2,4,18,26,44,49,54,81)",
        pr: [
          {
            gruppe: "S",
            $t: "1.50"
          },
          {
            gruppe: "M",
            $t: "1.50"
          },
          {
            gruppe: "G",
            $t: "1.50"
          }
        ]
      },
      {
        id: "7281",
        kategorie: "Wok",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/7281.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/7281.png",
        schwein: "false",
        rind: "false",
        vegetarisch: "false",
        alkohol: "false",
        deutsch: "Vegan: Vegi Green Curry mit Jasminreis (18)",
        pr: [
          {
            gruppe: "S",
            $t: "1.50"
          },
          {
            gruppe: "M",
            $t: "1.50"
          },
          {
            gruppe: "G",
            $t: "1.50"
          }
        ]
      }
    ]
  },
  cafeteria: {
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:noNamespaceSchemaLocation": "speiseplan.xsd",
    datum: {
      tag: "1",
      monat: "4",
      jahr: "2019"
    },
    essen: [
      {
        id: "5813",
        kategorie: "Mittagsangebot",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/5813.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/5813.png",
        schwein: "false",
        rind: "false",
        vegetarisch: "true",
        alkohol: "true",
        deutsch:
          "Wildlachs mit Spinat und Käse gratiniert an Weißwein-Dill-Soße (1, 16, 19, 24, 44, 81)",
        pr: {
          gruppe: "Preis",
          $t: "4.60"
        }
      },
      {
        id: "2362",
        kategorie: "Mittagsangebot",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/2362.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/2362.png",
        schwein: "false",
        rind: "false",
        vegetarisch: "false",
        alkohol: "false",
        deutsch:
          "Kaiserschmarrn hausgemacht aus der Gußpfanne mit Puderzucker und Apfelmusdip (3, 15, 19, 81)",
        pr: {
          gruppe: "Preis",
          $t: "4.20"
        }
      },
      {
        id: "4140",
        kategorie: "Mittagsangebot",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/4140.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/4140.png",
        schwein: "true",
        rind: "false",
        vegetarisch: "false",
        alkohol: "false",
        deutsch:
          'Schweinesteak "Balkan Art" mit Paprika, Zwiebeln und Wurststreifen dazu Tomatenjus (2, 3, 8, 21, 22, 51, 81)',
        pr: {
          gruppe: "Preis",
          $t: "4.20"
        }
      },
      {
        id: "7102",
        kategorie: "Tagessuppe",
        bewertung: "0",
        img: "true",
        img_small: "https://www.swcz.de/bilderspeiseplan/bilder_190/7102.png",
        img_big: "https://www.swcz.de/bilderspeiseplan/bilder_350/7102.png",
        schwein: "true",
        rind: "true",
        vegetarisch: "false",
        alkohol: "false",
        deutsch: "Hackfleisch-Tomatensuppe (18, 19, 51, 52, 81)",
        pr: {
          gruppe: "Preis",
          $t: "1.50"
        }
      },
      {
        id: "7318",
        kategorie: "x Abendessen x",
        bewertung: "0",
        img: "false",
        schwein: "false",
        rind: "false",
        vegetarisch: "false",
        alkohol: "false",
        deutsch:
          "Putenschnitzel mit Zitronenecke (54,81), Kräutermayo-Dip (9,15,19) dazu Beilagenwahl",
        pr: [
          {
            gruppe: "S",
            $t: "2.40"
          },
          {
            gruppe: "M",
            $t: "4.30"
          },
          {
            gruppe: "G",
            $t: "5.35"
          }
        ]
      }
    ]
  }
};

export default {
  data() {
    return {
      mensa: undefined,
      cafeteria: undefined
    };
  },
  methods: {
    parseMenu(json) {
      return JSON.parse(json).rss.channel.item["content:encoded"];
    },
    capitalize(text) {
      return `${text.charAt(0).toUpperCase()}${text.substr(1).toLowerCase()}`;
    },
    formatMenuDate(datum) {
      return `${datum.tag}.${datum.monat}.${datum.jahr}`;
    },
    preise(pr) {
      if (!pr) {
        return [];
      }
      if (pr.$t) {
        return [pr.$t];
      }
      return pr.map(preis => preis.$t);
    },
    fetch() {
      axios
        .get(URL)
        .then(response => {
          this.mensa = this.parseMenu(response.data.mensa);
          this.cafeteria = this.parseMenu(response.data.cafeteria);
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.fetch();
  }
};
</script>