import Vuex from "vuex";
import Vue from "vue";

import nodes from "./testdata/nodes";
import jobs from "./testdata/jobs";
import { uniq } from "lodash";
import { nodels } from "../utils/nodels";

import createEnssimPlugin from "./createEnssimPlugin";

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
          .filter(job => job.NodeNames.includes(node.NodeName))
          .filter(job => job.State)
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
    updateJSONData(state, message) {
      state.simpcs[message.hostname].date = message.date;
    },
    serverError(state, error) {
      state.errors.push({
        date: new Date(),
        error
      });
    }
  },

  plugins: [
    createEnssimPlugin()
  ]
});
