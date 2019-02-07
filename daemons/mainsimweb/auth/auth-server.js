const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('./jwt')
const ldap = require('./ldap')

const PORT = 8000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.post('/auth/login', (request, response) => {
  ldap.login(request.body.username, request.body.password)
    .then(ldapMatch => jwt.sign(ldapMatch))
    .then(token => {
      response.setHeader('Content-Type', 'application/json')
      response.send(JSON.stringify({ token, decoded: jwt.decode(token) }, undefined, 2))
    })
    .catch(error => {
      console.error(error)
      response.status(401)
      response.send('Login error')
    })
})

app.get('/auth/login', (req, res) => {
  res.send(`
<form method="post" action="/auth/login">
Username: <input type="text" name="username" placeholder=""/><br>
Password: <input type="password" name="password" placeholder=""/><br>
<input type="submit" value="Login" />
</form>
`)
})

app.post('/auth/token/check', (request, response) => {
  const token = request.body.token

  jwt.verify(token)
    .then(decoded => {
      response.setHeader('Content-Type', 'application/json')
      response.send(JSON.stringify({
        valid: true,
        decoded,
        shouldRenew: jwt.shouldRenew(token)
      }))
    })
    .catch(err => {
      console.error(err)

      response.status(401)
      response.send('Token verification failed')
    })
})

app.post('/auth/token/renew', (request, response) => {
  const token = request.body.token

  jwt.renew(token)
    .then(token => {
      response.setHeader('Content-Type', 'application/json')
      response.send(JSON.stringify({ token, decoded: jwt.decode(token) }, undefined, 2))
    })
    .catch(err => {
      console.error(err)

      response.status(401)
      response.send('Token verification failed')
    })
})

app.listen(PORT)

console.log(`serving on port ${PORT}`)
