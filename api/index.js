require('dotenv').config({ path: '.env' })
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const http = require('http')
const RestAPI = require('./rest')

let server = null
const app = express()
server = http.createServer(app)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/static', express.static(path.join(__dirname, './upload')))
RestAPI(app)
app.listen(process.env.APP_PORT, () => {
  console.log('Server started on port ' + process.env.APP_PORT);
})