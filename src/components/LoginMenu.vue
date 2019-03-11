<template>
  <v-dialog max-width="300px" v-model="dialog">
    <v-avatar slot="activator" :color="user.name ? 'white' : 'primary'" size="24">
    <v-icon :color="user.name ? usercolor(user.name) : 'white'">account_circle</v-icon>
    </v-avatar>

    <v-card v-if="user.name">
      <v-card-title>
        <span class="headline">
          <v-icon :color="usercolor(user.name)">account_circle</v-icon>
          {{user.name}}
          <router-link :to="`/users/${user.name}`"></router-link>
        </span>
        <v-card-text>
          <v-list subheader>
            <v-subheader>Gruppen</v-subheader>
            <v-list-tile v-for="group in user.groups" :key="group">
              <v-list-tile-avatar>
                <v-icon :color="usercolor(group)">group</v-icon>
              </v-list-tile-avatar>
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
      </v-card-title>

    </v-card>

    <v-card v-else>
      <v-card-title>
        <span class="headline">Anmelden</span>
      </v-card-title>
      <v-card-text>
        <v-text-field required clearable v-model="credentials.username" label="Username"
          hint="MainSim user name, e.g. <i>t.user</i>" @keyup.enter="login" @keyup.escape="close"></v-text-field>
        <v-text-field required clearable v-model="credentials.password" label="Password" type="password" @keyup.enter="performLogin()"
          @keyup.escape="close"></v-text-field>
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
import { mapActions, mapState } from 'vuex'

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
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['login', 'logout']),
    performLogin(){
      this.login(this.credentials)
      this.clear()
    },
    usercolor,
    close () {
      this.dialog = false
    },
    clear(){
      this.credentials.username = ''
      this.credentials.password = ''
    }
  }
}
</script>
