const generateUUID = require('uuid')
const URL = require('url').URL
const respondBadRequest = require('../lib/respond-bad-request')
const players = require('../data/players')

const timeoutValue = 5000

module.exports = function handleGET (req, res) {
  const url = new URL(req.url, 'http://idontcare.com')

  if (url.pathname === '/scoreboard') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    const scoreboard = Object.keys(players).map((player) => {
      return {
        player,
        challenges_done: players[player].challenges
          .filter((challenge) => challenge.done === true)
          .length
      }
    })
      .sort((a, b) => b.challenges_done - a.challenges_done)

    res.write(JSON.stringify(scoreboard))
    res.end('\n')
    return
  }

  if (url.pathname === '/scoreboardadmin') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify(players))
    res.end('\n')
    return
  }

  if (url.pathname !== '/challenges') return respondBadRequest(res)

  const player = url.searchParams.get('player')

  let id
  try {
    id = Number.parseInt(url.searchParams.get('id'), 10)
  } catch (e) {
    respondBadRequest(res)
    return
  }

  if (player && id < 721 && id > 0) {
    if (!players[player]) players[player] = { challenges: [] }

    const foundChallenge = players[player].challenges.find((ch) => {
      return ch.id === id
    })

    let code
    if (!foundChallenge) {
      code = generateUUID()
      players[player].challenges.push({
        id,
        code,
        done: false
      })

      // You want the code? You're gonna have to wait for it
      setTimeout(
        () => {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.write(JSON.stringify({ code: code, done: false }))
          res.end('\n')
        },
        timeoutValue
      )

      return
    }

    // Was it previously requested? Then don't wait for it :)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({ code: foundChallenge.code, done: true }))
    res.end('\n')
    return
  }

  respondBadRequest(res)
}
