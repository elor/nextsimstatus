const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { promisify } = require('util')

const SECRET = crypto.randomBytes(512)
const OPTIONS = {
  expiresIn: '10d'
}

const RENEWGRACEPERIOD = 3 * 86400

function epochNow () {
  const now = new Date()
  return (now.getTime() - now.getUTCMilliseconds()) / 1000
}

module.exports = {
  sign (ldapMatch) {
    const payload = {
      name: ldapMatch.person.cn,
      login: ldapMatch.person.uid,
      uid: ldapMatch.person.uidNumber,
      home: ldapMatch.person.homeDirectory,
      groups: ldapMatch.groups.map(group => group.cn).sort()
    }

    return promisify(jwt.sign)(payload, SECRET, OPTIONS)
  },
  verify (token) {
    return promisify(jwt.verify)(token, SECRET)
  },
  renew (token) {
    return this.verify(token)
      .then(valid => {
        const payload = this.decode(token)

        delete payload.iat
        delete payload.exp
        delete payload.nbf
        delete payload.jti

        return promisify(jwt.sign)(payload, SECRET, OPTIONS)
      })
  },

  decode (token) {
    return jwt.decode(token)
  },
  shouldRenew (token) {
    return jwt.decode(token).exp < epochNow() + RENEWGRACEPERIOD
  }
}
