import Vue from 'vue'
import Router from 'vue-router'

// import Todo from '@/components/Todo'

import Dashboard from '@/components/Dashboard'
import Job from '@/components/Job'
import Jobs from '@/components/Jobs'
import Node from '@/components/Node'
import Nodes from '@/components/Nodes'
import Periodinator from '@/components/Periodinator'
import Users from '@/components/Users'
import User from '@/components/User'
import Quota from '@/components/Quota'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    icon: 'fa-tachometer-alt'
  },
  {
    path: '/nodes',
    name: 'Nodes',
    component: Nodes,
    icon: 'fa-server'
  },
  {
    path: '/nodes/:search',
    name: 'Nodesearch',
    component: Nodes,
    icon: 'fa-server'
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: Jobs,
    icon: 'fa-clipboard-list'
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    icon: 'fa-users'
  },
  {
    path: '/quota',
    name: 'Quota',
    component: Quota,
    icon: 'fa-save'
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    icon: 'fa-flask',
    hidden: true
  },
  {
    path: '/apps/periodyfier',
    name: 'Periodyfier',
    icon: 'fa-atom',
    component: Periodinator
  },
  {
    path: '/apps/periodinator',
    name: 'Periodinator',
    component: Periodinator,
    hidden: true
  },
  {
    path: '/apps/periodyctionary',
    name: 'Periodyctionary',
    component: Periodinator,
    hidden: true
  },
  {
    path: '*',
    name: '404',
    component: Dashboard,
    hidden: true
  },
  {
    path: '/jobs/:id',
    name: 'Job',
    component: Job,
    hidden: true
  },
  {
    path: '/users/:id',
    name: 'User',
    component: User,
    hidden: true
  },
  {
    path: '/node/:id',
    name: 'Node',
    component: Node,
    hidden: true
  }
  ]
})
