const ldap = require('./ldap')

ldap.login('t.user', 't.password')
  .then(results => console.log(results))
  .catch(error => console.error(error))
