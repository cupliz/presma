const knex = require('../db/knex')

const catchError = (res, e) => res.status(500).json({ 'message': e.stack.split('\n')[0] })
const createPelatihan = async (req, res) => {
  console.log('> create pelatihan')
  req.body.prasyarat = JSON.stringify(req.body.prasyarat)
  await knex('pelatihan').insert(req.body)
  return res.json({ message: 'OK' })
}
const updatePelatihan = async (req, res) => {
  console.log('> update pelatihan')
  req.body.prasyarat = JSON.stringify(req.body.prasyarat)
  await knex('pelatihan').update(req.body).where('id', req.body.id)
  return res.json({ message: 'OK' })
}

module.exports = (app) => {
  app.get(app.prefix + '/pelatihan', async (req, res) => {
    try {
      const { id, nama } = req.query
      let result = await knex('pelatihan')
        .modify((builder) => {
          if (id) { builder.where({ id }) }
          if (nama) { builder.where({ nama }) }
        })
      result.map(r => r.prasyarat = JSON.parse(r.prasyarat))
      res.json(result)
    } catch (error) { catchError(res, error) }
  })
  app.post(app.prefix + '/pelatihan', async (req, res) => {
    try {
      if (req.body.id) {
        updatePelatihan(req, res)
      } else {
        const findPelatihan = await knex('pelatihan').where('nama', req.body.nama).first()
        if (findPelatihan) {
          return res.json({ message: `Pelatihan ${req.body.nama} sudah ada!` })
        } else {
          createPelatihan(req, res)
        }
      }
    } catch (error) { catchError(res, error) }
  })
  app.delete(app.prefix + '/pelatihan/:id', async (req, res) => {
    try {
      const deleted = await knex('pelatihan').where('id', req.params.id).delete()
      res.json({ message: deleted ? 'OK' : "FAILED" })
    } catch (error) { catchError(res, error) }
  })
}