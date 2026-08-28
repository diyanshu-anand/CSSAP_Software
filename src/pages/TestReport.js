import React from "react";
import LKGReportCard from "./LKGReportCard";

export default function TestReport() {

  const dummyData = {
    name: "Rahul Kumar",
    father: "Ramesh Kumar",
    mother: "Sita Devi",
    class: "LKG",
    section: "A",
    roll: "12",
    admission: "A102",
    dob: "01-01-2020",
    address: "Bilaspur",
    year: "2025-26",

    working_days: 100,
    present_days: 90,
    absent_days: 10,
    attendance_percent: 90,

    t1: {
      eng_reading: "A1",
      eng_writing: "A2",
      cc_art: "A1",
      pt_confidence: "B1"
    },

    t2: {
      eng_reading: "A2",
      eng_writing: "A1",
      cc_art: "A2",
      pt_confidence: "A2"
    }
  };

  return <LKGReportCard data={dummyData} />;
}