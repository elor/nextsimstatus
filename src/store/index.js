import Vuex from 'vuex'
import Vue from 'vue'

import { uniq, flatten, sum, range, sortBy, isEqual } from 'lodash'
import { nodels } from '../utils/nodels'
import usercolor from '../utils/usercolor'
import cpudata from '../utils/cpudata'
import usercores from '../utils/usercores'
import splitStates from '../utils/splitStates'

import createNextsimPlugin from './createNextsimPlugin'
import createNowTimePlugin from './createNowTimePlugin'
import createAuthPlugin from './createAuthPlugin'
import createControlPlugin from './createControlPlugin'
import createMOTDPlugin from './createMOTDPlugin'

import { ADMIN_GROUP } from '../config'

const TEN_SECONDS = 10000
const DEPRECATED_RELEASES = ['14.04', '16.04']

Vue.use(Vuex)

const initialSimpcs = range(16, 43)
  .map(n => `simpc${n}`)
  .map(name => ({
    [name]: {
      hostname: name
    }
  }))
  .reduce(
    (a, b) => ({
      ...a,
      ...b
    }),
    {}
  )

const USER_DEFAULT = {
  name: '',
  groups: []
}

const sources = {
  graphql: true,
  graphql_interval: undefined,
  mqtt: true
}

function userNameFromJob(job) {
  return job.UserId.replace(/\(\d+\)/, '')
}

export default new Vuex.Store({
  state: {
    nodes: [],
    jobs: [],
    joblogs: [],
    jobscripts: [],
    racks: [],
    errors: [],
    nodecpus: { allocated: 0, free: 0, error: 0, total: 0, drain: 0, fail: 0, reserved: 0 },
    usercpus: [],
    simpcs: initialSimpcs,
    dates: {
      nodes: new Date(0),
      jobs: new Date(0),
      now: new Date()
    },
    users: {
      elor: {
        Login: 'elor',
        FullName: 'Erik E. Lorenz'
      }
    },
    quotas: {
      user: [
        {
          user: 'dapfen',
          filesystem: '/home',
          kbytes: '0',
          quota: '0',
          limit: '0',
          files: '0',
          grace: '-'
        },
        {
          user: 'elor',
          filesystem: '/home',
          kbytes: '499074788',
          quota: '0',
          limit: '0',
          files: '623354',
          grace: '-'
        }
      ],
      group: [
        {
          group: 'admins',
          filesystem: '/home',
          kbytes: '0',
          quota: '0',
          limit: '0',
          files: '0',
          grace: '-'
        },
        {
          group: 'editors',
          filesystem: '/home',
          kbytes: '0',
          quota: '0',
          limit: '0',
          files: '0',
          grace: '-'
        },
        {
          group: 'enas',
          filesystem: '/home',
          kbytes: '40',
          quota: '0',
          limit: '0',
          files: '10',
          grace: '-'
        },
        {
          group: 'megware',
          filesystem: '/home',
          kbytes: '0',
          quota: '0',
          limit: '0',
          files: '0',
          grace: '-'
        },
        {
          group: 'nextsim',
          filesystem: '/home',
          kbytes: '12',
          quota: '0',
          limit: '0',
          files: '3',
          grace: '-'
        },
        {
          group: 'project_installation',
          filesystem: '/home',
          kbytes: '8',
          quota: '0',
          limit: '0',
          files: '2',
          grace: '-'
        }
      ],
      project: [
        {
          project: 'installation',
          filesystem: '/home',
          kbytes: '4',
          quota: '0',
          limit: '0',
          files: '1',
          grace: '-'
        }
      ],
      df: [
        {
          filesystem: '10.12.201.1@o2ib,10.12.201.2@o2ib:10.12.201.3@o2ib,10.12.201.4@o2ib:/nexsimfs/cluster',
          kbytes: '10737418240',
          used: '370692772',
          available: '10366725468',
          use_percent: '4%',
          mounted: '/cluster'
        },
        {
          filesystem: '10.12.201.1@o2ib,10.12.201.2@o2ib:10.12.201.3@o2ib,10.12.201.4@o2ib:/nexsimfs/home',
          kbytes: '460329993528',
          used: '1173610812',
          available: '435903128572',
          use_percent: '1%',
          mounted: '/home'
        }
      ]
    },
    updating: false,
    sources,
    options: {
      timeout: 5000
    },
    user: {
      name: '',
      groups: []
    },
    jwtToken: undefined,
    motd: ''
  },

  getters: {
    nodestatus(state, getters) { // 7
      return state.nodes
        .map(node => ({
          ...node,
          jobs: getters.jobstatus
            .filter(job => job.JobState === 'RUNNING')
            .filter(job => job.NodeNames.includes(node.NodeName)),
          States: splitStates(node.State),
          FreeMem: node.FreeMem === 'N/A' ? '0' : node.FreeMem,
          Reason: node.Reason || ''
        }))
        .map(node => ({
          ...node,
          users: uniq(node.jobs.map(job => job.UserName)),
          jobArrays: uniq(node.jobs.map(job => job.ArrayJobId))
            .filter(job => job)
            .map(array => ({
              ArrayJobId: array,
              jobs: node.jobs.filter(job => job.ArrayJobId === array)
            }))
            .map(array => ({
              ...array,
              UserName: array.jobs[0].UserName
            })),
          pureJobs: node.jobs.filter(job => !job.ArrayJobId)
        }))
    },
    partitions(state) {
      return uniq(state.nodes.map(node => node.Partitions))
    },
    partitionstatus(state, getters) { // 1
      return getters.partitions
        .map(partition => ({
          PartitionName: partition,
          Nodes: getters.nodestatus.filter(
            node => node.Partitions === partition
          )
        }))
        .map(partition => ({
          ...partition,
          CPUAlloc: sum(partition.Nodes.map(node => Number(node.CPUAlloc))),
          CPUTot: sum(partition.Nodes.map(node => Number(node.CPUTot)))
        }))
    },
    jobstatus(state) { // 4
      return state.jobs
        .map(job => ({
          ...job,
          NodeNames: nodels(job.NodeList),
          UserName: userNameFromJob(job)
        }))
        .reverse()
    },
    userstatus(state, getters) { // 5
      const users = uniq([
        ...Object.keys(state.users),
        ...getters.jobstatus.map(job => job.UserName),
        ...flatten(getters.simpcstatus.map(pc => pc.usernames)),
        ...state.quotas.user.map(user => user.user)
      ])
        .map(UserName => ({
          UserName,
          FullName: state.users[UserName]?.FullName || `${UserName} (full name not found)`,
          color: usercolor(UserName),
          Jobs: getters.jobstatus.filter(job => job.UserName === UserName),
          PCs: getters.simpcstatus.filter(pc => pc.usernames.includes(UserName))
        }))
        .map(user => ({
          ...user,
          RunningJobs: user.Jobs.filter(job => /running/i.test(job.JobState)),
          PendingJobs: user.Jobs.filter(job => /pending/i.test(job.JobState)),
          CompletedJobs: user.Jobs.filter(job => /completed/i.test(job.JobState)),
          FailedJobs: user.Jobs.filter(job => /failed/i.test(job.JobState))
        }))
        .map(user => ({
          ...user,
          NodeNames: uniq(
            flatten(user.RunningJobs.map(job => job.NodeNames))
          ).sort(),
          PCNames: user.PCs.map(pc => pc.hostname),
          NumCPUs: user.RunningJobs.map(job => Number(job.NumCPUs)).reduce(
            (a, b) => a + b,
            0
          )
        }))
        .map(user => ({
          ...user,
          JobCount: {
            Running: user.RunningJobs.length,
            Pending: user.PendingJobs.length,
            Completed: user.CompletedJobs.length,
            Failed: user.FailedJobs.length,
            Other:
              user.Jobs.length -
              user.CompletedJobs.length -
              user.PendingJobs.length -
              user.RunningJobs.length -
              user.FailedJobs.length
          }
        }))
        .map(user => ({
          ...user,
          Storage: {
            kbytes: state.quotas.user.find(quota => quota.user === user.UserName)?.kbytes || 0,
            quota: state.quotas.user.find(quota => quota.user === user.UserName)?.quota || 0
          }

        }))
      return sortBy(users, 'UserName')
    },
    simpcstatus(state) { // 3
      return Object.values(state.simpcs).map(pc => ({
        ...pc,
        cores: pc.cores || 8,
        number: Number(pc.hostname.replace(/\D/g, '')),
        usernames: uniq((pc.users || []).map(user => user.split(' ')[0]).filter(user => user)),
        inactive:
          !pc.datetime || state.dates.now - new Date(pc.datetime) > TEN_SECONDS,
        lastupdate: pc.datetime
          ? Math.max(
            0,
            Math.floor((state.dates.now - new Date(pc.datetime)) / 1000)
          )
          : undefined,
        isoldrelease: DEPRECATED_RELEASES.includes(pc.release),
        load_1min: pc.load && Number(pc.load[0]),
        load_5min: pc.load && Number(pc.load[1]),
        load_15min: pc.load && Number(pc.load[2])
      }))
    },
    rackstatus(state) { // 1
      return state.racks.map(rack => ({
        ...rack,
        temperatures: {
          supply_water: {
            min: 10,
            low: 10,
            val: rack.supply_water,
            high: 20,
            max: 50
          },
          return_water: {
            min: 10,
            low: 10,
            val: rack.return_water,
            high: 30,
            max: 50
          },
          supply_air: {
            min: 10,
            low: 20,
            val: rack.supply_air,
            high: 40,
            max: 50
          },
          return_air: {
            min: 10,
            low: 20,
            val: rack.return_air,
            high: 50,
            max: 50
          }
        }
      }))
    },
    is_admin(state) {
      return state.user.groups.includes(ADMIN_GROUP)
    },
    logged_in(state) {
      return !!(state.user.name && state.jwtToken)
    }
  },

  mutations: {
    updateNodes(state, nodes) {
      state.nodes = nodes
      state.dates.nodes = new Date()

      const nodecpus = cpudata(...nodes)

      if (!isEqual(state.nodecpus, nodecpus)) {
        state.nodecpus = nodecpus
      }
    },
    updateJobs(state, jobs) {
      state.jobs = jobs
      state.dates.jobs = new Date()

      const cpuJobs = jobs.filter(job => /running/i.test(job.JobState))
        .map(job => ({ NumCPUs: job.NumCPUs, UserName: userNameFromJob(job) }))
      const usercpus = usercores(cpuJobs)
      if (!isEqual(state.usercpus, usercpus)) {
        state.usercpus = usercpus
      }
    },
    updateNowDate(state, now) {
      state.dates.now = now
    },
    updateSimPC(state, simpc) {
      state.simpcs[simpc.hostname] = simpc
    },
    updateQuotas(state, quotas) {
      state.quotas = quotas
    },
    updateUsers(state, users) {
      state.users = users
    },
    updateRacks(state, racks) {
      racks = racks.map(rack => rack.error ? { error: rack.error } : rack)
      if (!isEqual(state.racks, racks)) {
        state.racks = racks
      }
    },
    newError(state, errorMessage) {
      state.errors.push({
        date: new Date(),
        message: errorMessage
      })
      console.error(errorMessage)
    },
    startUpdating(state) {
      state.updating = true
    },
    stopUpdating(state) {
      state.updating = false
    },
    setUser(state, { user, token }) {
      if (user && token) {
        state.user = user
        state.jwtToken = token
      } else {
        state.user = USER_DEFAULT
        state.jwtToken = undefined
      }
    },
    updateControl(state, status, message) {
    },
    updateJobLog(state, { JobId, StdOutFile, StdOut, StdErrFile, StdErr }) {
      const object = {
        JobId,
        StdOutFile,
        StdOut,
        StdErrFile,
        StdErr
      }

      const index = state.joblogs.findIndex(logs => logs.JobId === JobId)
      if (index === -1) {
        state.joblogs.push(object)
      } else {
        state.joblogs[index] = object
      }
    },
    updateJobScript(state, { JobId, JobScript }) {
      const object = {
        JobId,
        JobScript
      }

      const index = state.jobscripts.findIndex(script => script.JobId === JobId)
      if (index === -1) {
        state.jobscripts.push(object)
      } else {
        state.jobscripts[index] = object
      }
    },
    clearErrors(state) {
      state.errors = []
    },
    removeError(state, error) {
      if (state.errors.includes(error)) {
        state.errors = state.errors.filter(err => err !== error)
      }
    },
    updateMOTD(state, motd) {
      state.motd = motd
    }
  },

  actions: {
    nextsimFetch() { },
    mqttReconnect() { },
    updateMOTD() { },
    login(credentials) { },
    logout() { },
    renewToken() { },
    verifyToken() { },
    controlNodes({ action, nodes }) { },
    controlJobs({ action, jobs }) { },
    controlLogs({ jobs }) { },
    controlJobScript({ jobs }) { }
  },

  plugins: [
    createNextsimPlugin(sources),
    createNowTimePlugin(1000),
    createAuthPlugin(),
    createControlPlugin(),
    createMOTDPlugin()
  ]
})
