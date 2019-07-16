import Vue from 'vue'
import Router from 'vue-router'

// import Todo from '@/components/Todo'

import Dashboard from '@/components/Dashboard'
import Job from '@/components/Job'
import Jobs from '@/components/Jobs'
import Node from '@/components/Node'
import Nodes from '@/components/Nodes'
import EnsSim from '@/components/EnsSim'
import SimPCs from '@/components/SimPCs'
import SimPC from '@/components/SimPC'
import Periodinator from '@/components/Periodinator'
import Mensa from '@/components/Mensa'
import Software from '@/components/Software'
import Users from '@/components/Users'
import User from '@/components/User'
import Manual from '@/components/Manual'
import Stats from '@/components/Stats'
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
    path: '/stats',
    name: 'Stats',
    component: Stats,
    icon: 'fa-chart-pie'
  },
  {
    path: '/simpcs',
    name: 'SimPCs',
    component: SimPCs,
    icon: 'fa-desktop'
  },
  {
    path: '/apps',
    name: 'Software',
    component: Software,
    icon: 'fa-mouse-pointer'
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
    hidden: true
  },
  {
    path: '/manual',
    name: 'Manual',
    component: Manual,
    icon: 'fa-info-circle'
  },
  {
    path: '/apps/periodyfier',
    name: 'Periodyfier',
    component: Periodinator,
    hidden: true
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
    path: '/enssim',
    name: 'EnsSim',
    component: EnsSim,
    icon: 'fa-carrot'
  },
  {
    path: '/mensa',
    name: 'Mensa',
    component: Mensa,
    icon: 'fa-utensils'
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
    path: '/simpc:id',
    name: 'SimPC',
    component: SimPC,
    hidden: true
  },
  {
    path: '/sim:id',
    name: 'Node',
    component: Node,
    hidden: true
  }
  ]
})
