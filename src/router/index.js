import Vue from "vue";
import Router from "vue-router";

import Home from "@/components/Home";
import Nodes from "@/components/Nodes";
import SimPCs from "@/components/SimPCs";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      icon: "home"
    },
    {
      path: "/nodes",
      name: "Nodes",
      component: Nodes,
      icon: "dns"
    },
    {
      path: "/simpcs",
      name: "SimPCs",
      component: SimPCs,
      icon: "computer"
    },
    {
      path: "/status",
      name: "Status",
      component: Home,
      icon: "dashboard"
    }
  ]
});
