
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('pendaftaran').del().then(function () {
    return knex('pendaftaran').insert([
      {
        id: 1,
        kode: 'YU182U1',
        pelatihan: 1,
        jadwal: 1,
        peserta: 1,
        bank: 'bni',
        buktiPembayaran: 'YU182U1.jpg',
        cekBiodata: 0,
        cekPembayaran: 0
      },
    ]);
  });
};
