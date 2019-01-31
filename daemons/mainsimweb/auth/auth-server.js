const express = require('express')
const bodyParser = require('body-parser')

const ldap = require('./ldap')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/login', (request, response) => {
  ldap.login(request.body.username, request.body.password)
    .then(result => response.send(JSON.stringify(result, undefined, 2)))
    .catch(error => { console.error(error); response.send('ERROR') })
})

app.get('/', (req, res) => {
  res.send(`
<form method="post" action="/login">
Username: <input type="text" name="username" placeholder=""/><br>
Password: <input type="password" name="password" placeholder=""/><br>
<input type="submit" value="Login" />
</form>
`)
})

app.listen(8000)

console.log('serving')
