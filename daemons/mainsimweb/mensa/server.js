#!/usr/bin/env node

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mensa = require('./mensa')

const PORT = 8000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.get('/mensa', async (request, response) => {
  try {
    const data = mensa.getAllPlans()

    response.setHeader('Content-Type', 'application/json')
    response.send(JSON.stringify(data, undefined, 2))
  } catch (error) {
    console.error(error)
    response.status(401)
    response.send('Login error')
  }
})

app.listen(PORT)

console.log(`serving on port ${PORT}`)
