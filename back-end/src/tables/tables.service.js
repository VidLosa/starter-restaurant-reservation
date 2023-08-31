const knex = require("../db/connection");

function read(table_id) {
    return knex("tables")
    .select("*")
    .where({ "table_id" : table_id})
    .first();
  }

function list() {
    return knex("tables").select("*").orderBy("table_name");
  }

async function create(table) {
    const createdRecords = await knex("tables").insert(table).returning("*");
    return createdRecords[0];
  }

async function update(table_id, reservation_id) {
  return knex.transaction(async (seat) => {
    try {
      //updates table
      const updatedTable = await seat("tables")
        .where({ table_id })
        .update({ reservation_id, occupied: true })
        .returning("*");
      //update reservations
      await seat("reservations")
        .where({ reservation_id })
        .update({ status: "seated " });

      return updatedTable;

    } catch (error) {
      throw error;
    }
  });
}

  module.exports = {
    list,
    read,
    create,
    update,
  }