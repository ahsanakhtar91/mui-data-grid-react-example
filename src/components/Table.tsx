import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

function Table() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const initialPageSize = 10;
  const [pageSize, setPageSize] = useState(initialPageSize);

  const columnsToRender = [
    "match_id",
    "start_time",
    "duration",
    "first_blood_time",
    "radiant_score",
    "dire_score",
  ];

  const API_URL = `https://api.opendota.com/api/explorer?sql=select * from matches order by start_time desc limit 100 offset ${pageSize}`;

  useEffect(() => {
    const proceed = async () => {
      const response = await axios.get(API_URL);

      const columns = (response?.data?.fields ?? [])
        .filter((field: any) => {
          return columnsToRender?.includes(field.name);
        })
        .map((field: any) => {
          return {
            field: field.name,
            headerName: field.name?.replace(/_/gi, " ")?.toUpperCase(),
            width: 150,
          };
        });

      const rows = (response?.data?.rows ?? []).map((row: any) => {
        return {
          id: row.match_id,
          match_id: row.match_id,
          start_time: row.start_time,
          duration: row.duration,
          first_blood_time: row.first_blood_time,
          radiant_score: row.radiant_score,
          dire_score: row.dire_score,
        };
      });

      setRows(rows ?? []);
      setColumns(columns ?? []);
    };
    proceed();
  }, [pageSize]);

  return (
    <div>
      <div style={{ height: window.innerHeight - 300, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[pageSize]}
        />
      </div>

      <button onClick={() => setPageSize(pageSize + initialPageSize)}>
        Load More
      </button>
    </div>
  );
}

export default Table;
