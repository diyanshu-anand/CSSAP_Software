import React, { useEffect, useState } from "react";
import axios from "axios";
import HighSchoolReportCard from "./HighSchoolReportCard";
import html2pdf from "html2pdf.js";
import Layout from "../components/Layout";
import "./View_High_Report_card.css";

export default function ViewReport_High_School() {

    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState("");
    const [reportData, setReportData] = useState(null);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [academicYear, setAcademicYear] = useState("2025-2026");
    const [studentType, setStudentType] = useState("active");

    const downloadPDF = async () => {

        if (!reportData || !reportData.student) {
            alert("Load report first");
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        const element = document.querySelector(".report-box");

        html2pdf().set({
            margin: 0,
            filename: `${reportData.student.name.replace(/\s+/g, "_")}_ReportCard.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true
            },
            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            },
            pagebreak: { mode: ["css", "legacy"] }
        }).from(element).save();
    };

    /* LOAD CLASSES */

    useEffect(() => {

        axios
            .get("https://lightblue-wolverine-671984.hostingersite.com/api/getMarksMeta.php")
            .then(res => {

                if (res.data.classes) {
                    setClasses(res.data.classes);
                }

            })
            .catch(err => console.error(err));

    }, []);

    /* LOAD STUDENTS */

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

    /* FETCH REPORT */

    const fetchReport = async () => {

        if (!studentId) {
            alert("Select student properly");
            return;
        }

        try {

            /* STEP 1
               CHECK SAVED SNAPSHOT
            */

            const savedRes = await axios.get(
                `https://lightblue-wolverine-671984.hostingersite.com/api/getSavedReportCard.php?student_id=${studentId}&academic_year=${academicYear}`
            );

            console.log("SAVED REPORT:", savedRes.data);

            if (
                savedRes.data.status === true &&
                savedRes.data.report &&
                savedRes.data.report.snapshot
            ) {

                const snapshot =
                    JSON.parse(savedRes.data.report.snapshot);

                snapshot.saved = savedRes.data.report;

                setReportData(snapshot);

                return;
            }

            /* STEP 2
               GENERATE LIVE REPORT
            */

            const res = await axios.get(
                `https://lightblue-wolverine-671984.hostingersite.com/api/getReportCard.php?student_id=${studentId}&academic_year=${academicYear}`
            );

            console.log("LIVE REPORT:", res.data);

            if (res.data.status === true) {

                setReportData(res.data);

            } else {

                alert("No report found");

            }

        } catch (err) {

            console.error(err);

            alert("Unable to load report");

        }
    };

    return (

        <Layout>

            <div style={{ padding: 20 }}>

                <h2>Select Student</h2>

                {/* CLASS */}

                <select
                    value={selectedClass}
                    onChange={(e) => {

                        setSelectedClass(e.target.value);
                        setStudentId("");
                        setReportData(null);

                    }}
                >

                    <option value="">
                        -- Select Class --
                    </option>

                    {classes.map(c => {

                        const cleanClass =
                            c.class_name
                                .replace("Class ", "")
                                .trim();

                        return (
                            <option
                                key={c.id}
                                value={cleanClass}
                            >
                                {c.class_name}
                            </option>
                        );
                    })}

                </select>

                {/* ACADEMIC YEAR */}

                <select
                    value={academicYear}
                    onChange={(e) => {

                        setAcademicYear(e.target.value);
                        setReportData(null);

                    }}
                >

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

                {/* Student classification */}
                <select
                    value={studentType}
                    onChange={(e) => {

                        setStudentType(e.target.value);
                        setStudentId("");
                        setReportData(null);
                        // setLocked(false);

                    }}
                >
                    <option value="active">
                        Current Students
                    </option>

                    <option value="inactive">
                        TC / Passout Students
                    </option>
                </select>


                {/* STUDENT */}

                <select
                    value={studentId}
                    onChange={(e) => {

                        setStudentId(e.target.value);
                        setReportData(null);

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
                            {s.name}
                        </option>

                    ))}

                </select>

                {/* LOAD REPORT */}

                <button
                    onClick={fetchReport}
                >
                    Load Report
                </button>

                {/* REPORT */}

                {reportData && (

                    <HighSchoolReportCard
                        data={reportData}
                        refreshData={fetchReport}
                    />

                )}

            </div>

        </Layout>

    );
}