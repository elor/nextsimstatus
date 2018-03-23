import Vue from "vue";
import Router from "vue-router";

import Dashboard from "@/components/Dashboard";
import Nodes from "@/components/Nodes";
import SimPCs from "@/components/SimPCs";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      icon: "dashboard"
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
    }
  ]
});
