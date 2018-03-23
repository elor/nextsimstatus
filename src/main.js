import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";

import "vuetify/dist/vuetify.min.css";

import App from "./App";
import router from "./router";
import store from "./store";

Vue.use(Vuetify);
Vue.use(Vuex);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>"
});
