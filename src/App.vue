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

      <span v-if="jobs.length > 1000">
        <v-icon color="orange">warning</v-icon>
        Viele Jobs, Anzeige hängt. Jobs geht es gut.
      </span>

      <v-spacer></v-spacer>

      {{dates.now.toLocaleString()}}
      &nbsp;

      <v-progress-circular :rotate="270"
                           :value="100 * (dates.now - dates.jobs) / options.timeout"
                           :color="dates.now - dates.jobs > options.timeout ? 'red' : 'light-blue'">
        J
      </v-progress-circular>
      <v-progress-circular :rotate="270"
                           :value="100 * (dates.now - dates.nodes) / options.timeout"
                           :color="dates.now - dates.nodes > options.timeout ? 'red' : 'light-blue'">
        N
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
    ...mapState(["errors", "dates", "options", "jobs"]),
    items() {
      return this.$router.options.routes.filter(
        route => !route.path.match(/:/)
      );
    }
  },
  name: "App"
};
</script>

<style>
.noanimation .v-progress-circular__overlay {
  transition: none;
}
</style>
