import Vuex from "vuex";
import Vue from "vue";

import nodes from "./testdata/nodes";
import jobs from "./testdata/jobs";
import { uniq } from "lodash";
import { nodels } from "../utils/nodels";

import createMainsimPlugin from "./createMainsimPlugin";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodes,
    jobs,
    errors: []
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
        users: uniq(node.jobs.map(job => job.UserId.replace(/\(\d+\)/, "")))
      }));
    },
    jobstatus(state) {
      return state.jobs.map(job => ({
        ...job,
        NodeNames: nodels(job.NodeList)
      }));
    }
  },

  mutations: {
    updateNodes(state, nodes) {
      state.nodes = nodes;
    },
    updateJobs(state, jobs) {
      state.jobs = jobs;
    },
    updateUsers(state, users) {
      state.users = users;
    },
    newError(state, error) {
      state.errors.push({
        date: new Date(),
        message: error
      });
    }
  },

  plugins: [
    createMainsimPlugin()
  ]
});
