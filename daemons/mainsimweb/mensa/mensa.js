#!/usr/bin/env node

const { toJson } = require('xml2json')
const axios = require('axios')

const BASE_URL = (plan, type = 'xml') => `https://www.swcz.de/bilderspeiseplan/${type}.php?plan=${plan}`

const URLS = {
  mensa: BASE_URL(1479835489),
  cafeteria: BASE_URL(7)
}

async function getPlan (URL) {
  const { data } = await axios.get(URL)
  return JSON.parse(toJson(data)).speiseplan
}

async function getAllPlans () {
  let plans = {}
  for (const [key, url] of Object.entries(URLS)) {
    plans[key] = await getPlan(url)
  }

  return plans
}

module.exports = {
  URLS,
  getPlan,
  getAllPlans
}
