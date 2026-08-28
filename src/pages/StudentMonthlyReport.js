import React, { useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";

function StudentMonthlyReport() {

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);

  const fetchReport = () => {
    axios.get(`${API_BASE}/getStudentMonthlyReport.php?class=${className}&section=${section}&month=${month}`)
      .then(res => {
        if (res.data.status) {

          alert(res.data.message);

        }
      });
  };

  return (
    <Layout>
      <h2>Monthly Attendance Report</h2>

      <input placeholder="Class"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <input placeholder="Section"
        value={section}
        onChange={(e) => setSection(e.target.value)}
      />

      <input type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <button onClick={fetchReport}>Generate</button>

      <br /><br />

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
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.days_present}</td>
              <td>{row.days_absent}</td>
              <td>{row.attendance_percentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>

    </Layout>
  );
}

export default StudentMonthlyReport;