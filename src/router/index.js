import Vue from "vue";
import Router from "vue-router";

import Dashboard from "@/components/Dashboard";
import Todo from "@/components/Todo";
import Nodes from "@/components/Nodes";
import Nodelist from "@/components/Nodelist";

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
      path: "/jobs",
      name: "Jobs",
      component: Todo,
      icon: "assignment"
    },
    {
      path: "/nodelist",
      name: "Nodelist",
      component: Nodelist,
      icon: "label_outline",
      hidden: true
    },
    {
      path: "/users",
      name: "Users",
      component: Todo,
      icon: "people"
    },
    {
      path: "/stats",
      name: "Stats",
      component: Todo,
      icon: "pie_chart"
    },
    {
      path: "/simpcs",
      name: "SimPCs",
      component: Todo,
      icon: "computer"
    }
  ]
});
