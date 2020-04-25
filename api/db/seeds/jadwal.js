
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('jadwal').del().then(function () {
    // Inserts seed entries
    return knex('jadwal').insert([
      { "id": 1, "pelatihan": "BST", "tanggal": "2020-04-22", "hari": 'senin', "aktif": 1 },
      { "id": 2, "pelatihan": "AFF", "tanggal": "2020-04-23", "hari": 'selasa', "aktif": 1 },
    ])
  });
};
