const mqtt = require('mqtt')
const zlib = require('zlib')

const host = '10.10.0.1' // nextsim internal IP, instead of nextsim.etit.tu-chemnitz.de
const port = 1883 // web-based port: 9001
const url = `mqtt://${host}:${port}`

function unpack64 (message) {
  const binary = Buffer.from(message.toString(), 'base64')
  const json = zlib.gunzipSync(binary).toString()
  return JSON.parse(json)
}

function unpack (message) {
  const json = zlib.gunzipSync(message).toString()
  return JSON.parse(json)
}

exports.connect = function (receive) {
  let client = mqtt.connect(url)

  mqtt.connect(url)

  client.on('error', error => receive('newError', error))

  client.on('connect', () => client.subscribe('#'))

  client.on('message', (topic, message) => {
    try {
      switch (topic) {
        case 'slurm/nodes':
          receive('nodes', unpack64(message))
          break
        case 'slurm/jobs':
          receive('jobs', unpack64(message))
          break
        case (topic.match(/simpc\/simpc\d+/) || {}).input:
          receive('simpc', unpack(message))
          break
        case 'racks/racks':
          receive('racks', unpack64(message))
          break
        case 'lustre/quota':
          receive('quotas', unpack64(message))
          break
        case 'usernames':
          receive('users', unpack64(message))
          break
      }
    } catch (err) {
      console.error(err)
    }
  })

  return client
}
