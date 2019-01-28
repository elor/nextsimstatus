import Vuex from 'vuex'
import Vue from 'vue'

import { uniq, flatten, sum, range, sortBy, cloneDeep } from 'lodash'
import { nodels } from '../utils/nodels'
import usercolor from '../utils/usercolor'

import createMainsimPlugin from './createMainsimPlugin'
import createNowTimePlugin from './createNowTimePlugin'

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

const sources = {
  graphql: true,
  graphql_interval: undefined,
  mqtt: true
}

export default new Vuex.Store({
  state: {
    nodes: [],
    jobs: [],
    racks: [],
    errors: [],
    simpcs: initialSimpcs,
    dates: {
      nodes: new Date(0),
      jobs: new Date(0),
      now: new Date()
    },
    updating: false,
    sources,
    options: {
      timeout: 5000
    }
  },

  getters: {
    nodestatus (state, getters) {
      return state.nodes
        .map(node => ({
          ...node,
          jobs: getters.jobstatus
            .filter(job => job.JobState === 'RUNNING')
            .filter(job => job.NodeNames.includes(node.NodeName)),
          States: flatten(
            node.State.split('+').map(
              state =>
                state.endsWith('*') ? [state.replace(/\**$/, ''), '*'] : state
            )
          ),
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
            })),
          pureJobs: node.jobs.filter(job => !job.ArrayJobId)
        }))
    },
    partitions (state) {
      return uniq(state.nodes.map(node => node.Partitions))
    },
    partitionstatus (state, getters) {
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
    jobstatus (state) {
      return state.jobs
        .map(job => ({
          ...job,
          NodeNames: nodels(job.NodeList),
          UserName: job.UserId.replace(/\(\d+\)/, '')
        }))
        .reverse()
    },
    userstatus (state, getters) {
      const users = uniq([
        ...getters.jobstatus.map(job => job.UserName),
        ...flatten(getters.simpcstatus.map(pc => pc.usernames))
      ])
        .map(UserName => ({
          UserName,
          color: usercolor(UserName),
          Jobs: getters.jobstatus.filter(job => job.UserName === UserName),
          PCs: getters.simpcstatus.filter(pc => pc.usernames.includes(UserName))
        }))
        .map(user => ({
          ...user,
          RunningJobs: user.Jobs.filter(job => /running/i.test(job.JobState)),
          PendingJobs: user.Jobs.filter(job => /pending/i.test(job.JobState)),
          CompletedJobs: user.Jobs.filter(job =>
            /completed/i.test(job.JobState)
          )
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
            Other:
              user.Jobs.length -
              user.CompletedJobs.length -
              user.PendingJobs.length -
              user.RunningJobs.length
          }
        }))
      return sortBy(users, 'UserName')
    },
    simpcstatus (state) {
      return Object.values(state.simpcs).map(pc => ({
        ...pc,
        number: Number(pc.hostname.replace(/\D/g, '')),
        usernames: uniq((pc.users || []).map(user => user.split(' ')[0])),
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
    rackstatus (state) {
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
    }
  },

  mutations: {
    updateNodes (state, nodes) {
      state.nodes = nodes
      state.dates.nodes = new Date()
    },
    updateJobs (state, jobs) {
      state.jobs = jobs
      state.dates.jobs = new Date()
    },
    updateNowDate (state, now) {
      state.dates.now = now
    },
    updateSimPC (state, simpc) {
      state.simpcs[simpc.hostname] = simpc
    },
    updateRacks (state, racks) {
      state.racks = racks
    },
    newError (state, error) {
      state.errors.push({
        date: new Date(),
        message: error
      })
    },
    startUpdating (state) {
      state.updating = true
    },
    stopUpdating (state) {
      state.updating = false
    }
  },

  actions: {
    mainsimFetch () { },
    mqttReconnect () { }
  },

  plugins: [createMainsimPlugin(sources), createNowTimePlugin(1000)]
})
