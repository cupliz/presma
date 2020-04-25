
exports.up = async function (knex) {
  const exist = await knex.schema.hasTable('jadwal')
  if (!exist) {
    return knex.schema
      .createTable('jadwal', function (table) {
        table.increments()
        table.string('pelatihan')
        table.string('hari')
        table.string('tanggal')
        table.integer('aktif').defaultTo(1)
      })
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('jadwal')
};
