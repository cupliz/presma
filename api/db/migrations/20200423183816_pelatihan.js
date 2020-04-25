
exports.up = async function (knex) {
  const exist = await knex.schema.hasTable('pelatihan')
  if (!exist) {
    return knex.schema
      .createTable('pelatihan', function (table) {
        table.increments()
        table.string('nama')
        table.string('deskripsi')
        table.integer('waktu')
        table.string('biaya')
        table.string('prasyarat')
      })
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pelatihan')
};
