import Vuex from "vuex";
import Vue from "vue";

import {
  uniq,
  flatten,
  sum,
  range
} from "lodash";
import {
  nodels
} from "../utils/nodels";

import createMainsimPlugin from "./createMainsimPlugin";
import createNowTimePlugin from "./createNowTimePlugin";

const ONE_MINUTE = 60000;

Vue.use(Vuex);

const initialSimpcs = range(16, 42)
  .map(n => `simpc${n}`)
  .map(name => ({
    [name]: {
      hostname: name
    }
  })).reduce((a, b) => ({
    ...a,
    ...b
  }), {});

export default new Vuex.Store({
  state: {
    nodes: [],
    jobs: [],
    errors: [],
    simpcs: initialSimpcs,
    dates: {
      nodes: new Date(0),
      jobs: new Date(0),
      users: new Date(0),
      now: new Date()
    },
    options: {
      timeout: 15000
    }
  },

  getters: {
    nodestatus(state, getters) {
      return state.nodes.map(node => ({
        ...node,
        jobs: getters.jobstatus
          .filter(job => job.JobState === "RUNNING")
          .filter(job => job.NodeNames.includes(node.NodeName)),
        States: flatten(node.State.split("+")
          .map(state => state.endsWith("*") ? [state.replace(/\**$/, ""), "*"] : state)
        )
      })).map(node => ({
        ...node,
        users: uniq(node.jobs.map(job => job.UserName)),
        jobArrays: uniq(node.jobs.map(job => job.ArrayJobId))
          .filter(job => job)
          .map(array => ({
            ArrayJobId: array,
            jobs: node.jobs.filter(job => job.ArrayJobId === array)
          })),
        pureJobs: node.jobs
          .filter(job => !job.ArrayJobId)
      }));
    },
    partitions(state, getters) {
      return uniq(state.nodes.map(node => node.Partitions));
    },
    partitionstatus(state, getters) {
      return getters.partitions.map(partition => ({
        PartitionName: partition,
        Nodes: getters.nodestatus.filter(node => node.Partitions === partition)
      })).map(partition => ({
        ...partition,
        CPUAlloc: sum(partition.Nodes.map(node => Number(node.CPUAlloc))),
        CPUTot: sum(partition.Nodes.map(node => Number(node.CPUTot)))
      }));
    },
    jobstatus(state) {
      return state.jobs.map(job => ({
        ...job,
        NodeNames: nodels(job.NodeList),
        UserName: job.UserId.replace(/\(\d+\)/, "")
      })).reverse();
    },
    userstatus(state, getters) {
      return uniq(getters.jobstatus.map(job => job.UserName))
        .map(UserName => ({
          UserName,
          Jobs: getters.jobstatus.filter(job => job.UserName === UserName)
        }))
        .map(user => ({
          ...user,
          RunningJobs: user.Jobs.filter(job => /running/i.test(job.JobState)),
          OtherJobs: user.Jobs.filter(job => !/running/i.test(job.JobState))
        }))
        .map(user => ({
          ...user,
          NodeNames: uniq(flatten(user.RunningJobs.map(job => job.NodeNames))).sort(),
          NumCPUs: user.RunningJobs.map(job => Number(job.NumCPUs)).reduce((a, b) => a + b, 0),
          RunningArrays: uniq(user.RunningJobs.map(job => job.ArrayJobId))
            .filter(job => job)
            .map(array => ({
              ArrayJobId: array,
              jobs: user.RunningJobs.filter(job => job.ArrayJobId === array)
            })),
          RunningPureJobs: user.RunningJobs.filter(job => !job.ArrayJobId),
          OtherArrays: uniq(user.OtherJobs.map(job => job.ArrayJobId))
            .filter(job => job)
            .map(array => ({
              ArrayJobId: array,
              jobs: user.OtherJobs.filter(job => job.ArrayJobId === array)
            })),
          OtherPureJobs: user.OtherJobs.filter(job => !job.ArrayJobId)
        }));
    },
    simpcstatus(state, getters) {
      return Object.values(state.simpcs).map(pc => ({
        ...pc,
        usernames: uniq((pc.users || []).map(user => user.split(" ")[0])),
        inactive: state.dates.now - new Date(pc.datetime) > ONE_MINUTE
      }));
    }
  },

  mutations: {
    updateNodes(state, nodes) {
      state.nodes = nodes;
      state.dates.nodes = new Date();
    },
    updateJobs(state, jobs) {
      state.jobs = jobs;
      state.dates.jobs = new Date();
    },
    updateUsers(state, users) {
      state.users = users;
    },
    updateNowDate(state, now) {
      state.dates.now = now;
    },
    updateSimPC(state, simpc) {
      state.simpcs[simpc.hostname] = simpc;
    },
    newError(state, error) {
      state.errors.push({
        date: new Date(),
        message: error
      });
    }
  },

  plugins: [
    createMainsimPlugin(),
    createNowTimePlugin(32)
  ]
});
