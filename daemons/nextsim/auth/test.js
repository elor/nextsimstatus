const ldap = require('./ldap')
const jwt = require('./jwt')

ldap.login('t.user', 't.passwd')
  .then(ldapMatch => {
    console.log(ldapMatch)
    return jwt.sign(ldapMatch)
  })
  .then(token => {
    console.log(token)
    console.log(jwt.decode(token))
    console.log('should renew: ' + jwt.shouldRenew(token))
    return jwt.verify(token)
  })
  .then(valid => {
    console.log(valid)
    console.log(valid ? 'valid' : 'invalid')
  })
  .catch(error => console.error(error))
