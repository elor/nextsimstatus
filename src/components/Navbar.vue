<template>
  <div>
    <md-toolbar class="md-transparent" md-elevation="0">
      <span>{{strings.todo}}</span>

      <div class="md-toolbar-section-end">
        <md-button class="md-icon-button md-dense" @click="navtoggle">
          <md-icon>keyboard_arrow_left</md-icon>
        </md-button>
      </div>
    </md-toolbar>

    <md-list>
      <md-list-item v-for="route in routes" :key="route.path" @click="navigate(route.path)">
        <md-icon>{{route.icon || "add"}}</md-icon>
        <span class="md-list-item-text">{{strings.routes[route.name]}}</span>
      </md-list-item>
    </md-list>
  </div>
</template>

<style lang="scss">
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>

<script>
  import { mapMutations, mapGetters } from "vuex"

  export default {
    computed: {
      ...mapGetters(["strings"]),
      routes() {
        return this.$router.options.routes.filter(route => !route.path.match(/:/))
      },
      menuVisible() {
        return this.$store.state.navmenu
      }
    },
    methods: {
      ...mapMutations(["navtoggle"]),
      navigate(target) {
        this.$router.push(target)
      }
    }
  }
</script>
