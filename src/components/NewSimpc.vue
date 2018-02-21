<template>
  <div class="app-viewport">
    <md-toolbar md-elevation="3" class="main-toolbar">
      <div class="md-toolbar-container">
        <md-button class="md-icon-button" @click="back">
          <md-icon>keyboard_backspace</md-icon>
        </md-button>

        <h2 style="flex: 1" class="md-title">{{simpc.name}}</h2>

        <md-button class="md-icon-button">
          <md-icon>edit</md-icon>
        </md-button>

      </div>
    </md-toolbar>

    <main class="main-content">
      <h2 class="md-title md-center">{{simpc.name}}</h2>

      <pre style="font-family: inherit">{{simpc.description}}</pre>

    </main>
  </div>
</template>

<script>
  export default {
    data: () => ({
      simpc: {
        name: "Neues Turnier",
        description: "empty",
        startdate: undefined
      }
    }),
    computed: {
      store() {
        this.$store.commit("createsimpc", this.simpc)
      }
    },
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>
