
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('peserta').del().then(function () {
    return knex('peserta').insert([
      {
        id: 3,
        email: "john.doe@gmail.com",
        phone: "081234567",
        ktp: "1238100002",
        nisn: "283818181",
        nama: "john doe",
        agama: "islam",
        gender: "pria",
        warga: "wni",
        tempatLahir: "yogyakarta",
        tanggalLahir: "",
        alamat: "Jl. Asri Gg. Beo No.92",
        provinsi: "ACEH",
        kabupaten: "KABUPATEN SIMEULUE",
        kecamatan: "TEUPAH SELATAN",
        kelurahan: "LATIUNG",
        ayah: "tony",
        ibu: "camile",
        rt: "02",
        rw: "12",
        kodepos: "5192922"
      }
    ]);
  });
};
