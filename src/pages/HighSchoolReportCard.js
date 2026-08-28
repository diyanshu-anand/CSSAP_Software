import React, { useState } from "react";
import { useEffect } from "react";
import "./highreport.css";
import Logo from "../assets/ABM_Logo.jpg";
import Layout from "../components/Layout";
import html2pdf from "html2pdf.js";
import PrincipalSign from "../assets/rotated-removebg-preview.png"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function HighSchoolReportCard({ data }) {

    if (!data || !data.student) {
        return <div>Loading...</div>;
    }

    // const { student, data: subjects } = data;
    const API_BASE = "https://lightblue-wolverine-671984.hostingersite.com/"

    const student = data?.student || data?.saved?.snapshot?.student || {};
    const subjects = data?.data || data?.saved?.snapshot?.data || [];

    const fetchData = async () => {
        const res = await fetch(API);
        const json = await res.json();
        setData(json);
    };


    // Attendance from backend
    // const attendance = data?.saved?.snapshot?.attendance || data?.attendance || [];
    const attendance = data?.attendance || [];

    const validSubjects = subjects.filter(s => {
        const t1 = s.term1 || {};
        const t2 = s.term2 || {};

        const hasT1 =
            t1.pt != null || t1.nb != null || t1.se != null || t1.exam != null;

        const hasT2 =
            t2.pt != null || t2.nb != null || t2.se != null || t2.exam != null;

        return hasT1 || hasT2;
    });

    // Extract term-wise data
    const term1 = attendance.find(a => Number(a.term) === 1) || {};
    const term2 = attendance.find(a => Number(a.term) === 2) || {};

    // Total working days
    const term1WorkingDays =
        Number(term1.present_days || 0) + Number(term1.absent_days || 0);

    const term2WorkingDays =
        Number(term2.present_days || 0) + Number(term2.absent_days || 0);

    // ECA based defination
    const eca = data?.saved?.snapshot?.eca || data?.eca || [];

    // Session years (fallback if not provided)
    // const fromYear = data?.fromYear || "2024";
    // const toYear = data?.toYear || "2025";

    let fromYear = "----";
    let toYear = "----";

    if (data?.academic_year) {
        const parts = data.academic_year.split("-");
        fromYear = parts[0];
        toYear = parts[1];
    }

    // Calculate totals
    let t1Total = 0;
    let t2Total = 0;

    if (subjects.length > 0) {
        subjects.forEach(s => {
            t1Total += s.term1?.marks_obtained || 0;
            t2Total += s.term2?.marks_obtained || 0;
        });
    }

    const getGrade = (marks) => {
        if (marks >= 91) return "A1";
        if (marks >= 81) return "A2";
        if (marks >= 71) return "B1";
        if (marks >= 61) return "B2";
        if (marks >= 51) return "C1";
        if (marks >= 41) return "C2";
        if (marks >= 33) return "D";
        return "F";
    };

    let term1GrandTotal = 0;
    let term2GrandTotal = 0;

    // let subjectCount = subjects.length;
    let subjectCount = validSubjects.length;

    validSubjects.forEach(s => {
        const t1 = s.term1 || {};
        const t2 = s.term2 || {};

        const t1Total =
            (t1.pt || 0) +
            (t1.nb || 0) +
            (t1.se || 0) +
            (t1.exam || 0);

        const t2Total =
            (t2.pt || 0) +
            (t2.nb || 0) +
            (t2.se || 0) +
            (t2.exam || 0);

        term1GrandTotal += t1Total;
        term2GrandTotal += t2Total;
    });

    // Each subject is out of 100
    const validTerm1Subjects = validSubjects.filter(s => {
        const t1 = s.term1 || {};
        return t1.pt != null || t1.nb != null || t1.se != null || t1.exam != null;
    });

    const validTerm2Subjects = validSubjects.filter(s => {
        const t2 = s.term2 || {};
        return t2.pt != null || t2.nb != null || t2.se != null || t2.exam != null;
    });

    const term1Max = validTerm1Subjects.length * 100;
    const term2Max = validTerm2Subjects.length * 100;

    const term1Percentage =
        term1Max > 0 ? ((term1GrandTotal / term1Max) * 100).toFixed(2) : 0;

    const term2Percentage =
        term2Max > 0 ? ((term2GrandTotal / term2Max) * 100).toFixed(2) : 0;

    const finalPercentage =
        ((Number(term1Percentage) + Number(term2Percentage)) / 2).toFixed(2);

    const isPass = finalPercentage >= 33;

    const nextClassMap = {
        "LKG": "UKG",
        "UKG": "1",
        "Class 1": "2",
        "Class 2": "3",
        "Class 3": "4",
        "Class 4": "5",
        "Class 5": "6",
        "Class 6": "7",
        "Class 7": "8",
        "Class 8": "9",
        "Class 9": "10",
        "Class 10": "11",
        "Class 11": "12"
    };

    const nextClass = nextClassMap[student.class] || "";

    const [remarks, setRemarks] = useState("");
    const [ptmRecords, setPtmRecords] = useState([
        { date: "", present: "" },
        { date: "", present: "" },
        { date: "", present: "" },
        { date: "", present: "" }
    ]);

    const [healthRecords, setHealthRecords] = useState({
        term1: { height: "", weight: "", dental: "", general: "" },
        term2: { height: "", weight: "", dental: "", general: "" }
    });

    // graph related function
    const labels = validSubjects.map(s => s.subject);

    const term1Data = validSubjects.map(s => {
        const t1 = s.term1 || {};
        return (t1.pt || 0) + (t1.nb || 0) + (t1.se || 0) + (t1.exam || 0);
    });

    const term2Data = validSubjects.map(s => {
        const t2 = s.term2 || {};
        return (t2.pt || 0) + (t2.nb || 0) + (t2.se || 0) + (t2.exam || 0);
    });

    const chartData = {
        labels,
        datasets: [
            {
                label: "Term I",
                data: term1Data,
                backgroundColor: "rgba(255, 105, 180, 0.7)",   // pink
                borderColor: "rgba(255, 105, 180, 1)",
                borderWidth: 1,

                barThickness: 18,        //  controls exact width
                maxBarThickness: 20      // safety cap
            },
            {
                label: "Term II",
                data: term2Data,
                backgroundColor: "rgba(135, 206, 235, 0.7)",   // sky blue
                borderColor: "rgba(70, 130, 180, 1)",
                borderWidth: 0.5,

                barThickness: 18,
                maxBarThickness: 20
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        devicePixelRatio: 1,
        animation: false,

        datasets: {
            bar: {
                categoryPercentage: 0.6,   //  space between groups
                barPercentage: 0.7         //  space inside group
            }
        },

        plugins: {
            legend: {
                position: "top",
                labels: {
                    font: {
                        size: 14,
                        weight: "bold"
                    }
                }
            },
            title: {
                display: true,
                text: "Subject-wise Performance",
                font: {
                    size: 18,
                    weight: "bold"
                }
            }
        },

        scales: {
            x: {
                ticks: { font: { size: 12 } },
                grid: { display: false }
            },
            y: {
                beginAtZero: true,
                ticks: { font: { size: 12 } },
                grid: { color: "#ddd" }
            }
        }
    };

    const [isPDF, setIsPDF] = useState(false)

    const downloadPDF = async () => {

        if (!data || !data.student) {
            alert("No data available");
            return;
        }

        // wait for chart render
        await new Promise(resolve => setTimeout(resolve, 500));

        // 1. Enable PDF mode
        setIsPDF(true);

        // 2. WAIT for React to re-render properly
        await new Promise(resolve => requestAnimationFrame(resolve));
        await new Promise(resolve => requestAnimationFrame(resolve));

        // 3. Extra safety delay (important for charts + DOM)
        await new Promise(resolve => setTimeout(resolve, 300));


        const element = document.querySelector(".report-box");

        html2pdf().set({
            margin: [0, 0, 0, 0],
            filename: `${data.student.name.replace(/\s+/g, "_")}_ReportCard.pdf`,

            image: { type: "jpeg", quality: 0.98 },

            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                scrollY: 0
            },

            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            },

            pagebreak: {
                mode: ["legacy"],
                // avoid: ["tr", "table"]
            }

        }).from(element).save();

        // Turn OFF PDF mode (back to normal UI)
        setIsPDF(false);
    };


    const saveReport = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/saveReportCard.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student_id: student.id,
                    academic_year: data.academic_year,
                    remarks,
                    ptm_records: ptmRecords,
                    health_records: healthRecords,
                    snapshot: data
                })
            });

            const text = await res.text();
            console.log("RAW RESPONSE:", text);

            const result = JSON.parse(text);

            if (result.status) {
                alert("Draft Saved ✅");
            } else {
                alert("Error: " + result.error);
            }

        } catch (err) {
            console.error(err);
            alert("Something broke ❌");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        return `${d}/${m}/${y}`;
    };

    const finalizeReport = async () => {

        if (!window.confirm("Finalizing will lock this report permanently")) {
            return;
        }

        const res = await fetch(`${API_BASE}/api/finalizeReportCard.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student_id: student.id,
                academic_year: data.academic_year
            })
        });

        const unlockReport = async () => {

            const res = await fetch(
                `${API_BASE}/api/unlockReportCard.php`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        student_id: student.id,
                        academic_year: data.academic_year
                    })
                }
            );

            const result = await res.json();

            if (result.status) {

                alert("Unlocked");

                window.location.reload();
            }
        };

        const result = await res.json();

        if (result.status) {
            alert("Finalized 🔒");
            window.location.reload();
        }
    };

    const isLocked = data?.locked;

    useEffect(() => {

        if (!data) return;

        // If saved draft exists → restore
        if (data.saved) {

            console.log("Restoring saved draft...");

            //  Remarks
            setRemarks(data.saved.remarks || "");

            //  PTM Records
            try {
                const ptm = JSON.parse(data.saved.ptm_records || "[]");
                if (Array.isArray(ptm) && ptm.length > 0) {
                    setPtmRecords(ptm);
                }
            } catch (e) {
                console.error("PTM parse error", e);
            }

            //  Health Records
            try {
                const health = JSON.parse(data.saved.health_records || "{}");
                if (health.term1 && health.term2) {
                    setHealthRecords(health);
                }
            } catch (e) {
                console.error("Health parse error", e);
            }

        }

    }, [data]);


    console.log(`${API_BASE}${encodeURIComponent(student.photo)}`)

    return (

        <Layout>

            <div style={{ textAlign: "center", margin: "10px" }}>
                <button onClick={downloadPDF}>
                    Download Report Card
                </button>
            </div>

            {/* <button onClick={saveReport}>Save Draft</button> */}
            {!isLocked && (
                <button onClick={saveReport}>
                    Save Draft
                </button>
            )}
            {/* <button onClick={finalizeReport}>Finalize</button> */}
            {!isLocked && (
                <button
                    onClick={finalizeReport}
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    Finalize Report
                </button>
            )}

            {isLocked && (
                <button
                    onClick={unlockReport}
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    Unlock Report
                </button>
            )}
            <div className="report-container" data={{ student }}>
                <div className="report-box">
                    <div className="page compact">

                        {/* HEADER CARD */}
                        <div className="header-card">

                            {/* TOP ROW: LOGO + SCHOOL INFO */}
                            <div className="header-top">

                                <div className="logo-left">
                                    <img src={Logo} alt="logo" />
                                </div>

                                <div className="header-center">

                                    <h1 className="school-name">ABM PUBLIC SCHOOL</h1>

                                    <h3 className="school-intro">
                                        (Annapurna Ben Memorial Society's)
                                    </h3>

                                    <p className="text">
                                        Main Road, Rajaswa Colony, Sarkanda, Bilaspur (C.G.)
                                    </p>

                                    <p className="text">
                                        Ph.: 9303219216, 07752-442199
                                    </p>

                                    <p className="text">
                                        SCHOOL UDISE CODE: 22070320910
                                    </p>

                                </div>

                            </div>

                            {/* SECOND ROW: TITLE */}

                        </div>

                        <div className="header-bottom">

                            <h2 className="performancee-header">PERFORMANCE PROFILE</h2>

                            <h4 className="session highlight-session">
                                Session {fromYear} - {toYear}
                            </h4>

                            <h3>TERM-I + TERM-II</h3>

                        </div>

                        <div className="card student-card">

                            <h3>Student Details</h3>

                            <div className="info-grid">

                                <div>
                                    <small className="label">NAME OF STUDENT</small> : <small className="student-name">{student.name}</small>
                                </div>

                                <div>
                                    <small className="label">CLASS - SECTION</small> : <small className="student-name">{student.class}  A</small>
                                </div>

                                <div>
                                    <small className="label">ADMISSION NO</small> : <small className="student-name">{student.admission_no}</small>
                                </div>

                                <div>
                                    <small className="label">PEN NO</small> : <small className="student-name">{student.pen_no || "-"}</small>
                                </div>

                                <div>
                                    <small className="label">DATE OF BIRTH</small> :{" "}
                                    <small className="student-name">
                                        {student.dob
                                            ? (() => {
                                                const date = new Date(student.dob);

                                                const formattedDate = date.toLocaleDateString("en-GB");

                                                const day = date.getDate();
                                                const month = date.toLocaleString("en-GB", { month: "long" });
                                                const year = date.getFullYear();

                                                const numberToWords = (num) => {
                                                    const ones = [
                                                        "", "One", "Two", "Three", "Four", "Five", "Six",
                                                        "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
                                                        "Thirteen", "Fourteen", "Fifteen", "Sixteen",
                                                        "Seventeen", "Eighteen", "Nineteen"
                                                    ];

                                                    const tens = [
                                                        "", "", "Twenty", "Thirty", "Forty", "Fifty",
                                                        "Sixty", "Seventy", "Eighty", "Ninety"
                                                    ];

                                                    if (num < 20) return ones[num];
                                                    return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
                                                };

                                                const dayToWords = (d) => {
                                                    const ordinals = [
                                                        "", "First", "Second", "Third", "Fourth", "Fifth", "Sixth",
                                                        "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth",
                                                        "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth",
                                                        "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth",
                                                        "Twenty First", "Twenty Second", "Twenty Third",
                                                        "Twenty Fourth", "Twenty Fifth", "Twenty Sixth",
                                                        "Twenty Seventh", "Twenty Eighth", "Twenty Ninth",
                                                        "Thirtieth", "Thirty First"
                                                    ];
                                                    return ordinals[d];
                                                };

                                                const yearToWords = (y) => {
                                                    const first = Math.floor(y / 1000);
                                                    const last = y % 1000;

                                                    return (
                                                        numberToWords(first) +
                                                        " Thousand " +
                                                        (last ? numberToWords(last) : "")
                                                    ).trim();
                                                };

                                                return `${formattedDate} (${dayToWords(day)} ${month} ${yearToWords(year)})`;
                                            })()
                                            : "-"}
                                    </small>
                                </div>

                                <div>
                                    <small className="label">FATHER'S NAME</small> : <small className="student-name">{student.parent_name}</small>
                                </div>

                                <div>
                                    <small className="label">MOTHER'S NAME</small> : <small className="student-name">{student.mother_name || "-"}</small>
                                </div>

                                {/* <div>
                                    <small className="label">Gender</small><br />
                                    <small className="student-name">{student.gender || "-"}</small>
                                </div>

                                <div>
                                    <small className="label">Caste</small><br />
                                    <small className="student-name">{student.caste || "-"}</small>
                                </div> */}

                                <div className="full">
                                    <small className="label">RESIDENCE ADDRESS :</small><br />
                                    <small className="student-name">{student.address || "-"}</small>
                                </div>

                            </div>
                        </div>

                        {/* STUDENT PROFILE (ATTENDANCE) */}
                        <div className="card profile-card">

                            <h3 className="section-title">Student Attendance</h3>

                            <div className="attendance-wrapper">

                                {/* TERM 1 */}
                                <div className="attendance-box term1">
                                    <h4>TERM I</h4>

                                    <div className="att-row">
                                        <span>Working Days</span>
                                        <b>{term1WorkingDays}</b>
                                    </div>

                                    <div className="att-row">
                                        <span>Present</span>
                                        <b>{term1.present_days || 0}</b>
                                        <span>Absent</span>
                                        <b>{term1.absent_days || 0}</b>
                                    </div>

                                    <div className="att-row highlight">
                                        <span>Attendance</span>
                                        <b>{term1.percentage || 0}%</b>
                                    </div>
                                </div>

                                {/* TERM 2 */}
                                <div className="attendance-box term2">
                                    <h4>TERM II</h4>

                                    <div className="att-row">
                                        <span>Working Days</span>
                                        <b>{term2WorkingDays}</b>
                                    </div>

                                    <div className="att-row">
                                        <span>Present</span>
                                        <b>{term2.present_days || 0}</b>
                                        <span>Absent</span>
                                        <b>{term2.absent_days || 0}</b>
                                    </div>

                                    <div className="att-row highlight">
                                        <span>Attendance</span>
                                        <b>{term2.percentage || 0}%</b>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* ADS SECTION */}
                        {/* <div className="ads-section">
                            <div className="ads-overlay">
                                <h3></h3>
                                <h3></h3>
                                <h3></h3>
                            </div>
                        </div> */}

                        <div className="grading-section clean-yellow">

                            <h3 className="section-title">GRADING SCALE FOR SCHOLASTIC AREAS, AWARDED ON A 8 POINT GRADING SCALE</h3>

                            <table className="grading-table">
                                <thead>
                                    <tr>
                                        <th>Grade</th>
                                        <th>Marks</th>
                                        <th>Remarks</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr><td>A1</td><td>91–100</td><td>Outstanding</td></tr>
                                    <tr><td>A1</td><td>81-90</td><td>Excellent</td></tr>
                                    <tr><td>B1</td><td>71–80</td><td>Very Good</td></tr>
                                    <tr><td>B1</td><td>61–70</td><td>Good</td></tr>
                                    <tr><td>C1</td><td>51–60</td><td>Average</td></tr>
                                    <tr><td>C2</td><td>41–50</td><td>Can Do Better</td></tr>
                                    <tr><td>D</td><td>33–40</td><td>Scope of Improvement</td></tr>
                                    <tr><td>E</td><td>32 & BELOW</td><td>Recommended to Repeat For Better Progress</td></tr>
                                </tbody>
                            </table>

                        </div>



                    </div>

                    <div className="page compact">

                        <div className="main-report-box">

                            <div className="logo-left">
                                <img src={Logo} alt="logo" />
                            </div>

                            <div className="header-special">
                                <h1 className="school-name head">ABM PUBLIC SCHOOL</h1>
                            </div>


                            {/* HEADER */}
                            <div className="section header-section text-center">
                                <h2 className="academic-session session">
                                    Academic Session: {fromYear} - {toYear}
                                </h2>

                                <h1 className="marksheet-title head">
                                    FINAL MARKSHEET
                                </h1>
                            </div>

                            {/* STUDENT INFO */}
                            <div className="section">

                                <h3>Student Information</h3>

                                <div className="info-grid">

                                    <div>
                                        <small className="label">NAME</small> : <small className="student-name">{student.name}</small>
                                    </div>

                                    <div>
                                        <small className="label">CLASS/SECTION</small> : <small className="student-name">{student.class}  {student.section || ""}</small>
                                    </div>

                                    <div>
                                        <small className="label">ROLL NO</small> : <small className="student-name">{student.roll_no || "-"}</small>
                                    </div>

                                    <div>
                                        <small className="label">ADMISSION NO</small> : <small className="student-name">{student.admission_no}</small>
                                    </div>

                                    <div>
                                        <small className="label">PEN NO</small> : <small className="student-name">{student.pen_no || "-"}</small>
                                    </div>

                                    <div>
                                        <small className="label">DATE OF BIRTH</small> :{" "}
                                        <small className="student-name-dob">
                                            {student.dob
                                                ? (() => {
                                                    const date = new Date(student.dob);

                                                    const formattedDate = date.toLocaleDateString("en-GB");

                                                    const day = date.getDate();
                                                    const month = date.toLocaleString("en-GB", { month: "long" });
                                                    const year = date.getFullYear();

                                                    const numberToWords = (num) => {
                                                        const ones = [
                                                            "", "One", "Two", "Three", "Four", "Five", "Six",
                                                            "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
                                                            "Thirteen", "Fourteen", "Fifteen", "Sixteen",
                                                            "Seventeen", "Eighteen", "Nineteen"
                                                        ];

                                                        const tens = [
                                                            "", "", "Twenty", "Thirty", "Forty", "Fifty",
                                                            "Sixty", "Seventy", "Eighty", "Ninety"
                                                        ];

                                                        if (num < 20) return ones[num];
                                                        return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
                                                    };

                                                    const dayToWords = (d) => {
                                                        const ordinals = [
                                                            "", "First", "Second", "Third", "Fourth", "Fifth", "Sixth",
                                                            "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth",
                                                            "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth",
                                                            "Seventeenth", "Eighteenth", "Nineteenth", "Twentieth",
                                                            "Twenty First", "Twenty Second", "Twenty Third",
                                                            "Twenty Fourth", "Twenty Fifth", "Twenty Sixth",
                                                            "Twenty Seventh", "Twenty Eighth", "Twenty Ninth",
                                                            "Thirtieth", "Thirty First"
                                                        ];
                                                        return ordinals[d];
                                                    };

                                                    const yearToWords = (y) => {
                                                        const first = Math.floor(y / 1000);
                                                        const last = y % 1000;

                                                        return (
                                                            numberToWords(first) +
                                                            " Thousand " +
                                                            (last ? numberToWords(last) : "")
                                                        ).trim();
                                                    };

                                                    return `${formattedDate} (${dayToWords(day)} ${month} ${yearToWords(year)})`;
                                                })()
                                                : "-"}
                                        </small>
                                    </div>

                                    <div>
                                        <small className="label">FATHER'S NAME</small> : <small className="student-name">{student.parent_name}</small>
                                    </div>

                                    <div>
                                        <small className="label">MOTHER'S NAME</small> : <small className="student-name">{student.mother_name || "-"}</small>
                                    </div>

                                </div>
                            </div>

                            {/* SCHOLASTIC AREA */}
                            <div className="section">

                                <h3>Scholastic Area</h3>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th rowSpan="2">Subject</th>

                                            <th colSpan="5">Term I</th>
                                            <th rowSpan="2">Grade</th>

                                            <th colSpan="5">Term II</th>
                                            <th rowSpan="2">Grade</th>
                                        </tr>

                                        <tr>
                                            <th>PT (10)</th>
                                            <th>NB (10)</th>
                                            <th>SE (10)</th>
                                            <th>Exam (70)</th>
                                            <th>Total</th>

                                            <th>PT</th>
                                            <th>NB</th>
                                            <th>SE</th>
                                            <th>Exam</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {validSubjects.map((s, i) => {

                                            const t1 = s.term1 || {};
                                            const t2 = s.term2 || {};

                                            const t1Total =
                                                (t1.pt || 0) +
                                                (t1.nb || 0) +
                                                (t1.se || 0) +
                                                (t1.exam || 0);

                                            const t2Total =
                                                (t2.pt || 0) +
                                                (t2.nb || 0) +
                                                (t2.se || 0) +
                                                (t2.exam || 0);

                                            return (
                                                <tr key={i}>
                                                    <td>{s.subject}</td>

                                                    <td>{t1.pt || "-"}</td>
                                                    <td>{t1.nb || "-"}</td>
                                                    <td>{t1.se || "-"}</td>
                                                    <td>{t1.exam || "-"}</td>
                                                    <td style={{ color: "black" }}><b>{t1Total}</b></td>
                                                    <td>{getGrade(t1Total)}</td>

                                                    <td>{t2.pt || "-"}</td>
                                                    <td>{t2.nb || "-"}</td>
                                                    <td>{t2.se || "-"}</td>
                                                    <td>{t2.exam || "-"}</td>
                                                    <td><b>{t2Total}</b></td>
                                                    <td>{getGrade(t2Total)}</td>
                                                </tr>
                                            );
                                        })}

                                        <tr style={{ fontWeight: "bold", background: "#fff3cd", color: "black" }}>
                                            <td>TOTAL</td>

                                            {/* TERM 1 */}
                                            <td colSpan="4"></td>
                                            <td>{term1GrandTotal}</td>
                                            <td>{term1Percentage}%</td>

                                            {/* TERM 2 */}
                                            <td colSpan="4"></td>
                                            <td>{term2GrandTotal}</td>
                                            <td>{term2Percentage}%</td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                            {/* ECA AREA */}
                            <div className="section">
                                <h3>Co-Scholastic Area (ECA)</h3>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Activity</th>
                                            <th>Term I</th>
                                            <th>Term II</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {eca.map((e, i) => (
                                            <tr key={i}>
                                                <td>{e.activity}</td>
                                                <td>{e.term1 || "-"}</td>
                                                <td>{e.term2 || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <p style={{ fontSize: "12px", marginTop: "5px", fontWeight: "bold" }}>
                                    Grading: A - Excellent | B - Good | C - Needs Improvement
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="page spacious">

                        <div className="main-report-box">
                            <div className="logo-left">
                                <img src={Logo} alt="logo" />
                            </div>

                            <div className="header-center">
                                <h1 className="school-name">ABM PUBLIC SCHOOL</h1>
                            </div>

                            <div>
                                <small className="label">NAME OF STUDENT</small> : <small className="student-name">{student.name}</small>
                            </div>

                            <div>
                                <small className="label">CLASS - SECTION</small> : <small className="student-name">{student.class}  A</small>
                            </div>


                            <div className="section">

                                <h3>Overall Performance</h3>

                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td><b>Term I Percentage</b></td>
                                            <td>{term1Percentage}%</td>
                                        </tr>
                                        <tr>
                                            <td><b>Term II Percentage</b></td>
                                            <td>{term2Percentage}%</td>
                                        </tr>
                                        <tr style={{ background: "#fff3cd" }}>
                                            <td><b>Final Percentage</b></td>
                                            <td><b>{finalPercentage}%</b></td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                            <div className="section">

                                <h3>Class Teacher's Remarks</h3>

                                {isPDF ? (
                                    <div className="remarks-box pdf-remarks">
                                        {remarks.split("\n").map((line, i) => (
                                            <div key={i}>{line}</div>
                                        ))}
                                    </div>
                                ) : (
                                    <textarea
                                        className="remarks-box"
                                        placeholder="Enter teacher remarks..."
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        disabled={isLocked}
                                    />
                                )}

                            </div>

                            <div className="section">

                                <h3>Result</h3>

                                <div className="result-box">

                                    {isPass ? (
                                        <p>
                                            <b>Congratulations!</b> Promoted to Class <b>{nextClass}</b>
                                        </p>
                                    ) : (
                                        <p style={{ color: "red" }}>
                                            <b>Needs Improvement</b> - Not Promoted
                                        </p>
                                    )}

                                </div>

                            </div>

                            {/* INSTRUCTIONS */}
                            <div className="section">
                                <h3>Instructions</h3>

                                <ul className="instructions">
                                    <li style={{ "fontWeight": "bold", "font-size": "15px", "margin-top": "2px" }}>Ensure your child's attendance is above 75% for good academic progress.</li>
                                    <li style={{ "fontWeight": "bold", "font-size": "15px", "margin-top": "2px" }}>Parents must attend all scheduled Parent-Teacher Meetings (PTM) to stay informed of thier child's progress.</li>
                                    <li style={{ "fontWeight": "bold", "font-size": "15px", "margin-top": "2px" }}>Daily Practice at home and timely submissions of asssignments are crucial for success.</li>
                                    <li style={{ "fontWeight": "bold", "font-size": "15px", "margin-top": "2px" }}>If the progress report is lost, duplicate will be required upon a payment of ₹200</li>
                                </ul>
                            </div>



                        </div>

                    </div>

                    <div className="page spacious">

                        <div className="main-report-box">
                            <div className="logo-and-header">
                                <div className="logo-left">
                                    <img src={Logo} alt="logo" />
                                </div>

                                <div className="header-center-special">
                                    <h1 className="school-name">ABM PUBLIC SCHOOL</h1>
                                </div>



                            </div>





                            <h2 className="text-center">Performance Analysis</h2>

                            <div className="chart-box" style={{ height: "250px" }}>
                                <Bar data={chartData} options={chartOptions} />
                            </div>



                            {/* PTM RECORD */}
                            <div className="section dual-section">

                                {/* LEFT: PTM RECORD */}
                                <div className="half">

                                    <h3>Parent Teacher Meeting</h3>

                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Present</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {ptmRecords.map((row, index) => (
                                                <tr key={index}>
                                                    {/* DATE COLUMN */}
                                                    <td>
                                                        {isPDF ? (
                                                            //  Only formatted date for PDF
                                                            <span>{formatDate(row.date)}</span>
                                                        ) : (
                                                            //  Editable UI
                                                            <>
                                                                <input
                                                                    className="clean-input"
                                                                    type="date"
                                                                    value={row.date}
                                                                    onChange={(e) => {
                                                                        const updated = [...ptmRecords];
                                                                        updated[index].date = e.target.value;
                                                                        setPtmRecords(updated);
                                                                    }}
                                                                    disabled={isLocked}
                                                                />

                                                                <div style={{ fontSize: "12px", marginTop: "4px", color: "#666" }}>
                                                                    {formatDate(row.date)}
                                                                </div>
                                                            </>
                                                        )}
                                                    </td>

                                                    {/* PRESENT COLUMN */}
                                                    < td >
                                                        <select
                                                            className="clean-input"
                                                            value={row.present}
                                                            onChange={(e) => {
                                                                const updated = [...ptmRecords];
                                                                updated[index].present = e.target.value;
                                                                setPtmRecords(updated);
                                                            }}
                                                            disabled={isLocked}
                                                        >
                                                            <option value="">PTM didn't happen further</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* RIGHT: HEALTH RECORD */}
                                <div className="half">

                                    <h3>Health Record</h3>

                                    <table className="table health-table">
                                        <thead>
                                            <tr>
                                                <th>Areas</th>
                                                <th>Term I</th>
                                                <th>Term II</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {/* HEIGHT */}
                                            <tr>
                                                <td>Height (cm)</td>

                                                <td>
                                                    <input
                                                        className="clean-input"
                                                        value={healthRecords.term1.height}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term1: { ...healthRecords.term1, height: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        className="clean-input"
                                                        value={healthRecords.term2.height}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term2: { ...healthRecords.term2, height: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    />
                                                </td>
                                            </tr>

                                            {/* WEIGHT */}
                                            <tr>
                                                <td>Weight (kg)</td>

                                                <td>
                                                    <input
                                                        className="clean-input"
                                                        value={healthRecords.term1.weight}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term1: { ...healthRecords.term1, weight: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        className="clean-input"
                                                        value={healthRecords.term2.weight}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term2: { ...healthRecords.term2, weight: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    />
                                                </td>
                                            </tr>

                                            {/* DENTAL */}
                                            <tr>
                                                <td>Dental Care</td>

                                                <td>
                                                    <select
                                                        className="clean-input"
                                                        value={healthRecords.term1.dental}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term1: { ...healthRecords.term1, dental: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    >
                                                        <option value="">N.A.</option>
                                                        <option value="Good">Good</option>
                                                        <option value="Needs Care">Needs Care</option>
                                                    </select>
                                                </td>

                                                <td>
                                                    <select
                                                        className="clean-input"
                                                        value={healthRecords.term2.dental}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term2: { ...healthRecords.term2, dental: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    >
                                                        <option value="">N.A.</option>
                                                        <option value="Good">Good</option>
                                                        <option value="Needs Care">Needs Care</option>
                                                    </select>
                                                </td>
                                            </tr>

                                            {/* GENERAL */}
                                            <tr>
                                                <td>General Checkup</td>

                                                <td>
                                                    <select
                                                        className="clean-input"
                                                        value={healthRecords.term1.general}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term1: { ...healthRecords.term1, general: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    >
                                                        <option value="">N.A.</option>
                                                        <option value="Good">Good</option>
                                                        <option value="Needs Attention">Needs Attention</option>
                                                    </select>
                                                </td>

                                                <td>
                                                    <select
                                                        className="clean-input"
                                                        value={healthRecords.term2.general}
                                                        onChange={(e) =>
                                                            setHealthRecords({
                                                                ...healthRecords,
                                                                term2: { ...healthRecords.term2, general: e.target.value }
                                                            })
                                                        }
                                                        disabled={isLocked}
                                                    >
                                                        <option value="">N.A.</option>
                                                        <option value="Good">Good</option>
                                                        <option value="Needs Attention">Needs Attention</option>
                                                    </select>
                                                </td>
                                            </tr>

                                        </tbody>
                                    </table>

                                </div>

                            </div>


                            {/* Signature section */}

                            <div className="card signature-card">
                                <h3>Signatures - TERM-I</h3>

                                <div className="signature-row">
                                    <div className="sign-box">
                                        <p>Class Teacher</p>
                                    </div>
                                    <div className="sign-box">
                                        <img
                                            src={PrincipalSign}
                                            alt="Principal Signature"
                                            className="signature-img"
                                            crossOrigin="anonymous"
                                        />
                                        <p>Principal</p>
                                    </div>
                                    <div className="sign-box">
                                        <p>Parent / Guardian</p>
                                    </div>
                                </div>
                            </div>

                            <div className="card signature-card">
                                <h3>Signatures - TERM-II</h3>

                                <div className="signature-row">
                                    <div className="sign-box">
                                        <p>Class Teacher</p>
                                    </div>
                                    <div className="sign-box">
                                        <img
                                            src={PrincipalSign}
                                            alt="Principal Signature"
                                            className="signature-img"
                                            crossOrigin="anonymous"
                                        />
                                        <p>Principal</p>
                                    </div>
                                    <div className="sign-box">
                                        <p>Parent / Guardian</p>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </div >
        </Layout >
    );
}