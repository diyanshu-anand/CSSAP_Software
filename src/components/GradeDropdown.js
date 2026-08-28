import React from "react";

const grades = ["A1","A2","B1","B2","C1","C2","D"];

export default function GradeDropdown({ value, onChange }) {
  return (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select</option>
      {grades.map((g) => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  );
}