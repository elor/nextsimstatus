const axios = require('axios')

const MESSAGE_URL = 'http://mainsim.etit.tu-chemnitz.de:9990/plugins/restapi/v1/messages/users'

const SECRET = require('./chatSecret')

module.exports = async function sendMessage (message) {
  const response = await axios.post(MESSAGE_URL,
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?> <message><body>${message}</body></message>`,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': SECRET
      }
    })

  if (response.status < 300 && response.status >= 200) {
    return response.statusText
  }

  throw new Error({
    status: response.status,
    statusText: response.statusText
  })
}
