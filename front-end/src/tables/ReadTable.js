import React from "react";


function ReadTable({ table }) {

  if (!table) {
    return <p>Loading...</p>;
  } else {
    return (
        <div className="border border-dark p-3 mb-2">
          <p>Table: {table.table_name}</p>
          <p data-table-id-status={table.table_id}>
            {" "}
            Status: {table.reservation_id === null ? "Free" : "Occupied"}
          </p>
        </div>
    );
  }
}

export default ReadTable;