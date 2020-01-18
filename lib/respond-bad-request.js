module.exports = function respondBadRequest (res) {
  res.writeHead(400, { 'Content-Type': 'application/json' })
  res.write(JSON.stringify({ error: 'Bad Request' }))
  res.end('\n')
}
