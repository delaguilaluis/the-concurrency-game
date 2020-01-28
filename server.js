const http = require('http')
const handleGET = require('./controllers/get.js')
const handlePOST = require('./controllers/post.js')
const respondBadRequest = require('./lib/respond-bad-request')

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    handleGET(req, res)
    return
  }

  if (req.method === 'POST') {
    handlePOST(req, res)
    return
  }

  respondBadRequest(res)
})

const port = 3002
server.listen(process.env.PORT || 5000, () => console.log(`Listening on port: ${port}`))
