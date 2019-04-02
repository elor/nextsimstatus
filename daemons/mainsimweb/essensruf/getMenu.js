const axios = require('axios')

const MENSA_URL = 'https://mainsimweb.etit.tu-chemnitz.de/mensa/text'

module.exports = async function getMenu () {
  const response = await axios.get(MENSA_URL)

  if (response.data) {
    return response.data
  }

  throw new Error('Cannot read Mensa plans')
}
