
exports.up = function(knex) {
  return knex.schema.alterTable('pelatihan', function(t) {
    t.string('gambar')
  });
};

exports.down = function(knex) {
  return knex.schema.table('pelatihan', function (t) {
    t.dropColumn('gambar');
});
};
