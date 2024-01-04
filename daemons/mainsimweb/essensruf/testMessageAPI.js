const axios = require('axios')

const MESSAGE_URL = 'https://mainsim.etit.tu-chemnitz.de:9991/plugins/restapi/v1/sessions'

const SECRET = require('./chatSecret')

module.exports = async function testMessageAPI() {
  console.log(SECRET)
  const response = await axios.get(MESSAGE_URL,
    {
      headers: {
        'Authorization': SECRET
      }
    })

  if (response.data) {
    return response.data
  }

  throw new Error('Error sending a message')
}
