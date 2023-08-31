const knex = require("../db/connection")

function list(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time");
  }

async function create(reservation) {
    const createdReservations = await knex("reservations")
        .insert(reservation)
        .returning("*");
    return createdReservations[0];    
}

function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first();
  }

module.exports = {
    list,
    create,
    read,
};