const knex = require('../db/knex')

const catchError = (res, e) => res.status(500).json({ 'message': e.stack.split('\n')[0] })
const createData = async (req, res) => {
  // console.log('> create peserta', req.body)
  const inserted = await knex('peserta').insert(req.body)
  console.log(inserted)
  if (inserted) {
    return res.json(await knex('peserta').where('email', req.body.email).first())
  }
  return res.json({ message: 'CREATED' })
}
const updateData = async (req, res) => {
  // console.log('> update peserta', req.body)
  const updated = await knex('peserta').update(req.body).where('id', req.body.id)
  if (updated) {
    return res.json(await knex('peserta').where('id', req.body.id).first())
  }
  return res.json({ message: 'UPDATED' })
}
module.exports = (app) => {
  app.get('/api/peserta', async (req, res) => {
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
  app.post('/api/peserta', async (req, res) => {
    try {
      if (req.body.id) {
        updateData(req, res)
      } else {
        createData(req, res)
      }
    } catch (error) { catchError(res, error) }
  })
  app.delete('/api/peserta/:id', async (req, res) => {
    try {
      const deleted = await knex('peserta').where('id', req.params.id).delete()
      res.json({ message: deleted ? 'OK' : "FAILED" })
    } catch (error) { catchError(res, error) }
  })
}