const getMenu = require('./getMenu')
const testMessageAPI = require('./testMessageAPI')

async function test () {
  const menu = await getMenu()
  console.log(menu)

  const apiResult = await testMessageAPI()
  console.log(apiResult)
}

test()
  .catch(console.error)
