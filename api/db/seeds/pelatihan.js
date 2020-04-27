
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('pelatihan').del().then(function () {
    // Inserts seed entries
    return knex('pelatihan').insert([
      { "id": 1, "nama": "BST", "deskripsi": "Basic Safety Training", "waktu": 2, "biaya": "1000000", "prasyarat": '["KTP","SKES","IJAZAH","AKTE","FOTO"]' },
      { "id": 2, "nama": "AFF", "deskripsi": "Advance Fire Fighting", "waktu": 3, "biaya": "1025000", "prasyarat": '["KTP","SKES","IJAZAH","AKTE","FOTO"]' },
      { "id": 3, "nama": "MFA", "deskripsi": "Medical First Aid", "waktu": 4, "biaya": "745000", "prasyarat": '["KTP","SKES","IJAZAH","AKTE","FOTO"]' }
    ])
  });
};
