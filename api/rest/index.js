const pjson = require('../package.json')
const Pelatihan = require('./pelatihan')
const Jadwal = require('./jadwal')
const Peserta = require('./peserta')
const Pendaftaran = require('./pendaftaran')

module.exports = (app) => {
  app.get('/api', (req, res) => {
    res.json({ version: pjson.version })
  })
  Pelatihan(app)
  Jadwal(app)
  Peserta(app)
  Pendaftaran(app)
}