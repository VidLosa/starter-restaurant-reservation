const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./tables.service")
const reservationsService = require("../reservations/reservations.service")

function validName(field){
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body
    if (!value) {
      return next({
        status: 400,
        message: `${field} is missing`
      })
    }
    if (value.length < 2) {
      return next({
        status: 400,
        message: `${field} must be at least 2 characters`
      })
    }
    next()
  }
}

function validQuantity(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body
    if (!value) {
      return next({
        status: 400,
        message: `${field} must be at least 1`
      })
    }
    if (!Number.isInteger(value)) {
      return next({
        status: 400,
        message: `${field} must be an integer`,
      });
    }
    next();
  };
}

async function validCapacity(req, res, next) {
  if (!req.body.data) {
    return next({
      status: 400,
      message: "missing data"
    })
  }

  if (!req.body.data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is missing"
    })
  }

  const reservation = await reservationsService.read(
    req.body.data.reservation_id
  )

  if(!reservation) {
    return next({
      status: 404,
      message: `reservation ${req.body.data.reservation_id} not found`
    })
  }

  const table = await service.read(req.params.table_id)
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "Table capacity exceeded"
    })
  }
  next()
}

async function occupied(req, res, next) {
  const { table_id } = req.params
  const table = await service.read(table_id)

  if (table.reservation_id) {
    return next({
      status: 400,
      message: "Table is occupied"
    })
  }
  next()
}

async function reservationIsNotSeated(req, res, next) {
  const { reservation_id } = req.body.data
  const reservation = await reservationsService.read(reservation_id)

  if (reservation.status === "seated") {
    return next({
      status: 400,
      message: "Reservation is already seated"
    })
  }
  next()
}

async function list(req, res) {
  console.log("list")
  const data = await service.list()
  res.json({data})
}

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({ data: response });
}

async function update(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const response = await service.update(table_id, reservation_id);

  res.status(200).json({ data: response });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    validName("table_name"),
    validQuantity("capacity"),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validCapacity),
    asyncErrorBoundary(occupied),
    asyncErrorBoundary(reservationIsNotSeated),
    asyncErrorBoundary(update),
  ],
}