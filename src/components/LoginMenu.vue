<template>
  <v-dialog max-width="300px" v-model="dialog">
    <v-avatar slot="activator" :color="user ? 'white' : 'primary'" size="24">
      <v-icon :color="user ? usercolor(user.login) : 'white'">account_circle</v-icon>
    </v-avatar>

    <v-card v-if="user">
      <v-card-title>
        <span class="headline">
          <v-icon :color="usercolor(user.login)">account_circle</v-icon>
          {{user.name}}
          <router-link :to="`/users/${user.login}`"></router-link>
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
        <v-text-field required clearable v-model="input.username" label="Username"
          hint="MainSim user name, e.g. <i>t.user</i>" @keyup.enter="login" @keyup.escape="close"></v-text-field>
        <v-text-field required clearable v-model="input.password" label="Password" type="password" @keyup.enter="login"
          @keyup.escape="close"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" @click="login">Anmelden</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import usercolor from '../utils/usercolor'
  import axios from 'axios'

  export default {
    data() {
      return {
        dialog: false,
        input: {
          username: '',
          password: ''
        },
        user: undefined
      }
    },
    methods: {
      usercolor,
      close() {
        this.dialog = false
      },
      login() {
        const postData = {
          username: this.input.username,
          password: this.input.password
        }
        axios.post('https://mainsimweb.etit.tu-chemnitz.de/auth/login', postData)
          .then(response => {
            this.clear()
            this.user = response.data.decoded
            console.log(response.data.decoded)
          })
          .catch(this.logout)
      },
      logout() {
        this.clear()
        this.user = undefined
      },
      clear() {
        this.input.username = ''
        this.input.password = ''
      }
    }
  }
</script>