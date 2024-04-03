const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { promisify } = require('util')
const fs = require('fs')
const path = require('path')

// read SECRETS_FILE from environment (SECRETS_FILE)
const SECRETS_FILE = process.env.SECRETS_FILE || 'auth_secret.txt'

// READ SECRET FROM auth_secret.txt, or create a random one if it doesn't exist
function get_or_create_secret () {
  const secret_path = SECRETS_FILE;
  if (fs.existsSync(secret_path)) {
    return fs.readFileSync(secret_path, 'utf8')
  } else {
    const new_secret = crypto.randomBytes(512)
    fs.writeFileSync(secret_path, new_secret)
    return new_secret
  }
}

const SECRET = get_or_create_secret()
const OPTIONS = {
  expiresIn: '30d'
}

const RENEWGRACEPERIOD = 7 * 86400

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
