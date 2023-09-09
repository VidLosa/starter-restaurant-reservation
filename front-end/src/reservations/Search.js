import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import axios from "axios";
import ReadReservation from "./ReadReservation";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Search() {
  const initialFormData = {
    mobile_number: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [reservation, setReservation] = useState([]);
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(null);

  function handleChange(event) {
    // Update the form data when the input changes
    let newFormData = { ...formData };
    newFormData[event.target.name] = event.target.value;
    setFormData(newFormData);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
    // Send a GET request to search for reservations based on mobile number
      const response = await axios.get(`${BASE_URL}/reservations?mobile_number=${formData.mobile_number}`, abortController.signal);
      const {data} = response.data
      setReservation(data)
      setLoaded(!loaded)
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error);
      }
    }
    return () => abortController.abort();
  }

  return (
    <div>
      <h1>Search for a reservation</h1>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          className="ml-2"
          id="mobile_number"
          name="mobile_number"
          type="text"
          placeholder="Enter a customer's phone number"
          required
          value={formData.mobile_number}
          onChange={handleChange}
        />
        <button className="ml-2" type="submit">
          Search
        </button>
      </form>
      <h2>Reservations</h2>
      {reservation.length && loaded ? reservation.map((r)=> <ReadReservation reservation={r} key={r.reservation_id} /> ) : ""}
      {loaded && !reservation.length ? <p>No reservations found</p> : null}
    </div>
  );
}

export default Search;