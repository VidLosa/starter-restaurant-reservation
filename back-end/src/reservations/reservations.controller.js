/**
 * List handler for reservation resources
 */

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require(".reservations.service")

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Reservation must include a ${propertyName}` });
  };
}

function phoneNumberValidator(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body
  if (value.replace(/[^0-9]/g, "").length !==10) {
    return next({
      status: 400,
      message: `${field} must be a valid phone number`
    });
  }

  next()
  }
  };

function timeValidator(field) {
  return function (req, res, next) {
    const {data: { [field]: value } = {} } = req.body
    const timeCheck = /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;

    if(!timeCheck.test(value)) {
      return next({
        status: 400,
        message: `${field} must be a valid time`,
      })
    }
    next()
  }
}

function dateValidator(field) {
  return function (req, res, next) {
    const { data: { [field]: value } = {} } = req.body
    const { reservation_time } = req.body.data
    let date = new Date(value + " " + reservation_time)

    if (isNaN(date)){
      return next({
        status: 400,
        message: `${field} must be a valid date`,
      })
    }

  }

}

function peopleValidator(field) {
  return function (req, _res, next) {
    const { data: { [field]: value } = {} } = req.body;

    if (typeof value !== "number") {
      return next({
        status: 400,
        message: `${field} must be a number`,
      });
    }
    if (value < 1) {
      return next({
        status: 400,
        message: `${field} must be at least 1`,
      });
    }
    next();
  };
}

module.exports = {
  create: [
    ...[
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ].map(bodyDataHas),
    phoneNumberValidator("mobile_number"),
    timeValidator("reservation_time"),
    dateValidator("reservation_date"),
    peopleValidator("people"),
    asyncErrorBoundary(create),
  ],
}
