import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";

function TeacherAttendanceView() {

  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    axios
      .get(`${API_BASE}/getTeacherAttendance.php`)
      .then((res) => {

        if (res.data.status) {
          setAttendance(res.data.data);
        }

      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // ======================
  // FILTER SEARCH
  // ======================

  const filteredAttendance = attendance.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  // ======================
  // STATUS COLORS
  // ======================

  const getStatusStyle = (status) => {

    switch (status) {

      case "Present":
        return {
          background: "#d4edda",
          color: "#155724"
        };

      case "Absent":
        return {
          background: "#f8d7da",
          color: "#721c24"
        };

      case "Half Day":
        return {
          background: "#fff3cd",
          color: "#856404"
        };

      case "Weekly Off":
        return {
          background: "#d1ecf1",
          color: "#0c5460"
        };

      case "Machine Error":
        return {
          background: "#e2e3e5",
          color: "#383d41"
        };

      default:
        return {
          background: "#f1f1f1",
          color: "#333"
        };
    }
  };

  return (

    <Layout>

      <div style={containerStyle}>

        {/* ====================== */}
        {/* HEADER */}
        {/* ====================== */}

        <div style={headerStyle}>

          <div>
            <h1 style={titleStyle}>
              Teacher Attendance
            </h1>

            <p style={subtitleStyle}>
              View and manage attendance records
            </p>
          </div>

          <div style={countCardStyle}>
            {filteredAttendance.length} Records
          </div>

        </div>

        {/* ====================== */}
        {/* SEARCH */}
        {/* ====================== */}

        <div style={searchWrapperStyle}>

          <input
            type="text"
            placeholder="Search teacher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchInputStyle}
          />

        </div>

        {/* ====================== */}
        {/* TABLE */}
        {/* ====================== */}

        <div style={tableWrapperStyle}>

          <table style={tableStyle}>

            <thead>

              <tr>

                <th style={thStyle}>Teacher</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>In Time</th>
                <th style={thStyle}>Out Time</th>
                <th style={thStyle}>Hours</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Deduction</th>

              </tr>

            </thead>

            <tbody>

              {filteredAttendance.length > 0 ? (

                filteredAttendance.map((row, index) => (

                  <tr
                    key={index}
                    style={
                      index % 2 === 0
                        ? evenRowStyle
                        : oddRowStyle
                    }
                  >

                    <td style={tdStyle}>
                      {row.name}
                    </td>

                    <td style={tdStyle}>
                      {row.attendance_date}
                    </td>

                    <td style={tdStyle}>
                      {row.in_time || "-"}
                    </td>

                    <td style={tdStyle}>
                      {row.out_time || "-"}
                    </td>

                    <td style={tdStyle}>
                      {row.working_hours || 0}
                    </td>

                    <td style={tdStyle}>

                      <span
                        style={{
                          ...statusBadgeStyle,
                          ...getStatusStyle(row.status)
                        }}
                      >
                        {row.status}
                      </span>

                    </td>

                    <td style={tdStyle}>

                      <span
                        style={{
                          color:
                            row.salary_deduction > 0
                              ? "#dc3545"
                              : "#28a745",
                          fontWeight: "600"
                        }}
                      >
                        ₹{row.salary_deduction}
                      </span>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    style={emptyStyle}
                  >
                    No attendance records found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </Layout>
  );
}

// ======================
// STYLES
// ======================

const containerStyle = {
  padding: "25px",
  background: "#f4f7fb",
  minHeight: "100vh"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
  flexWrap: "wrap",
  gap: "15px"
};

const titleStyle = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "700",
  color: "#1e293b"
};

const subtitleStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "15px"
};

const countCardStyle = {
  background: "#2563eb",
  color: "#fff",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "600",
  fontSize: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const searchWrapperStyle = {
  marginBottom: "20px"
};

const searchInputStyle = {
  width: "100%",
  maxWidth: "350px",
  padding: "12px 16px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "15px",
  background: "#fff"
};

const tableWrapperStyle = {
  overflowX: "auto",
  background: "#fff",
  borderRadius: "18px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "900px"
};

const thStyle = {
  background: "#1e293b",
  color: "#fff",
  padding: "16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600",
  position: "sticky",
  top: 0
};

const tdStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "14px",
  color: "#334155"
};

const evenRowStyle = {
  background: "#ffffff"
};

const oddRowStyle = {
  background: "#f8fafc"
};

const statusBadgeStyle = {
  padding: "6px 12px",
  borderRadius: "30px",
  fontSize: "13px",
  fontWeight: "600",
  display: "inline-block"
};

const emptyStyle = {
  textAlign: "center",
  padding: "30px",
  color: "#64748b",
  fontSize: "15px"
};

export default TeacherAttendanceView;