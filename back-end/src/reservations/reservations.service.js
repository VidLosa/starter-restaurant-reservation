const knex = require("../db/connection")

function list(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .andWhereNot({ status: "finished" })
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

function updateStatus(reservation_id, status) {
    return knex("reservations")
        .where({ reservation_id })
        .update({ status })
        .returning("*")
}

function update(reservation_id, reservation) {
    return knex("reservations")
      .where({ reservation_id })
      .update(reservation)
      .returning("*");
  }

function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date")
}

module.exports = {
    list,
    create,
    read,
    updateStatus,
    update,
    search,
};