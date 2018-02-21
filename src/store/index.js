import Vuex from "vuex"
import Vue from "vue"

import simpcs from "./testdata/simpcs"
import profile from "./testdata/profile"
import { getLocale, defaultLocale } from "../locales"

import createMQTTPlugin from "./createMQTTPlugin"
import createNowPlugin from "./createNowPlugin"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        simpcs,
        profile,
        now: new Date(),
        showMenu: true,
        strings: getLocale(defaultLocale)
    },
    getters: {
        strings(state) {
            return state.strings
        },
        now(state) {
            return state.now
        }
    },
    mutations: {
        navtoggle(state) {
            state.showMenu = !state.showMenu;
        },
        setLocale(state, locale) {
            state.strings = getLocale(locale);
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
