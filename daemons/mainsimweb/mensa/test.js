#!/usr/bin/env node

const mensa = require('./mensa')

mensa.getAllPlans()
  .then(data => console.log(JSON.stringify(data, null, 2)))
