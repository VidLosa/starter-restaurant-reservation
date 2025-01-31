exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.string("first_name").notNull();
    table.string("last_name").notNull();
    table.string("mobile_number").notNull();
    table.date("reservation_date").notNull();
    table.time("reservation_time").notNull();
    table.integer("people").notNull().unsigned();
    table.string("status").notNullable().defaultTo("booked");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
