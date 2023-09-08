import React from "react";

function ReservationForm({error, handleSubmit, handleCancel, reservation, formData, setFormData}){

  function handleChange(event) {
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                className="form-control"
                id="first_name"
                name="first_name"
                type="text"
                onChange={handleChange}
                value={formData.first_name}
                required
                />
                <label htmlFor="last_name">Last Name</label>
                <input
                className="form-control"
                id="last_name"
                name="last_name"
                type="text"
                onChange={handleChange}
                value={formData.last_name}
                required
                />
                <label htmlFor="mobile_number">Mobile Number</label>
                <input
                className="form-control"
                id="mobile_number"
                name="mobile_number"
                type="tel"
                onChange={handleChange}
                value={formData.mobile_number}
                required
                />
                <label htmlFor="reservation_date">Reservation Date</label>
                <input
                className="form-control"
                id="reservation_date"
                name="reservation_date"
                type="date"
                onChange={handleChange}
                value={formData.reservation_date}
                required
                />
                <label htmlFor="reservation_time">Reservation Time</label>
                <input
                className="form-control"
                id="reservation_time"
                name="reservation_time"
                type="time"
                onChange={handleChange}
                value={formData.reservation_time}
                required
                />
                <label htmlFor="people">Number of People</label>
                <input
                className="form-control"
                id="people"
                name="people"
                type="number"
                onChange={handleChange}
                value={formData.people}
                required
                />
            </div>
            <button type="submit" className="btn btn-primary mr-2">
                Submit
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
            </button>
        </form>
    </div>
)
}

export default ReservationForm