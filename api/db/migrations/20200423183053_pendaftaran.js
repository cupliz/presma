exports.up = async function (knex) {
  const exist = await knex.schema.hasTable('pendaftaran')
  if (!exist) {
    return knex.schema
      .createTable('pendaftaran', function (table) {
        table.increments()
        table.string('kode')
        table.integer('pelatihan')
        table.integer('jadwal')
        table.integer('peserta')
        table.string('bank')
        table.string('buktiPembayaran')
        table.integer('cekBiodata').defaultTo(0)
        table.integer('cekPembayaran').defaultTo(0)
      })
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pendaftaran')
};
