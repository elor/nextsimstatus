import Vuex from "vuex";
import Vue from "vue";

import {
  uniq,
  flatten,
  sum,
  range,
  sortBy
} from "lodash";
import {
  nodels
} from "../utils/nodels";

import createMainsimPlugin from "./createMainsimPlugin";
import createNowTimePlugin from "./createNowTimePlugin";

const TEN_SECONDS = 10000;
const DEPRECATED_RELEASES = ["14.04", "16.04"];

Vue.use(Vuex);

const initialSimpcs = range(16, 43)
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
      now: new Date()
    },
    options: {
      timeout: 5000
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
      const users = uniq([...getters.jobstatus.map(job => job.UserName), ...flatten(getters.simpcstatus.map(pc => pc.usernames))])
        .map(UserName => ({
          UserName,
          Jobs: getters.jobstatus.filter(job => job.UserName === UserName),
          PCs: getters.simpcstatus.filter(pc => pc.usernames.includes(UserName))
        }))
        .map(user => ({
          ...user,
          RunningJobs: user.Jobs.filter(job => /running/i.test(job.JobState)),
          OtherJobs: user.Jobs.filter(job => !/running/i.test(job.JobState))
        }))
        .map(user => ({
          ...user,
          NodeNames: uniq(flatten(user.RunningJobs.map(job => job.NodeNames))).sort(),
          PCNames: user.PCs.map(pc => pc.hostname),
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
        }))
        .map(user => ({
          ...user,
          JobCount: {
            Running: user.RunningJobs.length,
            Other: user.OtherJobs.length
          }
        }));
      return sortBy(users, "UserName");
    },
    simpcstatus(state, getters) {
      return Object.values(state.simpcs).map(pc => ({
        ...pc,
        number: Number(pc.hostname.replace(/\D/g, "")),
        usernames: uniq((pc.users || []).map(user => user.split(" ")[0])),
        inactive: !pc.datetime || state.dates.now - new Date(pc.datetime) > TEN_SECONDS,
        lastupdate: pc.datetime ? Math.max(0, Math.floor((state.dates.now - new Date(pc.datetime)) / 1000)) : undefined,
        isoldrelease: DEPRECATED_RELEASES.includes(pc.release),
        load_1min: pc.load && Number(pc.load[0]),
        load_5min: pc.load && Number(pc.load[1]),
        load_15min: pc.load && Number(pc.load[2])
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

  actions: {
    mainsimFetch() {},
    mainsimConfig() {}
  },

  plugins: [
    createMainsimPlugin(),
    createNowTimePlugin(1000)
  ]
});
