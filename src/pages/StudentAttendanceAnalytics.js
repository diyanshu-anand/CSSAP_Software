import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import API_BASE from "../config";
import Layout from "../components/Layout";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function StudentAttendanceAnalytics() {

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [month, setMonth] = useState("");
  const [students, setStudents] = useState([]);
  const [average, setAverage] = useState(0);
  const [error, setError] = useState("");

  const fetchReport = async () => {

    if (!className || !month) {
      alert("Class and Month are required");
      return;
    }

    try {

      //  BUILD URL (section optional)
      const url = section
        ? `${API_BASE}/getStudentMonthlyReport.php?class=${className}&section=${section}&month=${month}`
        : `${API_BASE}/getStudentMonthlyReport.php?class=${className}&month=${month}`;

      console.log("API URL:", url);

      const res = await axios.get(url);

      console.log("API RESPONSE:", res.data);

      if (res.data.status) {
        setStudents(res.data.data || []);
        setAverage(res.data.average || 0);
        setError("");
      } else {
        setStudents([]);
        setAverage(0);
        setError(res.data.error || "No data found");
      }

    } catch (err) {
      console.error("API ERROR:", err);
      setError("Failed to fetch data");
      setStudents([]);
      setAverage(0);
    }
  };

  const chartData = {
    labels: students.map(s => s.name),
    datasets: [
      {
        label: "Attendance %",
        data: students.map(s => Number(s.attendance_percentage)),
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }
    ]
  };

  const below75 = students.filter(
    s => Number(s.attendance_percentage) < 75
  ).length;

  return (
    <Layout>
      <h2>Monthly Attendance Analytics</h2>

      <input
        placeholder="Class"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <input
        placeholder="Section (optional)"
        value={section}
        onChange={(e) => setSection(e.target.value)}
      />

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <button onClick={fetchReport}>Generate Report</button>

      <br /><br />

      {/* ❗ ERROR DISPLAY */}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {students.length > 0 && (
        <>
          <div style={{ display: "flex", gap: "20px" }}>
            <div>📊 Average Attendance: <b>{average}%</b></div>
            <div>⚠ Students Below 75%: <b>{below75}</b></div>
            <div>👥 Total Students: <b>{students.length}</b></div>
          </div>

          <br />

          <Bar data={chartData} />

          <br />

          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Name</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i}>
                  <td>{s.name}</td>
                  <td>{s.days_present}</td>
                  <td>{s.days_absent}</td>
                  <td>{s.attendance_percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

    </Layout>
  );
}

export default StudentAttendanceAnalytics;