import React, { useState } from "react";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
require("dotenv").config();
const BASE_URL = process.env.REACT_APP_API_BASE_URL


function ReadTable({ table }) {

    const history = useHistory();
    const [error, setError] = useState(null);

    async function handleFinish(event) {
        event.preventDefault();
        const abortController = new AbortController();
    
        if (
          window.confirm(
            "Is this table ready to seat new guests? This cannot be undone."
          )
        ) {
          try {
            await axios.put(
              `${BASE_URL}/reservations/${table.reservation_id}/status`,
              {data: { status: "finished" } }, abortController.signal
            );
            await axios.delete(
              `${BASE_URL}/tables/${table.table_id}/seat`, abortController.signal
            );
            history.push("/");
          } catch (error) {
            if (error.name !== "AbortError") {
              setError(error);
            }
          }
          return () => abortController.abort();
        }
      }

  if (!table) {
    return <p>Loading...</p>;
  } else {
    return (
      <div>
        <ErrorAlert error={error} />
        <div className="border border-dark p-3 mb-2">
          <p>Table: {table.table_name}</p>
          <p data-table-id-status={table.table_id}>
            {" "}
            Status: {table.reservation_id === null ? "Free" : "Occupied"}
          </p>
          {table.reservation_id !== null ? (
            <button
              data-table-id-finish={table.table_id}
              onClick={handleFinish}
            >
              Finish
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default ReadTable;