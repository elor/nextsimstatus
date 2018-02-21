<template>
  <div>
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="navtoggle" v-if="!showMenu">
        <md-icon>menu</md-icon>
      </md-button>

      <h2 style="flex: 1" class="md-title">{{strings.routes.simpcs}} @ {{now}}</h2>

      <md-button class="md-icon-button">
        <md-icon>search</md-icon>
      </md-button>
      
    </md-toolbar>

    <md-list class="md-double-line">
      <md-list-item v-for="simpc in simpcs" :key="simpc.name" @click="openSimpc(simpc)">
        <md-avatar md-theme="orange" class="md-avatar-icon md-primary md-large">
          <md-icon>computer</md-icon>
        </md-avatar>

        <div class="md-list-text-container">
          <span>{{simpc.name}}</span>
          <span>({{simpc.ip}})</span>
          <p>{{simpc.date}}</p>
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon>cloud</md-icon>
        </md-button>
        <md-divider></md-divider>
      </md-list-item>
      <md-list-item v-if="simpcs.length === 0">
        <p>{{strings.simpcs.notfound}}</p>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
  import { mapMutations, mapGetters } from "vuex"
  import Navbar from "@/components/Navbar"

  export default {
    components: {
      "mainsimstatus-navbar": Navbar
    },
    data: () => ({
      order: "name"
    }),
    computed: {
      ...mapGetters(["strings", "now"]),
      simpcs() {
        let simpcs = this.$store.state.simpcs
        return Object.keys(simpcs).map(name => ({...simpcs[name], name: name}))
      },
      showMenu() {
        return this.$store.state.showMenu
      }
    },
    methods: {
      ...mapMutations(["navtoggle"]),
      openSimpc(simpc) {
        this.$router.push(`/t/${simpc.id}`)
      }
    }
  }
</script>
