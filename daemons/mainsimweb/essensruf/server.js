#!/usr/bin/env node

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const verifyToken = require('./verifyToken')
const getMenu = require('./getMenu')
const sendMessage = require('./sendMessage')

const args = require('minimist')(process.argv.slice(2))

const PORT = args._[0] || 8000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.post('/essensruf', async (request, response) => {
  try {
    const jsonWebToken = request.headers.authorization || request.body.token

    const decodedToken = await verifyToken(jsonWebToken)
    if (!decodedToken) {
      throw new Error('Unauthorized: No valid token')
    }
    const menu = await getMenu()

    const message = `Essensruf von ${decodedToken.name} (${decodedToken.login})!

    ${menu}`

    const apiResponse = await sendMessage(message)

    response.setHeader('Content-Type', 'text/plain')
    response.send(apiResponse)
  } catch (error) {
    console.error(error)
    if (error.response && error.response.status) {
      response.status(error.response.status)
      response.send(error.response.statusText)
    } else {
      response.status(500)
      response.send(error.toString())
    }
  }
})

app.listen(PORT)

console.log(`serving on port ${PORT}`)
