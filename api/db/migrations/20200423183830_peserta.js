
exports.up = async function (knex) {
  const exist = await knex.schema.hasTable('peserta')
  if (!exist) {
    return knex.schema
      .createTable('peserta', function (table) {
        table.increments()
        table.integer('aktif').defaultTo(1)
        table.string('email')
        table.string('phone')
        table.string('ktp')
        table.string('nisn')
        table.string('nama')
        table.string('agama')
        table.string('gender')
        table.string('warga')
        table.string('tempatLahir')
        table.string('tanggalLahir')
        table.string('alamat')
        table.string('provinsi')
        table.string('kabupaten')
        table.string('kecamatan')
        table.string('kelurahan')
        table.string('kodepos')
        table.string('rt')
        table.string('rw')
        table.string('ayah')
        table.string('ibu')
        table.string('ktpFile')
        table.string('skesFile')
        table.string('ijazahFile')
        table.string('akteFile')
        table.string('fotoFile')
        table.string('bstFile')
      })
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('peserta')
};
