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
  const json = JSON.parse(toJson(data)).speiseplan

  return json
}

async function getAllPlans (options) {
  options = options || {}

  let plans = {}
  for (const [key, url] of Object.entries(URLS)) {
    plans[key] = await getPlan(url)
    if (options.text) {
      plans[key] = toText(plans[key], key)
    }
  }

  if (options.text) {
    let text = Object.values(plans).join('\n\n')
    return text
  }
  return plans
}

function formatMenuDate (datum) {
  return `${datum.tag}.${datum.monat}.${datum.jahr}`
}

function preise (pr) {
  if (!pr) {
    return []
  }
  if (pr.$t) {
    return [pr.$t]
  }
  return pr.map(preis => preis.$t)
}

function capitalize (text) {
  return `${text.charAt(0).toUpperCase()}${text.substr(1).toLowerCase()}`
}

function stripAllergens (essen) {
  return essen
    .replace(/\(\d+(\s*,\s*\d*)*\)?/g, '')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
}

function toText (menu, name = 'menu') {
  const title = `${capitalize(name)} (${formatMenuDate(menu.datum)})`

  const items = menu.essen.map(essen => {
    const description = stripAllergens(essen.deutsch)
    return `${essen.kategorie}: ${description}
  Preis: ${preise(essen.pr).map(pr => `${pr}€`).join(', ')}`
  })

  return `${title}
${items.join('\n')}`
}

module.exports = {
  URLS,
  getPlan,
  getAllPlans
}
