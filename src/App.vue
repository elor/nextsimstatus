<template>
  <v-app>
    <v-navigation-drawer
      persistent
      v-model="drawer"
      @change="mobileDrawer = !mobileDrawer"
      :mini-variant="miniVariant && !$vuetify.breakpoint.mdAndDown"
      enable-resize-watcher
      app
    >
      <v-toolbar dark color="primary">
        <v-toolbar-side-icon v-if="isMobile" @click.stop="mobileDrawer = !mobileDrawer">
          <v-icon>chevron_left</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-side-icon v-else @click.stop="miniVariant = !miniVariant">
          <v-icon v-if="miniVariant">menu</v-icon>
          <v-icon v-else>chevron_left</v-icon>
        </v-toolbar-side-icon>
        <v-toolbar-title v-show="!miniVariant">MainSim</v-toolbar-title>
      </v-toolbar>

      <v-list>
        <template v-for="route in items">
          <v-list-tile :key="route.path" :to="route.path" v-if="!route.hidden">
            <v-list-tile-action>
              <v-icon v-html="route.icon"></v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-text="route.name"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app absolute dark color="primary">
      <v-toolbar-side-icon v-if="isMobile" @click.stop="mobileDrawer = !mobileDrawer"></v-toolbar-side-icon>

      <login-menu></login-menu>

      <v-toolbar-title>MainSim {{$route.name}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <span v-if="jobs.length > 1000">
        <v-icon color="orange">warning</v-icon>Viele Jobs, Anzeige hängt. Jobs geht es gut.
      </span>

      <v-spacer></v-spacer>

      <v-toolbar-side-icon v-if="errors.length" @click="clearErrors">
        <v-badge overlap right color="red">
          <span slot="badge">{{errors.length}}</span>
          <v-icon large color="red">error</v-icon>
        </v-badge>
      </v-toolbar-side-icon>

      <error-snack v-for="(error, index) of errors" :key="index" :error="error"/>

      <v-chip v-model="update_available" close>Update available</v-chip>
      {{dates.now.toLocaleString()}}
      <v-btn
        :disabled="updating"
        fab
        small
        :color="dates.now - Math.min(dates.jobs) > options.timeout ? 'error' : 'primary'"
      >
        <v-icon v-if="!updating" @click.stop="refresh">refresh</v-icon>
        <v-progress-circular v-else indeterminate></v-progress-circular>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import LoginMenu from '@/components/LoginMenu'
import ErrorSnack from '@/components/ErrorSnack'

export default {
  data () {
    return {
      mobileDrawer: false,
      miniVariant: true,
      update_available: false
    }
  },
  components: {
    LoginMenu,
    ErrorSnack
  },
  computed: {
    ...mapState(['errors', 'dates', 'options', 'jobs', 'updating', 'sources']),
    drawer: {
      get () {
        if (this.isMobile) {
          return this.mobileDrawer
        } else {
          return true
        }
      },
      set (value) {
        this.mobileDrawer = value
      }
    },
    isMobile () {
      return this.$vuetify.breakpoint.mdAndDown
    },
    items () {
      return this.$router.options.routes.filter(
        route => !route.path.match(/:/)
      )
    }
  },
  methods: {
    ...mapActions(['mainsimFetch', 'mqttReconnect']),
    ...mapMutations(['clearErrors']),
    refresh () {
      this.mainsimFetch()
      this.mqttReconnect()
    }
  },
  name: 'App',
  watch: {
    isMobile (mobile) {
      if (!mobile) {
        this.mobileDrawer = false
      }
    }
  },
  mounted () {
    this.$nextTick(() => window.addEventListener('focus', this.refresh))
  },
  beforeDestroy () {
    window.removeEventListener('focus', this.refresh)
  }
}
</script>

<style>
.noanimation .v-progress-circular__overlay {
  transition: none;
}
</style>
