import Vuex from "vuex";
import Vue from "vue";

//import nodes from "./testdata/nodes";
//import jobs from "./testdata/jobs";
import { uniq, flatten } from "lodash";
import { nodels } from "../utils/nodels";

import createMainsimPlugin from "./createMainsimPlugin";
import createNowTimePlugin from "./createNowTimePlugin";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodes: [],
    jobs: [],
    errors: [],
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
            jobs: node.jobs.filter(job => job.ArrayJobId === array)})),
        pureJobs: node.jobs
          .filter(job => !job.ArrayJobId)
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
      return uniq(getters.jobstatus
        .map(job => job.UserName))
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
          NodeNames: uniq(flatten(user.RunningJobs.map(job => job.NodeNames))),
          NumCPUs: user.RunningJobs.map(job => Number(job.NumCPUs)).reduce((a, b) => a + b, 0)
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
