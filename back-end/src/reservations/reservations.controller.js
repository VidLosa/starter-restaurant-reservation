const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const service = require("./reservations.service")

/**
 * List handler for reservation resources
 */

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params
  const reservation = await service.read(reservation_id)

  if (reservation) {
    res.locals.reservation = reservation
    return next()
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found.`,
  })
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `${propertyName} is missing.` });
  };
}

function phoneNumberIsValid(field) {
  return function (req, _res, next) {
    const { data: { [field]: value } = {} } = req.body;
    if (value.replace(/[^0-9]/g, "").length !== 10) {
      return next({
        status: 400,
        message: `${field} must be a valid phone number`,
      });
    }
    next();
  };
}

function timeIsValid(field) {
  return function (req, res, next) {
    const { data: {[field]: value} = {} } =req.body;
    const timeCheck = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

    if(!value.match(timeCheck)) {
      return next({
        status: 400,
        message: `${field} must be a valid time.`
      })
    }
    if (value < "10:30" || value > "21:30") {
      return next({
        status: 400,
        message: `${field} must be between 10:30 and 21:30`,
      });
    }
    next()
  }
}

function dateIsValid(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body;
    const { reservation_time } = req.body.data;
    let date = new Date(value + " " + reservation_time);

    if(isNaN(date)) {
      return next({
        status: 400,
        message: `${field} must be a valid date.`
      });
    }
    if (date.getDay() === 2) {
      return next({
        status: 400,
        message: `closed`,
      });
    }
    if (date.getTime() < new Date().getTime()) {
      return next({
        status: 400,
        message: `${field} must be in the future`,
      });
    }

    next();
  };
}

function dateCheck(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body

    const date = new Date(value)

    if(isNaN(date)) {
      return next({
        status: 400, 
        message: `${field} must be s valid date.`,
      })
    }
    next()
  }
}

function peopleIsValid(field) {
  return function (req, res, next) {
  const { data: { [field]:value } = {} } = req.body;

  if(typeof value !== "number") {
    return next({
      status: 400,
      message: `${field} must be a number.`,
    });
  }

  if (value < 1) {
    return next ({
      status: 400,
      message: `${field} must be at least 1.`,
    });
  }
  next();
  };
}

function createStatus(field) {
  return function (req, res, next) {
    const {data: {[field]: value } = {} } = req.body
    if (value === "seated" || value === "finished") {
      return next({
        status: 400,
        message: `${field} cannot be seated or finished`,
      })
    }
    next()
  }
}

function finishedStatusCheck(req, res, next) {
  const { reservation: { status } = {} } = res.locals
  if (status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    })
  }
  next()
}

function statusCheck(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body

    if (value === "unknown") {
      return next({
        status: 400,
        message: `${field} cannot be ${value}`
      })
    }
    next()
  }
}

async function list(req, res) {
  const { date, mobile_number } = req.query;

  let data;
  if (date) {
    data = await service.list(date);
  } else if (mobile_number) {
    data = await service.search(mobile_number)
  }
  res.json({ data });
}

async function create(req, res) {
  const response = await service.create(req.body.data);
  res.status(201).json({
    data: response,
  });
}

async function read(req, res) {
  const { reservation_id } = res.locals.reservation
  const data = await service.read(reservation_id)
  res.json({ data })
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation
  const { status } = req.body.data

  const response = await service.updateStatus(reservation_id, status)

  res.status(200).json({ data: response[0] })
}

async function update(req, res) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data
  const { reservation_id } = res.locals.reservation
  const updatedReservation = {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  }
  const response = await service.update(
    reservation_id,
    updatedReservation
  )
  res.status(200).json({ data: response[0] })
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    phoneNumberIsValid("mobile_number"),
    timeIsValid("reservation_time"),
    dateIsValid("reservation_date"),
    peopleIsValid("people"),
    createStatus("status"),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    finishedStatusCheck,
    statusCheck("status"),
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    phoneNumberIsValid("mobile_number"),
    dateCheck("reservation_date"),
    timeIsValid("reservation_time"),
    peopleIsValid("people"),
    asyncErrorBoundary(update),
  ]
};