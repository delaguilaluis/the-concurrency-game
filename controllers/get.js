const generateUUID = require('uuid')
const URL = require('url').URL
const respondBadRequest = require('../lib/respond-bad-request')
const users = require('../data/users')

const timeoutValue = 5000

module.exports = function handleGET (req, res) {
  const url = new URL(req.url, 'http://idontcare.com')
  const user = url.searchParams.get('user')

  let challenge
  try {
    challenge = Number.parseInt(url.searchParams.get('challenge'), 10)
  } catch (e) {
    respondBadRequest(res)
    return
  }

  if (user && challenge < 721 && challenge > 0) {
    if (!users[user]) users[user] = { challenges: [] }

    const foundChallenge = users[user].challenges.find((ch) => {
      return ch.id === challenge
    })

    let uuid
    if (!foundChallenge) {
      uuid = generateUUID()
      users[user].challenges.push({
        id: challenge,
        uuid,
        completed: false
      })
    } else {
      uuid = foundChallenge.uuid
    }

    console.dir({ users }, { colors: true, depth: null })

    // You want the code? You're gonna have to wait for it
    setTimeout(
      () => {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.write(JSON.stringify({ code: uuid }))
        res.end('\n')
      },
      timeoutValue
    )
  }
}
