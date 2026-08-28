import React, { useEffect, useState } from "react";
import axios from "axios";
import LKGReportCard from "./LKGReportCard";
import Layout from "../components/Layout";

export default function ViewReport() {

    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [reportData, setReportData] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [locked, setLocked] = useState(false);
    const [academicYear, setAcademicYear] = useState("");
    const [studentType, setStudentType] = useState("active");

    // Load Classes
    useEffect(() => {

        axios
            .get(
                "https://lightblue-wolverine-671984.hostingersite.com/api/getMarksMeta.php"
            )
            .then(res => {

                if (res.data.classes) {
                    setClasses(res.data.classes);
                }

            })
            .catch(err => console.error(err));

    }, []);

    // Load Students By Class
    useEffect(() => {

        if (!selectedClass) {

            setStudents([]);
            return;

        }

        axios.get(
            `https://lightblue-wolverine-671984.hostingersite.com/api/getStudents.php?class=${selectedClass}&type=${studentType}`)
            .then(res => {

                if (res.data.status) {
                    setStudents(res.data.data || []);
                }

            })
            .catch(err => console.error(err));

    }, [selectedClass, studentType]);

    // Fetch Report
    const fetchReport = async () => {

        if (!studentId) {

            alert("Please select a student");
            return;

        }

        try {

            const res = await axios.get(
                `https://lightblue-wolverine-671984.hostingersite.com/api/get_lkg_report.php?student_id=${studentId}&academic_year=${academicYear}`
            );

            console.log("REPORT RESPONSE:", res.data);

            if (res.data.status) {

                const d = res.data.data;

                setReportData({

                    name: d.student?.name,
                    class: d.student?.class,
                    section: d.student?.section,
                    admission: d.student?.admission_no,

                    year: res.data.academic_year,

                    t1: d.term1 || {},
                    t2: d.term2 || {}

                });

                setLocked(res.data.locked || false);

            } else {

                alert(res.data.message || "No report found");

            }

        } catch (err) {

            console.error(err);
            alert("Failed to load report");

        }

    };

    // Lock Report
    const lockReport = async () => {

        try {

            const res = await axios.get(
                `https://lightblue-wolverine-671984.hostingersite.com/api/lock_lkg_report_card.php?student_id=${studentId}&academic_year=${reportData.year}`
            );

            alert(res.data.message);

            if (res.data.status) {
                setLocked(true);
            }

        } catch (err) {

            console.error(err);
            alert("Failed to lock report");

        }

    };

    // Unlock Report
    const unlockReport = async () => {

        try {

            const res = await axios.get(
                `https://lightblue-wolverine-671984.hostingersite.com/api/unlock_lkg_report_card.php?student_id=${studentId}&academic_year=${reportData.year}`
            );

            alert(res.data.message);

            if (res.data.status) {
                setLocked(false);
            }

        } catch (err) {

            console.error(err);
            alert("Failed to unlock report");

        }

    };

    return (
        <Layout>

            <div style={{ padding: "20px" }}>

                <h2>Nursery / LKG Report Card Viewer</h2>

                <br />

                {/* Class Dropdown */}
                <select
                    value={selectedClass}
                    onChange={(e) => {

                        setSelectedClass(e.target.value);
                        setStudentId("");
                        setReportData(null);
                        setLocked(false);

                    }}
                >
                    <option value="">
                        -- Select Class --
                    </option>

                    {classes.map(c => (
                        <option
                            key={c.id}
                            value={c.id}
                        >
                            {c.class_name}
                        </option>
                    ))}
                </select>

                <br /><br />
                
                {/* Student Dropdown */}
                <select
                    value={studentId}
                    disabled={!selectedClass}
                    onChange={(e) => {

                        setStudentId(e.target.value);
                        setReportData(null);
                        setLocked(false);

                    }}
                >
                    <option value="">
                        -- Select Student --
                    </option>

                    {students.map(s => (
                        <option
                            key={s.id}
                            value={s.id}
                        >
                            {s.name} ({s.section}) - {s.admission_no}
                        </option>
                    ))}
                </select>

                <br /><br />

                {/* Academic Year */}
                <select
                    value={academicYear}
                    onChange={(e) => {

                        setAcademicYear(e.target.value);
                        setReportData(null);
                        setLocked(false);

                    }}
                >
                    <option value="">
                        Current Year
                    </option>

                    <option value="2025-2026">
                        2025-2026
                    </option>

                    <option value="2024-2025">
                        2024-2025
                    </option>

                    <option value="2023-2024">
                        2023-2024
                    </option>
                </select>

                <br /><br />

                {/* Load Button */}
                <button onClick={fetchReport}>
                    Load Report
                </button>

                <br /><br />

                {/* Status */}
                {reportData && (
                    <div>

                        {locked ? (
                            <span
                                style={{
                                    color: "green",
                                    fontWeight: "bold"
                                }}
                            >
                                Report Status: FINALIZED
                            </span>
                        ) : (
                            <span
                                style={{
                                    color: "orange",
                                    fontWeight: "bold"
                                }}
                            >
                                Report Status: DRAFT
                            </span>
                        )}

                    </div>
                )}

                <br />

                {/* Lock / Unlock Buttons */}

                {reportData && !locked && (
                    <button onClick={lockReport}>
                        Lock Report
                    </button>
                )}

                {reportData && locked && (
                    <button onClick={unlockReport}>
                        Unlock Report
                    </button>
                )}

                <br /><br />

                {/* Report Card */}

                {reportData && (
                    <LKGReportCard data={reportData} />
                )}

            </div>

        </Layout>
    );
}