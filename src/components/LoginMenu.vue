<template>
  <v-dialog max-width="300px" v-model="dialog">
    <v-chip
      slot="activator"
      size="24"
      :color="logged_in || light ? 'white' : 'primary'"
      :text-color="logged_in || light ? 'primary' : 'dark'"
    >
      <v-icon :color="usercolor" class="mr-1">fa-user-circle</v-icon>
      {{user.login || 'login'}}
      <v-tooltip bottom v-if="is_admin">
        <template v-slot:activator="{ on }">
          <v-icon small v-on="on">fa-star</v-icon>
        </template>
        <span>simadmin</span>
      </v-tooltip>
    </v-chip>

    <v-card v-if="logged_in">
      <v-card-title class="headline">
        <user-chip :login="user.login" />
        {{user.name}}
        <v-spacer></v-spacer>
        <v-icon @click="close">fa-times</v-icon>
      </v-card-title>

      <v-card-text>
        <v-list subheader>
          <v-subheader>Meine Seiten</v-subheader>
          <v-list-tile :to="pages.user" @click="dialog=false">
            <v-list-tile-action>
              <v-icon :color="usercolor">fa-user</v-icon>
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
              <v-icon v-if="is_admin_group(group)" :color="groupcolor(group)">fa-star</v-icon>
              <v-icon v-else :color="groupcolor(group)">fa-user-friends</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>{{group}}</v-list-tile-content>
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
import UserChip from '@/components/UserChip'

export default {
  components: {
    UserChip
  },
  props: {
    light: {
      type: Boolean,
      default: false
    }
  },
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
      return this.logged_in ? usercolor(this.user.login) : (this.light ? 'primary' : 'white')
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
