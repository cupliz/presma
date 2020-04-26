const knex = require('../db/knex')

const catchError = (res, e) => res.status(500).json({ 'message': e.stack.split('\n')[0] })
const createJadwal = async (req, res) => {
  // console.log('> create jadwal', req.body)
  await knex('jadwal').insert(req.body)
  return res.json({ message: 'CREATED' })
}
const updateJadwal = async (req, res) => {
  // console.log('> update jadwal', req.body)
  await knex('jadwal').update(req.body).where('id', req.body.id)
  return res.json({ message: 'UPDATED' })
}
module.exports = (app) => {
  app.get(app.prefix + '/jadwal', async (req, res) => {
    try {
      const { id, pelatihan, hari, active } = req.query
      const result = await knex('jadwal')
        .modify((builder) => {
          if (id) { builder.where({ id }) }
          if (pelatihan) { builder.where({ pelatihan }) }
          if (hari) { builder.where({ hari }) }
          if (active) { builder.where({ active }) }
        })
        .orderBy('tanggal', 'desc')
      res.json(result)
    } catch (error) { catchError(res, error) }
  })
  app.post(app.prefix + '/jadwal', async (req, res) => {
    try {
      if (req.body.id) {
        updateJadwal(req, res)
      } else {
        createJadwal(req, res)
      }
    } catch (error) { catchError(res, error) }
  })
  app.delete(app.prefix + '/jadwal/:id', async (req, res) => {
    try {
      const deleted = await knex('jadwal').where('id', req.params.id).delete()
      res.json({ message: deleted ? 'OK' : "FAILED" })
    } catch (error) { catchError(res, error) }
  })
}