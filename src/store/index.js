import Vuex from "vuex";
import Vue from "vue";

import nodes from "./testdata/nodes";
import jobs from "./testdata/jobs";

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
        jobs: state.jobs(node.NodeName)
      })).map(node => ({
        ...node,
        users: state.users(node.jobs)
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
