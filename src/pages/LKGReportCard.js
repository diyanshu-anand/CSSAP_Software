import React from "react";
import "./report.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Logo from "../assets/ABM_Logo.jpg";
import Layout from "../components/Layout";

export default function LKGReportCard({ data }) {

    const gradeToValue = (grade) => {
        const map = {
            A1: 95, A2: 85, B1: 75, B2: 65,
            C1: 55, C2: 45, D: 38
        };
        return map[grade] || 0;
    };

    const graphData = [
        { label: "English", value: gradeToValue(data?.t1?.eng_reading) },
        { label: "Hindi", value: gradeToValue(data?.t1?.hin_vachan) },
        { label: "Maths", value: gradeToValue(data?.t1?.math_concepts) }
    ];

    const downloadPDF = async () => {
        const pages = document.querySelectorAll(".page");

        if (!pages.length) {
            alert("No pages found");
            return;
        }

        const pdf = new jsPDF("p", "mm", "a4");

        for (let i = 0; i < pages.length; i++) {

            const page = pages[i];

            const images = page.querySelectorAll("img");
            await Promise.all(
                Array.from(images).map((img) => {
                    if (img.complete) return Promise.resolve();
                    return new Promise((resolve) => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });
                })
            );

            await new Promise(resolve => setTimeout(resolve, 200));

            const canvas = await html2canvas(page, {
                scale: 2.5,
                useCORS: true,
                scrollY: -window.scrollY
            });

            const imgData = canvas.toDataURL("image/jpeg", 1);

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (i !== 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        }

        pdf.save(`${data?.name || "report-card"}.pdf`);
    };

    return (
        <Layout>
            <div>

                <div className="top-buttons">
                    <button onClick={() => window.print()}>Print</button>
                    {/* <button onClick={() => window.print()}>Download PDF</button> */}
                    <button onClick={downloadPDF}>Download PDF</button>
                </div>

                <div className="wrapper">
                    <div className="a4" id="report">

                        {/* PAGE 1 */}
                        <div className="page" data-page="Page 1">
                            <div className="page-inner">

                                <div className="udi">UDI CODE : 22070320910</div>

                                <div className="school-header">
                                    <h1>A.B.M. PUBLIC SCHOOL</h1>
                                    <p>Pre Nursery - Class 8th</p>
                                    <p>(Activity Based Children's Education Centre)</p>
                                    <p>(A Complete English Medium School)</p>

                                    <img src={Logo} className="logo-img" />

                                    <p className="tagline"><b>विद्या ददाति विनयम्</b></p>

                                    <h3 className="CBSE">CBSE PATTERN (Pre Nursery - 8th)</h3>
                                    <p className="address"><b>Main Road, Rajaswa Colony, Sarkanda, Bilaspur (C.G) Ph: 9303219216, 07752-351476</b></p>
                                </div>
                                {/* 
            <h2>DEVELOPMENT & ACHIEVEMENT RECORD</h2>
            <h3>FOR PLAY GROUP / NURSERY</h3> */}

                                <div className="center-text">
                                    <div className="main-title"><h2>DEVELOPMENT & ACHIEVEMENT RECORD</h2></div>
                                    <div className="sub-title">FOR PLAY GROUP / NURSERY</div>
                                </div>
                                <div className="academic-year">
                                    Academic Year: {data?.year}
                                </div>

                                {/* STUDENT BOX */}
                                <div className="student-grid">

                                    <div><b>Name:</b> {data?.name}</div>
                                    <div><b>Father's Name:</b> {data?.father}</div>
                                    <div><b>Mother's Name:</b> {data?.mother}</div>
                                    <div><b>Class:</b> {data?.class}</div>
                                    <div><b>Section:</b> {data?.section}</div>
                                    <div><b>Roll No:</b> {data?.roll}</div>
                                    <div><b>Admission No:</b> {data?.admission}</div>
                                    <div><b>DOB:</b> {data?.dob}</div>
                                    <div><b>In Words:</b> __________</div>
                                    <div className="full"><b>Address:</b> {data?.address}</div>

                                </div>
                            </div>
                        </div>

                        {/* PAGE 2 */}
                        <div className="page" data-page="Page 2">
                            <div className="page-inner">
                                <h3>Scholastic Areas</h3>

                                <div className="subject-box">
                                    <h4>English</h4>

                                    <p className="table-header">
                                        <span>Skill</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Reading</span>
                                        <span className="t1">{data?.t1?.eng_reading}</span>
                                        <span className="t2">{data?.t2?.eng_reading}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Writing</span>
                                        <span className="t1">{data?.t1?.eng_writing}</span>
                                        <span className="t2">{data?.t2?.eng_writing}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Recognition</span>
                                        <span className="t1">{data?.t1?.eng_recognition}</span>
                                        <span className="t2">{data?.t2?.eng_recognition}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Conversation</span>
                                        <span className="t1">{data?.t1?.eng_conversation}</span>
                                        <span className="t2">{data?.t2?.eng_conversation}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Recitation</span>
                                        <span className="t1">{data?.t1?.eng_recitation}</span>
                                        <span className="t2">{data?.t2?.eng_recitation}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Dictation</span>
                                        <span className="t1">{data?.t1?.eng_dictation}</span>
                                        <span className="t2">{data?.t2?.eng_dictation}</span>
                                    </p>
                                </div>

                                <div className="subject-box">
                                    <h4>Hindi</h4>

                                    <p className="table-header">
                                        <span>Skill</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Vachan Kaushal</span>
                                        <span className="t1">{data?.t1?.hin_vachan}</span>
                                        <span className="t2">{data?.t2?.hin_vachan}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Lekhan Kaushal</span>
                                        <span className="t1">{data?.t1?.hin_lekhan}</span>
                                        <span className="t2">{data?.t2?.hin_lekhan}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Parigyan</span>
                                        <span className="t1">{data?.t1?.hin_parigyan}</span>
                                        <span className="t2">{data?.t2?.hin_parigyan}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Vartalaap</span>
                                        <span className="t1">{data?.t1?.hin_vartalaap}</span>
                                        <span className="t2">{data?.t2?.hin_vartalaap}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Kavita Path</span>
                                        <span className="t1">{data?.t1?.hin_kavita}</span>
                                        <span className="t2">{data?.t2?.hin_kavita}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Shrit Lekhan</span>
                                        <span className="t1">{data?.t1?.hin_Shrit}</span>
                                        <span className="t2">{data?.t2?.hin_shrit}</span>
                                    </p>
                                </div>

                                <div className="subject-box">
                                    <h4>Mathematics</h4>

                                    <p className="table-header">
                                        <span>Skill</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Understanding Concepts</span>
                                        <span className="t1">{data?.t1?.math_concepts}</span>
                                        <span className="t2">{data?.t2?.math_concepts}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Problem Solving</span>
                                        <span className="t1">{data?.t1?.math_counting}</span>
                                        <span className="t2">{data?.t2?.math_counting}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Forming Digits</span>
                                        <span className="t1">{data?.t1?.math_forming}</span>
                                        <span className="t2">{data?.t2?.math_forming}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Counting</span>
                                        <span className="t1">{data?.t1?.math_counting}</span>
                                        <span className="t2">{data?.t2?.math_counting}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Tables</span>
                                        <span className="t1">{data?.t1?.math_tables}</span>
                                        <span className="t2">{data?.t2?.math_tables}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Dodging</span>
                                        <span className="t1">{data?.t1?.math_dodging}</span>
                                        <span className="t2">{data?.t2?.math_dodging}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* PAGE 3 */}
                        <div className="page" data-page="Page 3">
                            <div className="page-inner">

                                <h3>Co-Curricular & Traits</h3>

                                <div className="subject-box">
                                    <h4>Co-Curricular Activities</h4>

                                    <p className="table-header">
                                        <span>Activity</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Art/Craft</span>
                                        <span className="t1">{data?.t1?.cc_art || "-"}</span>
                                        <span className="t2">{data?.t2?.cc_art || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Drawing</span>
                                        <span className="t1">{data?.t1?.cc_drawing || "-"}</span>
                                        <span className="t2">{data?.t2?.cc_drawing || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Coloring/Painting</span>
                                        <span className="t1">{data?.t1?.cc_coloring || "-"}</span>
                                        <span className="t2">{data?.t2?.cc_coloring || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Music/Dance</span>
                                        <span className="t1">{data?.t1?.cc_music || "-"}</span>
                                        <span className="t2">{data?.t2?.cc_music || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Sports</span>
                                        <span className="t1">{data?.t1?.cc_sports || "-"}</span>
                                        <span className="t2">{data?.t2?.cc_sports || "-"}</span>
                                    </p>
                                </div>

                                <div className="subject-box">
                                    <h4>Personal Traits</h4>

                                    <p className="table-header">
                                        <span>Trait</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Concentration</span>
                                        <span className="t1">{data?.t1?.pt_concentration || "-"}</span>
                                        <span className="t2">{data?.t2?.pt_concentration || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Confidence</span>
                                        <span className="t1">{data?.t1?.pt_confidence || "-"}</span>
                                        <span className="t2">{data?.t2?.pt_confidence || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Self Reliance</span>
                                        <span className="t1">{data?.t1?.pt_reliance || "-"}</span>
                                        <span className="t2">{data?.t2?.pt_reliance || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Etiquettes & Manners</span>
                                        <span className="t1">{data?.t1?.pt_ettiquetes || "-"}</span>
                                        <span className="t2">{data?.t2?.pt_ettiquetes || "-"}</span>
                                    </p>
                                </div>

                                <div className="subject-box">
                                    <h4>Study Habits</h4>

                                    <p className="table-header">
                                        <span>Habit</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Regularity</span>
                                        <span className="t1">{data?.t1?.st_regularity || "-"}</span>
                                        <span className="t2">{data?.t2?.st_regularity || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Punctuality</span>
                                        <span className="t1">{data?.t1?.st_punctuality || "-"}</span>
                                        <span className="t2">{data?.t2?.st_punctuality || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Completes Homework</span>
                                        <span className="t1">{data?.t1?.st_homework || "-"}</span>
                                        <span className="t2">{data?.t2?.st_homework || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Completes Classwork</span>
                                        <span className="t1">{data?.t1?.st_classwork || "-"}</span>
                                        <span className="t2">{data?.t2?.st_classwork || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Needs Attention</span>
                                        <span className="t1">{data?.t1?.st_specialattention || "-"}</span>
                                        <span className="t2">{data?.t2?.st_specialattention || "-"}</span>
                                    </p>
                                </div>

                                <div className="subject-box">
                                    <h4>Social Habits</h4>

                                    <p className="table-header">
                                        <span>Activity</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Indoor Activities</span>
                                        <span className="t1">{data?.t1?.st_regularity || "-"}</span>
                                        <span className="t2">{data?.t2?.st_regularity || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Outdoor Activities</span>
                                        <span className="t1">{data?.t1?.st_punctuality || "-"}</span>
                                        <span className="t2">{data?.t2?.st_punctuality || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Cultural Activities</span>
                                        <span className="t1">{data?.t1?.st_homework || "-"}</span>
                                        <span className="t2">{data?.t2?.st_homework || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Physical Activities</span>
                                        <span className="t1">{data?.t1?.st_classwork || "-"}</span>
                                        <span className="t2">{data?.t2?.st_classwork || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Interaction with Peers</span>
                                        <span className="t1">{data?.t1?.st_specialattention || "-"}</span>
                                        <span className="t2">{data?.t2?.st_specialattention || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Interaction with Teachers</span>
                                        <span className="t1">{data?.t1?.st_specialattention || "-"}</span>
                                        <span className="t2">{data?.t2?.st_specialattention || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Sharing</span>
                                        <span className="t1">{data?.t1?.st_specialattention || "-"}</span>
                                        <span className="t2">{data?.t2?.st_specialattention || "-"}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="logo-container">
                                <img src={Logo} />
                            </div>


                        </div>



                        {/* PAGE 4 */}
                        <div className="page" data-page="Page 4">
                            <div className="page-inner">
                                <div className="subject-box">
                                    <h4>Other Activities</h4>

                                    <p className="table-header">
                                        <span>Activity</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Creativity</span>
                                        <span className="t1">{data?.t1?.st_regularity || "-"}</span>
                                        <span className="t2">{data?.t2?.st_regularity || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Tiffin Interests</span>
                                        <span className="t1">{data?.t1?.st_punctuality || "-"}</span>
                                        <span className="t2">{data?.t2?.st_punctuality || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Support From Home</span>
                                        <span className="t1">{data?.t1?.st_homework || "-"}</span>
                                        <span className="t2">{data?.t2?.st_homework || "-"}</span>
                                    </p>
                                </div>

                                <h3 className="center-text">Teacher's Remark</h3>

                                <div className="remarks-box-vertical">

                                    <div>
                                        <b>Term 1 Remark:</b>
                                        <p className="line"></p>
                                    </div>

                                    <div>
                                        <b>Term 2 Remark:</b>
                                        <p className="line"></p>
                                    </div>

                                </div>
                                <div className="subject-box">
                                    <h4>Attendance</h4>

                                    <p className="table-header">
                                        <span>Field</span>
                                        <span>T1</span>
                                        <span>T2</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Working Days</span>
                                        <span className="t1">{data?.t1?.working_days || "-"}</span>
                                        <span className="t2">{data?.t2?.working_days || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Present Days</span>
                                        <span className="t1">{data?.t1?.present_days || "-"}</span>
                                        <span className="t2">{data?.t2?.present_days || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Absent Days</span>
                                        <span className="t1">{data?.t1?.absent_days || "-"}</span>
                                        <span className="t2">{data?.t2?.absent_days || "-"}</span>
                                    </p>

                                    <p className="row">
                                        <span className="label">Attendance %</span>
                                        <span className="t1">{data?.t1?.attendance_percent || "-"}%</span>
                                        <span className="t2">{data?.t2?.attendance_percent || "-"}%</span>
                                    </p>
                                </div>


                                <h3>Performance</h3>
                                {/* <div className="graph">
                            {graphData.map((g, i) => (
                                <div key={i}>
                                    <div className="bar" style={{ height: g.value }}></div>
                                    <span>{g.label}</span>
                                </div>
                            ))}
                        </div> */}

                                <div className="grade-box">
                                    <p>
                                        <b>A1:</b> 90–100 Outstanding &nbsp; | &nbsp;
                                        <b>A2:</b> 80–89 Excellent &nbsp; | &nbsp;
                                        <b>B1:</b> 70–79 Very Good
                                    </p>

                                    <p>
                                        <b>B2:</b> 60–69 Good &nbsp; | &nbsp;
                                        <b>C1:</b> 50–59 Average &nbsp; | &nbsp;
                                        <b>C2:</b> 40–49 Satisfactory &nbsp; | &nbsp;
                                        <b>D:</b> 35–39 Needs Growth
                                    </p>
                                </div>

                                {/* <h3 className="center-text">Teacher Remarks</h3>
                        <p className="line"></p>
                        <p className="line"></p> */}


                                <div className="signature-box">

                                    {/* HEADER */}
                                    <div className="sig-header">
                                        <div>Term</div>
                                        <div>Class Teacher Sign</div>
                                        <div>Principal Sign</div>
                                        <div>Parents Sign</div>
                                    </div>

                                    {/* TERM 1 */}
                                    <div className="sig-row">
                                        <div>Term 1</div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>

                                    {/* TERM 2 */}
                                    <div className="sig-row">
                                        <div>Term 2</div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>

                                </div>



                                <div className="rules">
                                    <h2>RULES FOR PROGRESS RPEORT</h2>
                                    <p>1. Duplicate will be issued on ₹100.</p>
                                    <p>2. No alteration allowed.</p>
                                    <p>3. Principal decision is final.</p>
                                </div>

                                {/* <div className="growth">
                            🐘 Height / Weight | 🦒 Height / Weight
                        </div> */}

                                <div className="growth-box">

                                    <div className="growth-section">
                                        <b>Term 1</b>
                                        <p>Height (cms): ______</p>
                                        <p>Weight (cms): ______</p>
                                    </div>

                                    <div className="growth-section">
                                        <b>Term 2</b>
                                        <p>Height (cms): ______</p>
                                        <p>Weight (kg): ______</p>
                                    </div>

                                </div>

                            </div>
                            {/* <div className="logo-container">
                                <img src={Logo} />
                            </div> */}
                        </div>

                    </div>
                </div>

            </div >
        </Layout>
    );
}