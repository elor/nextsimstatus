import Vuex from "vuex"
import Vue from "vue"

import simpcs from "./testdata/simpcs"
import profile from "./testdata/profile"

import createMQTTPlugin from "./createMQTTPlugin"
import createNowPlugin from "./createNowPlugin"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        simpcs,
        profile,
        now: new Date(),
        showMenu: true
    },
    getters: {
        now(state) {
            return state.now
        }
    },
    mutations: {
        navtoggle(state) {
            state.showMenu = !state.showMenu;
        },
        newMessage(state, message) {
            state.simpcs[message.hostname].date = message.date;
        },
        setNow(state, now) {
            state.now = now;
        }
    },
    plugins: [
        createMQTTPlugin("mqtt://mainsimweb.etit.tu-chemnitz.de:8080"),
        createNowPlugin(0)
    ]
})
