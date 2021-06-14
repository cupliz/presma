const fs = require('fs-extra')
const path = require('path')
const knex = require('../db/knex')
const { uploadPembayaran, processUploadedFile } = require('./upload')

const catchError = (res, e) => {
  console.log(e)
  res.status(500).json({ 'message': e.stack.split('\n')[0] })
}
const createData = async (req, res) => {
  console.log('> create pendaftaran', req.body.kode)
  const [inserted] = await knex('pendaftaran').insert(req.body)
  if (inserted) {
    return res.json(await knex('pendaftaran').where('id', inserted).first())
  }
  return res.json({ message: 'CREATED' })
}
const updateData = async (req, res) => {
  console.log('> update pendaftaran', req.body.kode)
  const updated = await knex('pendaftaran').update(req.body).where('id', req.body.id)
  if (updated) {
    return res.json(await knex('pendaftaran').where('id', req.body.id).first())
  }
  return res.json({ message: 'UPDATED' })
}
module.exports = (app) => {

  app.post(app.prefix + '/verifikasi', async (req, res) => {
    const result = await knex('pendaftaran').update(req.body).where('kode', req.body.kode)
    if (result) {
      const detail = await knex('pendaftaran').select('cekBiodata', 'cekPembayaran', 'note').where('kode', req.body.kode).first()
      return res.json(detail)
    }
    res.json({ message: 'FAILED' })
  })
  app.post(app.prefix + '/verifikasidokumen', async (req, res) => {

    const delFile = await knex('peserta').select(req.body.kolom).where('email', req.body.email).first()
    await fs.remove(`./upload/dokumen/${delFile[req.body.kolom]}`, err => {
      if (err) return console.error(err)
    })
    const key = req.body.kolom
    let payload = {}
    payload[key] = null
    const verified = await knex('peserta').update(payload).where('email', req.body.email)
    if (verified) {
      return res.json(await knex('peserta').where('email', req.body.email).first())
    }
  })
  app.post(app.prefix + '/konfirmasi', uploadPembayaran.single('file'), async (req, res) => {
    try {
      const buktiPembayaran = await processUploadedFile(req, req.body.kode)
      const result = await knex('pendaftaran').update({ buktiPembayaran }).where('kode', req.body.kode)
      res.json({ message: result ? 'OK' : 'FAILED' })
    } catch (error) { catchError(res, error) }
  })
  app.get(app.prefix + '/pendaftaran', async (req, res) => {
    try {
      const { id, email, phone } = req.query
      const result = await knex('pendaftaran as d')
        .select(
          'u.*',
          'j.tanggal', 'k.nama as pelatihan', 'k.biaya', 'k.prasyarat',
          'd.id', 'd.kode', 'd.bank', 'd.buktiPembayaran', 'd.cekBiodata', 'd.cekPembayaran', 'd.note'
        )
        .modify((builder) => {
          if (id) { builder.where({ id }) }
          if (email) { builder.where({ email }) }
          if (phone) { builder.where({ phone }) }
        })
        .leftJoin('jadwal as j', 'j.id', 'd.jadwal')
        .leftJoin('peserta as u', 'u.id', 'd.peserta')
        .leftJoin('pelatihan as k', 'k.id', 'd.pelatihan')
        .orderBy('d.id', 'desc')
      res.json(result)
    } catch (error) { catchError(res, error) }
  })
  app.post(app.prefix + '/pendaftaran', async (req, res) => {
    try {
      if (req.body.id) {
        updateData(req, res)
      } else {
        createData(req, res)
      }
    } catch (error) { catchError(res, error) }
  })
  app.delete(app.prefix + '/pendaftaran/:id', async (req, res) => {
    try {
      const deleted = await knex('pendaftaran').where('id', req.params.id).delete()
      res.json({ message: deleted ? 'OK' : "FAILED" })
    } catch (error) { catchError(res, error) }
  })
}