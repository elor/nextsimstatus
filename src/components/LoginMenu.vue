<template>
  <v-dialog max-width="300px" v-model="dialog">
    <v-chip
      slot="activator"
      size="24"
      :color="logged_in ? 'white' : 'primary'"
      :text-color="logged_in ? 'primary' : 'dark'"
    >
      <v-icon :color="usercolor" class="mr-1">account_circle</v-icon>
      {{user.login || 'login'}}

      <v-tooltip bottom v-if="is_admin">
        <template v-slot:activator="{ on }">
          <v-icon small v-on="on">star</v-icon>
        </template>
        <span>simadmin</span>
      </v-tooltip>
    </v-chip>

    <v-card v-if="logged_in">
      <v-card-title class="headline">
        <router-link :to="`/users/${user.login}`" class="mr-2">
          <v-chip class="ma-0" label small :style="{'background-color':usercolor}"></v-chip>
        </router-link>
        {{user.name}}
        <v-spacer></v-spacer>
        <v-icon @click="close">close</v-icon>
      </v-card-title>

      <v-card-text>
        <v-list subheader>
          <v-subheader>Meine Seiten</v-subheader>
          <v-list-tile :to="pages.user">
            <v-list-tile-action>
              <v-icon :color="usercolor">person</v-icon>
            </v-list-tile-action>
            {{user.login}}
          </v-list-tile>
        </v-list>
      </v-card-text>

      <v-card-text>
        <v-list subheader>
          <v-subheader>Meine Gruppen</v-subheader>
          <v-list-tile v-for="group in user.groups" :key="group">
            <v-list-tile-action>
              <v-icon v-if="is_admin_group(group)" :color="groupcolor(group)">star</v-icon>
              <v-icon v-else :color="groupcolor(group)">group</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              {{group}}
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="logout">Abmelden</v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-else>
      <v-card-title>
        <span class="headline">Anmelden</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          required
          clearable
          v-model="credentials.username"
          label="Username"
          hint="MainSim user name, e.g. <i>t.user</i>"
          @keyup.enter="login"
          @keyup.escape="close"
        ></v-text-field>
        <v-text-field
          required
          clearable
          v-model="credentials.password"
          label="Password"
          type="password"
          @keyup.enter="performLogin()"
          @keyup.escape="close"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="performLogin()">Anmelden</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import usercolor from '../utils/usercolor'
import { mapActions, mapState, mapGetters } from 'vuex'
import { ADMIN_GROUP } from '../config'

export default {
  data () {
    return {
      dialog: false,
      credentials: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    ...mapState(['user']),
    ...mapGetters(['is_admin']),
    pages () {
      const login = this.user.login

      return {
        user: `/users/${login}`
      }
    },
    logged_in () {
      return !!this.user.name
    },
    usercolor () {
      return this.logged_in ? usercolor(this.user.login) : 'white'
    }
  },
  methods: {
    ...mapActions(['login', 'logout']),
    performLogin () {
      this.login(this.credentials)
      this.clear()
    },
    close () {
      this.dialog = false
    },
    clear () {
      this.credentials.username = ''
      this.credentials.password = ''
    },
    groupcolor: usercolor,
    is_admin_group (group) {
      return group === ADMIN_GROUP
    }

  }
}
</script>
