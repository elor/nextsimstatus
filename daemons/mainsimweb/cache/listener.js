const express = require('express')
const cors = require('cors')
const {graphqlHTTP} = require('express-graphql')
const serverSchema = require('./graphqlschema')

module.exports.listen = function (PORT, getDataCallback) {
  const app = express()

  function formatError (error) {
    return JSON.stringify({
      error: 'Error while processing the request',
      message: error ? error.message || error.msg || error : ''
    },
    null,
    '  '
    )
  }

  let graphQLRoot = {
    lastupdate: () => getDataCallback().lastupdate,
    nodes: () => getDataCallback().nodes,
    jobs: () => getDataCallback().jobs,
    users: () => Object.values(getDataCallback().users),
    simpcs: () => Object.values(getDataCallback().simpcs),
    racks: () => getDataCallback().racks,
    quotas: () => Object.values(getDataCallback().quotas)
  }

  app.use(cors())

  app.get(['/all', '/json'], function (request, response, next) {
    new Promise((resolve, reject) => {
      resolve(JSON.stringify(getDataCallback(), null, ' '))
    })
      .then(jsonstring => response.send(jsonstring))
      .catch(error => response.status(400).send(formatError(error)))
  })

  app.use('/graphql', graphqlHTTP({
    schema: serverSchema,
    rootValue: graphQLRoot,
    graphiql: true
  }))

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

  return app
}
