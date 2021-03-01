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
        <v-app-bar-nav-icon v-if="isMobile" @click.stop="mobileDrawer = !mobileDrawer">
          <v-icon>fa-chevron-left</v-icon>
        </v-app-bar-nav-icon>
        <v-app-bar-nav-icon v-else @click.stop="miniVariant = !miniVariant">
          <v-icon v-if="miniVariant">fa-bars</v-icon>
          <v-icon v-else>fa-chevron-left</v-icon>
        </v-app-bar-nav-icon>
        <v-toolbar-title v-show="!miniVariant">MainSim</v-toolbar-title>
      </v-toolbar>

      <v-list dense nav>
        <v-list-item v-for="route in items.filter(route=>!route.hidden)" v-ripple :key="route.path" :to="route.path" link>
          <v-list-item-icon :class="{'justify-center': miniVariant}">
            <v-icon dense>{{ route.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{route.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>

    <v-app-bar app absolute dark color="primary">
      <v-app-bar-nav-icon v-if="isMobile" @click.stop="mobileDrawer = !mobileDrawer"></v-app-bar-nav-icon>

      <login-menu></login-menu>

      <v-toolbar-title>MainSim {{$route.name}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <span v-if="jobs.length > 1000">
        <v-icon color="orange">fa-exclamation-triangle</v-icon>Viele Jobs, Anzeige hängt. Jobs geht es gut.
      </span>

      <v-spacer></v-spacer>

      <v-toolbar-side-icon v-if="errors.length" @click="clearErrors">
        <v-badge overlap right color="red">
          <span slot="badge">{{errors.length}}</span>
          <v-icon large color="red">fa-bell</v-icon>
        </v-badge>
      </v-toolbar-side-icon>

      <error-snack v-for="(error, index) of errors" :key="index" :error="error" />

      {{dates.now.toLocaleString()}}
      <v-btn
        :disabled="updating"
        :loading="updating"
        fab
        small
        :color="dates.now - Math.min(dates.jobs) > options.timeout ? 'error' : 'primary'"
      >
        <v-icon @click.stop="refresh">fa-sync</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
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
      miniVariant: true
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
      return this.$vuetify.breakpoint.mobile
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
