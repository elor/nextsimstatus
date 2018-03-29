import Vue from "vue";
import Router from "vue-router";

import Todo from "@/components/Todo";

import Dashboard from "@/components/Dashboard";
import Nodes from "@/components/Nodes";
import Jobs from "@/components/Jobs";
import ErrorList from "@/components/ErrorList";

Vue.use(Router);

export default new Router({
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
      component: Jobs,
      icon: "assignment"
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
    },
    {
      path: "/modules",
      name: "Software",
      component: Todo,
      icon: "apps"
    },
    {
      path: "/errors",
      name: "Errors",
      component: ErrorList,
      icon: "error"
    }
  ]
});
