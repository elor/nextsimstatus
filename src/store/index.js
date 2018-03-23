import Vuex from "vuex";
import Vue from "vue";

import nodes from "./testdata/nodes";
import jobs from "./testdata/jobs";
import { uniq } from "lodash";

import createEnssimPlugin from "./createEnssimPlugin";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodes,
    jobs,
    errors: []
  },
  getters: {
    nodestatus(state) {
      return state.nodes.map(node => ({
        ...node,
        jobs: state.jobs
      })).map(node => ({
        ...node,
        users: uniq(node.jobs.map(job => job.UserId.replace(/\(\d+\)/, "")))
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
