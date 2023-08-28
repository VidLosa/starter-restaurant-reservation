const knex = require("../db/connection");

async function create(reservation) {
    const createdRecords = await knex("reservations")
      .insert(reservation)
      .returning("*");
    return createdRecords[0];
  }

  module.exports = {
    create
  }