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

  return filterPlan(json)
}

function filterPlan ({ datum, essen }) {
  const filtered = {
    datum,
    datum_str: formatMenuDate(datum),
    essen: (essen||[]).map(filterEssen)
  }
  return filtered
}

function filterEssen (essen) {
  const toBool = (str) => str.toLowerCase() === 'true'

  return {
    ...essen,
    deutsch_short: stripAllergens(essen.deutsch || ''),
    bewertung: Number(essen.bewertung),
    img: toBool(essen.img),
    schwein: toBool(essen.schwein),
    rind: toBool(essen.rind),
    vegetarisch: toBool(essen.vegetarisch),
    alkohol: toBool(essen.alkohol),
    preise_numeric: preise(essen.pr).map(Number),
    preise: preise(essen.pr).map(preis => `${preis}€`)
  }
}

async function getAllPlans (options) {
  options = options || {}

  let plans = {}
  for (const [key, url] of Object.entries(URLS)) {
    plans[key] = await getPlan(url)
    plans[key].name = capitalize(key)
    if (options.text) {
      plans[key] = toText(plans[key])
    }
  }

  if (options.text) {
    let text = Object.values(plans).join('\n\n')
    return text
  }
  return plans
}

function formatMenuDate ({ tag, monat, jahr }) {
  return `${tag}.${monat}.${jahr}`.replace(/\b(\d)\./g, '0$1.')
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

function stripAllergens (deutsch) {
  return deutsch
    .replace(/\(\d+(\s*,\s*\d*)*\)?/g, '')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toText ({ name, datum, essen }) {
  const title = `${capitalize(name)} (${formatMenuDate(datum)})`

  const items = essen.map(meal => {
    return `${meal.kategorie}: ${meal.deutsch_short}
Preis: ${meal.preise.join(', ')}`
  })

  return `${title}
${items.join('\n')}`
}

module.exports = {
  URLS,
  getPlan,
  getAllPlans
}
