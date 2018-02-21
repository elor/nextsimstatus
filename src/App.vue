<template>
  <div id="app">
    <md-app>
      <md-app-drawer :md-active="showMenu" md-persistent="full">
        <mainsimstatus-navbar></mainsimstatus-navbar>
      </md-app-drawer>

      <md-app-content style="padding: 0">
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="scss">
  @import "~vue-material/dist/theme/engine";

  @include md-register-theme("default", (
    primary: md-get-palette-color(amber, 500),
    accent: md-get-palette-color(red, 500),
    warn: md-get-palette-color(red, 500),
    background: md-get-palette-color(white, 500)
  ));

  @include md-register-theme("orange", (
    primary: md-get-palette-color(grey, 200),
    accent: md-get-palette-color(red, 500),
    warn: md-get-palette-color(red, 500),
    background: md-get-palette-color(orange, 500)
  ));

  @import "~vue-material/dist/theme/all";

  .md-app {
    min-height: 350px;
    border: 1px solid rgba(#000, .12);
  }
</style>

<script>
  import { mapMutations } from "vuex"
  import Navbar from "@/components/Navbar"

  export default {
    name: "app",
    components: {
      "mainsimstatus-navbar": Navbar
    },
    computed: {
      showMenu() {
        return this.$store.state.showMenu
      }
    },
    methods: {
      ...mapMutations(["navtoggle"])
    }
  }
</script>
