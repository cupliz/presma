const fs = require('fs-extra')
const path = require('path')
const multer = require('multer')
const uploadBukti = multer({ dest: path.join(__dirname, '../upload/bukti') })
const knex = require('../db/knex')

const catchError = (res, e) => {
  console.log(e)
  res.status(500).json({ 'message': e.stack.split('\n')[0] })
}
const createData = async (req, res) => {
  // console.log('> create pendaftaran', req.body)
  const [inserted] = await knex('pendaftaran').insert(req.body)
  if (inserted) {
    return res.json(await knex('pendaftaran').where('id', inserted).first())
  }
  return res.json({ message: 'CREATED' })
}
const updateData = async (req, res) => {
  // console.log('> update pendaftaran', req.body)
  const updated = await knex('pendaftaran').update(req.body).where('id', req.body.id)
  if (updated) {
    return res.json(await knex('pendaftaran').where('id', req.body.id).first())
  }
  return res.json({ message: 'UPDATED' })
}
module.exports = (app) => {
  app.post('/api/konfirmasi', uploadBukti.single('file'), async (req, res) => {
    try {
      const { destination, filename, originalname } = req.file
      const buktiPembayaran = `${req.body.kode}.${originalname.split('.').pop()}`
      const srcpath = path.join(destination, filename)
      const dstpath = path.join(destination, buktiPembayaran)
      await fs.move(srcpath, dstpath, { overwrite: true })
      const result = await knex('pendaftaran').update({ buktiPembayaran }).where('kode', req.body.kode)
      res.json({ message: result ? 'OK' : 'FAILED' })
    } catch (error) { catchError(res, error) }
  })
  app.get('/api/pendaftaran', async (req, res) => {
    try {
      const { id, email, phone } = req.query
      const result = await knex('pendaftaran')
        .modify((builder) => {
          if (id) { builder.where({ id }) }
          if (email) { builder.where({ email }) }
          if (phone) { builder.where({ phone }) }
        })
        .orderBy('id', 'desc')
      res.json(result)
    } catch (error) { catchError(res, error) }
  })
  app.post('/api/pendaftaran', async (req, res) => {
    try {
      if (req.body.id) {
        updateData(req, res)
      } else {
        createData(req, res)
      }
    } catch (error) { catchError(res, error) }
  })
  app.delete('/api/pendaftaran/:id', async (req, res) => {
    try {
      const deleted = await knex('pendaftaran').where('id', req.params.id).delete()
      res.json({ message: deleted ? 'OK' : "FAILED" })
    } catch (error) { catchError(res, error) }
  })
}