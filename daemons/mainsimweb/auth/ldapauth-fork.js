const LdapAuth = require('ldapauth-fork')
const read = require('read')
const assert = require('assert')

let server

read({ prompt: 'bindDN Password: ', silent: true }, (err, pass) => {
  assert.ifError(err)
  server = new LdapAuth({
    url: 'ldap://mainsim.etit.tu-chemnitz.de',
    bindDN: 'cn=ldapadm,dc=etit,dc=tu-chemnitz,dc=de',
    bindCredentials: pass,
    searchBase: 'ou=People,dc=etit,dc=tu-chemnitz,dc=de',
    searchFilter: '(uid={{username}})',
    groupSearchBase: 'ou=Group,dc=etit,dc=tu-chemnitz,dc=de',
    groupSearchFilter: '(|(cn={{username}})(memberUid={{username}}))'
  })
  read({ prompt: 'login: ' }, (err, user) => {
    assert.ifError(err)
    read({ prompt: 'pass: ', silent: true }, (err, pass) => {
      assert.ifError(err)
      server.authenticate(user, pass, (err, user) => {
        if (err) {
          console.log(err)
        } else {
          console.log(user)
        }
      })
    })
  })
})
