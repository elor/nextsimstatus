#!/usr/bin/env node

const mensa = require('./mensa')

async function testMain () {
  const json = await mensa.getAllPlans()
  console.log(JSON.stringify(json, null, 2))
  const text = await mensa.getAllPlans({ text: true, stripAllergens: true })
  console.log(text)
}

testMain()
  .catch(console.error)
