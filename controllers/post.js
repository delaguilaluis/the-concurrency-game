const URL = require('url').URL
const respondBadRequest = require('../lib/respond-bad-request')
const players = require('../data/players')

module.exports = function handlePOST (req, res) {
  const url = new URL(req.url, 'http://idontcare.com')

  if (url.pathname !== '/solutions') return respondBadRequest(res)

  let body = ''
  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  req.on('end', () => {
    try {
      body = JSON.parse(body)
    } catch (e) {
      console.error(e, body)
      respondBadRequest(res)
      return
    }

    const player = body.player
    const id = body.id
    const code = body.code

    if (player && players[player] && id > 0 && id < 721) {
      const matchingChallenge = players[player].challenges.find((ch) => {
        return ch.code === code
      })

      if (matchingChallenge) matchingChallenge.done = true


      res.writeHead(204, { 'Content-Type': 'application/json' })
      res.end('\n')

      return
    }

    respondBadRequest(res)
  })
}
