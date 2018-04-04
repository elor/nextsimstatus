<template>
  <v-app>

    <v-navigation-drawer persistent :mini-variant="miniVariant" v-model="drawer" enable-resize-watcher app>
      <v-toolbar dark color="primary">
        <v-toolbar-side-icon @click.stop="drawer = !drawer">
          <v-icon>close</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title v-show="!miniVariant">MainSim</v-toolbar-title>
      </v-toolbar>

      <v-list>
        <v-list-tile v-for="route in items" :key="route.path" :to="route.path" v-if="!route.hidden">
          <v-list-tile-action>
            <v-icon v-html="route.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="route.name"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-btn icon @click.stop="miniVariant = !miniVariant">
              <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app absolute dark color="primary">
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-title>MainSim {{$route.name}}</v-toolbar-title>

      <v-spacer></v-spacer>

      {{dates.now.toLocaleString()}}
      <v-progress-circular class="noanimation"
                           rotate="-90"
                           :value="100 * (dates.now - dates.jobs) / options.timeout"
                           :color="dates.now - dates.jobs > options.timeout ? 'red' : 'light-blue'">
        J
      </v-progress-circular>
      <v-progress-circular class="noanimation"
                           rotate="-90"
                           :value="100 * (dates.now - dates.nodes) / options.timeout"
                           :color="dates.now - dates.nodes > options.timeout ? 'red' : 'light-blue'">
        N
      </v-progress-circular>
      <v-progress-circular class="noanimation"
                           rotate="-90"
                           :value="100 * (dates.now - dates.users) / options.timeout"
                           :color="dates.now - dates.users > options.timeout ? 'red' : 'light-blue'">
        U
      </v-progress-circular>

      <v-toolbar-side-icon to="/errors" v-if="errors.length">
        <v-badge overlap right color="red">
          <span slot="badge">{{errors.length}}</span>
          <v-icon large color="red">error</v-icon>
        </v-badge>
      </v-toolbar-side-icon>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>

  </v-app>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    data() {
      return {
        drawer: false,
        miniVariant: false
      };
    },
    computed: {
      ...mapState(["errors", "dates", "options"]),
      items() {
        return this.$router.options.routes.filter(route => !route.path.match(/:/));
      }
    },
    name: "App"
  };
</script>

<style>
  .noanimation .progress-circular__overlay {
    transition: none;
  }
</style>
