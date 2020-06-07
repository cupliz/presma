const knex = require('../db/knex')
const { processUploadedFile, uploadDokumen } = require('./upload')

module.exports = (app) => {
  // Mengambil data peserta, list maupun single
  app.get(app.prefix + '/peserta', async (req, res) => {
    try {
      const { id, email, phone } = req.query
      const result = await knex('peserta')
        .modify((builder) => {
          if (id) { builder.where({ id }) }
          if (email) { builder.where({ email }) }
          if (phone) { builder.where({ phone }) }
        })
        .orderBy('id', 'desc')
      res.json(result)
    } catch (error) { catchError(res, error) }
  })

  // Upload dokumen
  app.post(app.prefix + '/peserta/upload', uploadDokumen.single('file'), async (req, res) => {
    const { id, name } = req.body
    const filename = await processUploadedFile(req, `${id}-${name}`)
    await knex('peserta').update({ [name]: filename }).where('id', id)
    res.json({ message: filename ? "OK" : "FAILED", filename })
  })

  // Create / Update data peserta
  app.post(app.prefix + '/peserta', async (req, res) => {
    try {
      if (req.body.id) {
        updateData(req, res)
      } else {
        const findByEmail = await knex('peserta').where('email', req.body.email).first()
        if (findByEmail) {
          req.body.id = findByEmail.id
          updateData(req, res)
        } else {
          createData(req, res)
        }
      }
    } catch (error) { catchError(res, error) }
  })

  // Hapus data peserta
  app.delete(app.prefix + '/peserta/:id', async (req, res) => {
    try {
      const deleted = await knex('peserta').where('id', req.params.id).delete()
      res.json({ message: deleted ? 'OK' : "FAILED" })
    } catch (error) { catchError(res, error) }
  })
}

const catchError = (res, e) => res.status(500).json({ 'message': e.stack.split('\n')[0] })
const createData = async (req, res) => {
  const inserted = await knex('peserta').insert(req.body)
  console.log('> create peserta', inserted, req.body.name)
  if (inserted) {
    return res.json(await knex('peserta').where('email', req.body.email).first())
  }
  return res.json({ message: 'CREATED' })
}
const updateData = async (req, res) => {
  console.log('> update peserta', req.body.name)
  const updated = await knex('peserta').update(req.body).where('id', req.body.id)
  if (updated) {
    return res.json(await knex('peserta').where('id', req.body.id).first())
  }
  return res.json({ message: 'UPDATED' })
}