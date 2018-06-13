import Vue from "vue";
import Router from "vue-router";

import Todo from "@/components/Todo";

import Dashboard from "@/components/Dashboard";
import ErrorList from "@/components/ErrorList";
import Job from "@/components/Job";
import Jobs from "@/components/Jobs";
import Node from "@/components/Node";
import Nodes from "@/components/Nodes";
import Periodinator from "@/components/Periodinator";
import Software from "@/components/Software";
import Users from "@/components/Users";

Vue.use(Router);

export default new Router({
  routes: [{
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
      path: "/node/:id",
      name: "Node",
      component: Node,
      hidden: true
    },
    {
      path: "/jobs",
      name: "Jobs",
      component: Jobs,
      icon: "assignment"
    },
    {
      path: "/jobs/:id",
      name: "Job",
      component: Job,
      hidden: true
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
