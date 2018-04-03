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
      timeout: 5000
    }
  },

  getters: {
    nodestatus(state, getters) {
      return state.nodes.map(node => ({
        ...node,
        jobs: getters.jobstatus
          .filter(job => job.JobState === "RUNNING")
          .filter(job => job.NodeNames.includes(node.NodeName))
      })).map(node => ({
        ...node,
        users: uniq(node.jobs.map(job => job.UserName))
      }));
    },
    jobstatus(state) {
      return state.jobs.map(job => ({
        ...job,
        NodeNames: nodels(job.NodeList),
        UserName: job.UserId.replace(/\(\d+\)/, "")
      }));
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
    createNowTimePlugin(500)
  ]
});
