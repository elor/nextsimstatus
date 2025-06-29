const ldap = require('ldapjs')
const { promisify } = require('util')

function createConfig (username) {
  return {
    url: 'ldap://10.10.0.1',
    bindDN: `uid=${username},cn=users,cn=accounts,dc=etit,dc=tu-chemnitz,dc=de`,
    personSearch: {
      base: 'cn=users,cn=accounts,dc=etit,dc=tu-chemnitz,dc=de',
      config: {
        scope: 'sub',
        attributes: [
          'cn',
          'gecos',
          'gidNumber',
          'homeDirectory',
          'loginShell',
          'sn',
          'uid',
          'uidNumber'
        ],
        filter: `(uid=${username})`
      }
    },
    groupSearch: {
      base: 'cn=groups,cn=compat,dc=etit,dc=tu-chemnitz,dc=de',
      config: {
        scope: 'sub',
        attributes: [
          'cn',
          'gidNumber'
        ],
        filter: `(|(cn=${username})(memberUid=${username}))`
      }
    }
  }
}

function processPersonEntry (entry) {
  let result = {}
  entry.attributes.forEach(attribute => {
    const values = attribute._vals
    result[attribute.type] = values ? values[0].toString() : undefined
  })
  return result
}

function processGroupEntry (entry) {
  let result = {}
  entry.attributes.forEach(attribute => {
    const values = attribute._vals
    result[attribute.type] = values ? values[0].toString() : undefined
  })
  return result
}

function searchPerson (client, config) {
  return new Promise((resolve, reject) => {
    client.search(config.personSearch.base, config.personSearch.config, (err, res) => {
      if (err) {
        reject(err)
        return
      }

      let results = []
      res.on('searchEntry', entry => results.push(processPersonEntry(entry)))
      res.on('end', res => {
        resolve(results)
      })
    })
  })
}

function searchGroups (client, config) {
  return new Promise((resolve, reject) => {
    client.search(config.groupSearch.base, config.groupSearch.config, (err, res) => {
      if (err) {
        reject(err)
        return
      }

      let results = []
      res.on('searchEntry', entry => results.push(processGroupEntry(entry)))
      res.on('end', res => {
        resolve(results)
      })
    })
  })
}

module.exports = {
  login (username, pass) {
    return new Promise((resolve, reject) => {
      const config = createConfig(username)

      let client = ldap.createClient({ url: config.url })
      let person

      promisify(client.bind.bind(client))(config.bindDN, pass)
        .then(() => searchPerson(client, config))
        .then(result => {
          person = result[0]
          return searchGroups(client, config)
        })
        .then(groups => resolve({ person, groups }))
        .catch(err => {
          reject(err)
        })
        .finally(() => client.destroy())
    })
  }
}
