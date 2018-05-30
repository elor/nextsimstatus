import Vue from "vue";
import Router from "vue-router";

import Todo from "@/components/Todo";

import Dashboard from "@/components/Dashboard";
import Nodes from "@/components/Nodes";
import Jobs from "@/components/Jobs";
import Users from "@/components/Users";
import Software from "@/components/Software";
import Periodinator from "@/components/Periodinator";
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
      component: Users,
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
      path: "/apps",
      name: "Software",
      component: Software,
      icon: "apps"
    },
    {
      path: "/apps/periodinator",
      name: "Periodinator",
      component: Periodinator,
      hidden: true
    },
    {
      path: "/apps/periodyctionary",
      name: "Periodyctionary",
      component: Periodinator,
      hidden: true
    },
    {
      path: "/errors",
      name: "Errors",
      component: ErrorList,
      icon: "error"
    },
    {
      path: "*",
      name: "404",
      component: Dashboard,
      hidden: true
    }
  ]
});
