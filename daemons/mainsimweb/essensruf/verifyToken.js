const axios = require('axios')

const TOKEN_VERIFICATION_URL = 'https://mainsimweb.etit.tu-chemnitz.de/auth/token/check'

module.exports = async function verifyToken (token) {
  if (!token) {
    throw new Error('No Token!')
  }

  const response = await axios.post(TOKEN_VERIFICATION_URL, { token })

  if (response.data.decoded) {
    return response.data.decoded
  }

  throw new Error('verifyToken failed: response contains no decoded data. Is the token expired?')
}
