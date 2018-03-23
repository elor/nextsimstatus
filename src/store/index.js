import Vuex from "vuex";
import Vue from "vue";

import nodes from "./testdata/nodes";

import createEnssimPlugin from "./createEnssimPlugin";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nodes,
    errors: []
  },
  getters: {
    nodestatus(state) {
      return state.jsondata.nodes.map(node => ({
        ...node,
        jobs: node.jobs || [],
        usage: (node.jobs || []).length / (node.np || 1)
      }));
    },

    queuestatus(state) {
      let queues = {};
      state.jsondata.nodes.forEach(node => {
        if (!queues[node.properties]) {
          queues[node.properties] = {
            name: node.properties,
            properties: node.properties,
            state: {},
            np: 0,
            jobs: []
          };
        }

        let queue = queues[node.properties];
        queue.np += Number(node.np);

        if (node.jobs) {
          queue.jobs.splice(queue.jobs.length, 0, ...node.jobs);
        }

        node.state.split(",").forEach(state => {
          queue.state[state] = (queue.state[state] || 0) + 1;
        });
      });

      Object.keys(queues).map(key => queues[key])
        .forEach(queue => {
          queue.usage = queue.jobs.length / queue.np;
          queue.state = Object.keys(queue.state)
            .map(state => ({ state: state, count: queue.state[state] }))
            .sort((a, b) => b.count - a.count)
            .map(state => `${state.count}x ${state.state}`)
            .join(" ");
        });

      return Object.values(queues);
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
