import "vue-material/dist/vue-material.css"
import "font-roboto/dist/styles/roboto.css"
import "material-icons-font/material-icons-font.css"

import Vue from "vue"
import VueMaterial from "vue-material"

import App from "./App"
import router from "./router"
import store from "./store"

Vue.config.productionTip = false

Vue.use(VueMaterial)

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
})
