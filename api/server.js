require('dotenv').config({ path: '.env' })
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const http = require('http')
const pjson = require('./package.json')
const Pelatihan = require('./src/pelatihan')
const Jadwal = require('./src/jadwal')
const Peserta = require('./src/peserta')
const Pendaftaran = require('./src/pendaftaran')

let server = null
const app = express()
server = http.createServer(app)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/upload', express.static(path.join(__dirname, './upload')))
app.prefix = ''
app.get(app.prefix + '/', (req, res) => { res.json({ version: pjson.version }) })
Pelatihan(app)
Jadwal(app)
Peserta(app)
Pendaftaran(app)
app.listen(process.env.APP_PORT, () => {
  console.log('Server started on port ' + process.env.APP_PORT);
})