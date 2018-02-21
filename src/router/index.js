import Vue from "vue"
import Router from "vue-router"
import Simpcs from "@/components/Simpcs"
import Simpc from "@/components/Simpc"
import NewSimpc from "@/components/NewSimpc"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "simpcs",
      component: Simpcs,
      icon: "list"
    },
    {
      path: "/:simpcid",
      name: "simpc",
      component: Simpc,
      icon: "add"
    }
  ],
  mode: "hash"
})
