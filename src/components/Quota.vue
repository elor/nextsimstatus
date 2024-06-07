<template>
  <v-container fluid v-if="logged_in">
    <v-card class="mb-2">
      <v-card-title>
        <v-layout wrap>
          <v-spacer></v-spacer>
          <v-flex xs="12" md="6">
            <v-text-field append-icon="fa-search" label="Search" single-line hide-details
              v-model="search"></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-card-text></v-card-text>
    </v-card>

    <v-card class="mb-2">
      <v-card-text>
        <h3>User Quota</h3>
        <UserQuota :search="search" />
      </v-card-text>
    </v-card>

    <v-card class="mb-2">
      <v-card-text>
        <h3>Group Quota</h3>
        <GroupQuota :search="search" />
      </v-card-text>
    </v-card>

    <v-card class="mb-2">
      <v-card-text>
        <h3>Project Quota</h3>
        <ProjectQuota :search="search" />
      </v-card-text>
    </v-card>
  </v-container>

  <v-container fluid v-else>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h3>Access Denied</h3>
          </v-card-title>
          <v-card-text>
            <p>
              <LoginMenu></LoginMenu> to see this page.
            </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import UserQuota from '@/components/UserQuota'
import GroupQuota from '@/components/GroupQuota'
import ProjectQuota from '@/components/ProjectQuota'
import LoginMenu from '@/components/LoginMenu'

export default {
  components: {
    UserQuota,
    GroupQuota,
    ProjectQuota,
    LoginMenu
  },
  data() {
    return {
      search: ''
    }
  },
  computed: {
    ...mapGetters(['logged_in'])
  }
}
</script>
