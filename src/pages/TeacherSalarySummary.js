import React, { useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";

function TeacherSalarySummary() {

  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ======================
  // FETCH SUMMARY
  // ======================

  const fetchSummary = () => {

    if (!month) {
      alert("Please select month");
      return;
    }

    setLoading(true);

    axios
      .get(
        `${API_BASE}/getTeacherMonthlySummary.php?month=${month}`
      )
      .then((res) => {

        if (res.data.status) {

          setData(res.data.data);

        } else {

          setData([]);
        }

      })
      .catch((err) => {

        console.log(err);

      })
      .finally(() => {

        setLoading(false);

      });
  };

  // ======================
  // TOTALS
  // ======================

  const totalGross = data.reduce(
    (sum, row) =>
      sum + Number(row.gross_salary || 0),
    0
  );

  const totalDeduction = data.reduce(
    (sum, row) =>
      sum + Number(row.total_deduction || 0),
    0
  );

  const totalNet = data.reduce(
    (sum, row) =>
      sum + Number(row.net_salary || 0),
    0
  );

  return (

    <Layout>

      <div style={containerStyle}>

        {/* ====================== */}
        {/* HEADER */}
        {/* ====================== */}

        <div style={headerStyle}>

          <div>

            <h1 style={titleStyle}>
              Teacher Salary Summary
            </h1>

            <p style={subtitleStyle}>
              Monthly payroll and attendance analytics
            </p>

          </div>

          <div style={summaryCardStyle}>
            {data.length} Teachers
          </div>

        </div>

        {/* ====================== */}
        {/* FILTER SECTION */}
        {/* ====================== */}

        <div style={filterWrapperStyle}>

          <div style={inputGroupStyle}>

            <label style={labelStyle}>
              Select Month
            </label>

            <input
              type="month"
              value={month}
              onChange={(e) =>
                setMonth(e.target.value)
              }
              style={inputStyle}
            />

          </div>

          <button
            onClick={fetchSummary}
            style={buttonStyle}
          >

            {loading
              ? "Generating..."
              : "Generate Summary"}

          </button>

        </div>

        {/* ====================== */}
        {/* SUMMARY CARDS */}
        {/* ====================== */}

        {data.length > 0 && (

          <div style={cardsWrapperStyle}>

            <div style={cardStyle}>

              <h3 style={cardTitleStyle}>
                Gross Salary
              </h3>

              <p style={cardValueStyle}>
                ₹{totalGross.toFixed(2)}
              </p>

            </div>

            <div style={cardStyle}>

              <h3 style={cardTitleStyle}>
                Total Deduction
              </h3>

              <p
                style={{
                  ...cardValueStyle,
                  color: "#dc2626"
                }}
              >
                ₹{totalDeduction.toFixed(2)}
              </p>

            </div>

            <div style={cardStyle}>

              <h3 style={cardTitleStyle}>
                Net Salary
              </h3>

              <p
                style={{
                  ...cardValueStyle,
                  color: "#16a34a"
                }}
              >
                ₹{totalNet.toFixed(2)}
              </p>

            </div>

          </div>

        )}

        {/* ====================== */}
        {/* TABLE */}
        {/* ====================== */}

        <div style={tableWrapperStyle}>

          <table style={tableStyle}>

            <thead>

              <tr>

                <th style={thStyle}>Teacher</th>
                <th style={thStyle}>Gross</th>
                <th style={thStyle}>Present</th>
                <th style={thStyle}>Half Day</th>
                <th style={thStyle}>Absent</th>
                <th style={thStyle}>Deduction</th>
                <th style={thStyle}>Net Salary</th>

              </tr>

            </thead>

            <tbody>

              {data.length > 0 ? (

                data.map((row, index) => (

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
                      ₹{row.gross_salary}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={presentBadgeStyle}
                      >
                        {row.present_days}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={halfBadgeStyle}
                      >
                        {row.half_days}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={absentBadgeStyle}
                      >
                        {row.absent_days}
                      </span>
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        color: "#dc2626",
                        fontWeight: "600"
                      }}
                    >
                      ₹{row.total_deduction}
                    </td>

                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "700",
                        color: "#16a34a"
                      }}
                    >
                      ₹{row.net_salary}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    style={emptyStyle}
                  >

                    {loading
                      ? "Loading..."
                      : "No data available"}

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

const summaryCardStyle = {
  background: "#2563eb",
  color: "#fff",
  padding: "12px 22px",
  borderRadius: "12px",
  fontWeight: "600",
  fontSize: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const filterWrapperStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "end",
  flexWrap: "wrap",
  marginBottom: "25px",
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px"
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#334155"
};

const inputStyle = {
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none"
};

const buttonStyle = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "10px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  height: "45px"
};

const cardsWrapperStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "18px",
  marginBottom: "25px"
};

const cardStyle = {
  background: "#fff",
  padding: "22px",
  borderRadius: "18px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
};

const cardTitleStyle = {
  margin: 0,
  fontSize: "15px",
  color: "#64748b",
  fontWeight: "600"
};

const cardValueStyle = {
  marginTop: "10px",
  fontSize: "28px",
  fontWeight: "700",
  color: "#1e293b"
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
  minWidth: "950px"
};

const thStyle = {
  background: "#1e293b",
  color: "#fff",
  padding: "16px",
  textAlign: "left",
  fontSize: "14px",
  fontWeight: "600"
};

const tdStyle = {
  padding: "15px 16px",
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

const presentBadgeStyle = {
  background: "#dcfce7",
  color: "#166534",
  padding: "5px 10px",
  borderRadius: "30px",
  fontWeight: "600",
  fontSize: "13px"
};

const halfBadgeStyle = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "5px 10px",
  borderRadius: "30px",
  fontWeight: "600",
  fontSize: "13px"
};

const absentBadgeStyle = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "5px 10px",
  borderRadius: "30px",
  fontWeight: "600",
  fontSize: "13px"
};

const emptyStyle = {
  textAlign: "center",
  padding: "35px",
  color: "#64748b",
  fontSize: "15px"
};

export default TeacherSalarySummary;