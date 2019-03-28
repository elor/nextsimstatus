#!/usr/bin/env node

const { toJson } = require('xml2json')
const axios = require('axios')

const BASE_URL = 'https://www.swcz.de/bilderspeiseplan/feed.php'

module.exports = {
  URLS: {
    RH70_MENSA: `${BASE_URL}?plan=1479835489`,
    RH70_CAFETERIA: `${BASE_URL}?plan=7`
  },
  async getRawPlan (URL) {
    const { data } = await axios.get(URL)
    return toJson(data)
  }
}
