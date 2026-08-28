import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";
import html2pdf from "html2pdf.js";
import Logo from "../assets/ABM_Logo.jpg";
import './Transfer_Certificate.css';
// import './highreport.css'

function TransferCertificate() {

    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [studentId, setStudentId] = useState("");

    const [tc, setTc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPDF, setIsPDF] = useState(false);
    const [studentType, setStudentType] = useState("active");

    // ================= LOAD CLASSES =================
    useEffect(() => {
        axios.get(`${API_BASE}/getClasses.php`)
            .then(res => setClasses(res.data.data || []))
            .catch(console.error);
    }, []);

    // ================= LOAD STUDENTS =================
    useEffect(() => {
        if (!selectedClass) return;

        axios.get(
            `${API_BASE}/getStudents.php?class=${selectedClass}&type=${studentType}`
        )
            .then(res => setStudents(res.data.data || []))
            .catch(console.error);
    }, [selectedClass, studentType]);

    // ================= LOAD TC =================
    const loadTC = async () => {
        if (!studentId) return alert("Select student");

        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/get_tc.php?student_id=${studentId}`);
            setTc(res.data.data);
        } catch {
            alert("Failed to load TC");
        } finally {
            setLoading(false);
        }
    };

    // ================= HANDLE CHANGE =================
    const handleChange = (field, value) => {
        setTc(prev => ({ ...prev, [field]: value }));
    };

    // ================= SAVE =================
    const saveTC = async () => {
        try {
            await axios.post(`${API_BASE}/save_tc.php`, tc);
            alert("Draft saved");
        } catch {
            alert("Save failed");
        }
    };

    // ================= FINALIZE =================
    const finalizeTC = async () => {
        if (!window.confirm("Finalize will lock TC")) return;

        try {
            const res = await axios.post(`${API_BASE}/finalize_tc.php`, { id: tc.id });
            alert(`TC No: ${res.data.tc_number}`);
            loadTC();
        } catch {
            alert("Finalize failed");
        }
    };

    const numberToWords = (num) => {
        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
        const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
            "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty"];

        if (num < 10) return ones[num];
        if (num < 20) return teens[num - 10];
        return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    };

    const yearToWords = (year) => {
        const thousands = Math.floor(year / 1000);
        const hundreds = Math.floor((year % 1000) / 100);
        const lastTwo = year % 100;

        let result = "";

        if (thousands) result += numberToWords(thousands) + " Thousand ";
        if (hundreds) result += numberToWords(hundreds) + " Hundred ";

        if (lastTwo) {
            if (result !== "") result += "and ";
            result += numberToWords(lastTwo);
        }

        return result.trim();
    };


    const dateToWords = (dateStr) => {
        if (!dateStr) return "";

        const date = new Date(dateStr);

        const day = numberToWords(date.getDate());
        const year = yearToWords(date.getFullYear());

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const month = months[date.getMonth()];

        return `${day} ${month} ${year}`;
    };

    // ================= DOWNLOAD PDF =================
    const downloadPDF = async () => {
        setIsPDF(true);

        await new Promise(r => setTimeout(r, 300));

        const el = document.querySelector(".tc-box");

        //  AUTO SCALE BASED ON HEIGHT
        // const A4_HEIGHT = 1122; // px approx for A4 at 96dpi
        // const contentHeight = el.scrollHeight;

        // let scale = 1;

        // if (contentHeight > A4_HEIGHT) {
        //     scale = A4_HEIGHT / contentHeight;
        // }

        // el.style.transform = `scale(${scale})`;
        // el.style.transformOrigin = "top left";

        window.print();

        setTimeout(() => {
            el.style.transform = "scale(1)";
            setIsPDF(false);
        }, 800);
    };
    const isFinal = tc?.status === "final";

    return (
        <Layout>
            <div className="tc-page">

                {/* ================= FILTER ================= */}
                {!isPDF && (
                    <>
                        <h2>Transfer Certificate</h2>

                        <div className="filters">
                            <select
                                value={selectedClass}
                                onChange={(e) => {
                                    setSelectedClass(e.target.value);
                                    setStudentId("");
                                    setTc(null);
                                }}
                            >
                                <option value="">-- Select Class --</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.class_name}>
                                        {c.class_name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={studentType}
                                onChange={(e) => {
                                    setStudentType(e.target.value);
                                    setStudentId("");
                                    setTc(null);
                                }}
                            >
                                <option value="active">Current Students</option>
                                <option value="inactive">TC / Passout Students</option>
                            </select>

                            <select
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                            >
                                <option value="">-- Select Student --</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>

                            <button onClick={loadTC}>Load TC</button>
                        </div>
                    </>
                )}

                {loading && <p>Loading...</p>}

                {/* ================= TC ================= */}
                {tc && (
                    <>
                        {!isPDF && !isFinal && (
                            <div className="actions">
                                <button onClick={saveTC}>Save Draft</button>
                                <button onClick={finalizeTC}>Finalize</button>
                            </div>
                        )}

                        {!isPDF && (
                            <div className="actions">
                                <p><b>TC No:</b> {tc.tc_number}</p>
                                <button onClick={downloadPDF}>Download PDF</button>
                            </div>
                        )}

                        <div className={`tc-container ${isPDF ? "pdf-mode" : ""}`}>
                            <div className="tc-box">

                                {/* HEADER */}
                                <div className="tc-header">
                                    <div className="tc-logo">
                                        <h2>Established 2013</h2>
                                        <img src={Logo} alt="logo" />
                                        <h3> विद्या ददाति विनयं </h3>
                                    </div>

                                    <div className="tc-school">
                                        <h1 className="school-name">ABM PUBLIC SCHOOL</h1>
                                        <p className="school-intro">Rajaswa Colony, Main Road, Sarkanda</p>
                                        <p className="school-intro">Bilaspur (C.G.) - 495001</p>

                                        <div className="tc-school-number">
                                            <p className="school-intro">Phone no: 9303219216, 07752442199</p>
                                        </div>
                                    </div>

                                    {/* <div className="tc-left">
                                        <h2 className="school-udise">UDISE: 22070320910</h2>
                                    </div> */}
                                </div>

                                {/* TITLE */}
                                <div className="tc-title">
                                    <h2 className="performance-name">TRANSFER CERTIFICATE</h2>
                                </div>

                                {/* META */}
                                <div className="tc-meta">
                                    <div className="tc-row">
                                        <div className="tc-label">
                                            <span>Serial No: </span> </div>
                                        <div className="tc-value tc-value-serial">
                                            {isPDF ? (
                                                <b>{tc.tc_number || ""}</b>
                                            ) : (
                                                <input
                                                    className="clean-input"
                                                    value={tc.tc_number || ""}
                                                    onChange={(e) => handleChange("tc_number", e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <span>UDISE: 22070320910</span>
                                </div>

                                {/* CONTENT */}
                                <div className="tc-content numbered">

                                    <div className="tc-row">
                                        <div className="tc-label">1. Name of Student</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b>{tc.name || ""}</b> :
                                                <input
                                                    className="clean-input"
                                                    value={tc.name || ""}
                                                    onChange={(e) => handleChange("name", e.target.value)}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="tc-row">
                                        <div className="tc-label">2. Admission No.</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.admission_no || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.admission_no || ""}
                                                    onChange={(e) => handleChange("admission_no", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">

                                        <div className="tc-label">3. PEN No.</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.pen_no || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.pen_no || ""}
                                                    onChange={(e) => handleChange("pen_no", e.target.value)}
                                                />}
                                        </div>
                                    </div>
                                    <div className="tc-row">
                                        <div className="tc-label">4. Date of Admission</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? (
                                                <b>
                                                    {tc.admission_date
                                                        ? new Date(tc.admission_date).toLocaleDateString("en-GB")
                                                        : ""}
                                                </b>
                                            ) : (
                                                <input
                                                    type="date"
                                                    className="clean-input"
                                                    value={tc.admission_date || ""}
                                                    onChange={(e) => handleChange("admission_date", e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">5. Name of Father / Guardian</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.father_name || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.father_name || ""}
                                                    onChange={(e) => handleChange("father_name", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">6. Name of Mother</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.mother_name || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.mother_name || ""}
                                                    onChange={(e) => handleChange("mother_name", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">7. Date of Birth</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? (
                                                <b>
                                                    {tc.dob
                                                        ? `${new Date(tc.dob).toLocaleDateString("en-GB")} (${dateToWords(tc.dob)})`
                                                        : ""}
                                                </b>
                                            ) : (
                                                <input
                                                    type="date"
                                                    className="clean-input"
                                                    value={tc.dob || ""}
                                                    onChange={(e) => handleChange("dob", e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">8. Nationality</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.nationality || "INDIAN"}</b> :
                                                <input className="clean-input"
                                                    value={tc.nationality || "Indian"}
                                                    onChange={(e) => handleChange("nationality", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">9. Caste / Category </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.category || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.category || ""}
                                                    onChange={(e) => handleChange("category", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">10. Class to which Admitted</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.class_admitted || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.class_admitted || ""}
                                                    onChange={(e) => handleChange("class_admitted", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">12. Class Last Attended </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">

                                            {isPDF ? <b> {tc.class_at_leaving || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.class_at_leaving || ""}
                                                    onChange={(e) => handleChange("class_at_leaving", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">13. Promoted to Class </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.promoted_to || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.promoted_to || ""}
                                                    onChange={(e) => handleChange("promoted_to", e.target.value)}
                                                />}
                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">14. Medium of Instruction </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-label">
                                            {isPDF ? <b> {tc.medium || "English"}</b> :
                                                <input className="clean-input"
                                                    value={tc.medium || "English"}
                                                    onChange={(e) => handleChange("medium", e.target.value)}
                                                />}
                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">15. Whether Failed</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.failed || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.failed || ""}
                                                    onChange={(e) => handleChange("failed", e.target.value)}
                                                />}
                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">16. Whether RTE</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.rte || "no"}</b> :
                                                <input className="clean-input"
                                                    value={tc.rte || ""}
                                                    onChange={(e) => handleChange("failed", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">17. Fee Paid Till </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.fees_paid_till || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.fees_paid_till || ""}
                                                    onChange={(e) => handleChange("fees_paid_till", e.target.value)}
                                                />}
                                        </div>
                                    </div>

                                    <div className="tc-row">
                                        <div className="tc-label">18. Fee Concession </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.fee_concession || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.fee_concession || ""}
                                                    onChange={(e) => handleChange("fee_concession", e.target.value)}
                                                />}
                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">19. Attendance in Last Class </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.attendance || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.attendance || ""}
                                                    onChange={(e) => handleChange("attendance", e.target.value)}
                                                />}
                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">20. General Conduct </div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.conduct || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.conduct || ""}
                                                    onChange={(e) => handleChange("conduct", e.target.value)}
                                                />}
                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">
                                            21. Date of Application of TC
                                        </div>

                                        <div className="tc-separator">:</div>

                                        <div className="tc-value">

                                            {isPDF ? (
                                                <b>{tc.date_of_application || ""}</b>
                                            ) : (
                                                <input
                                                    className="clean-input"
                                                    value={tc.date_of_application || ""}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            "date_of_application",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            )}

                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">22. Date of Issue of TC</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.issue_date || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.issue_date || ""}
                                                    onChange={(e) => handleChange("issue_date", e.target.value)}
                                                />}
                                        </div>
                                    </div>


                                    <div className="tc-row">
                                        <div className="tc-label">23. Reason for Leaving School</div>
                                        <div className="tc-separator">:</div>
                                        <div className="tc-value">
                                            {isPDF ? <b> {tc.reason || ""}</b> :
                                                <input className="clean-input"
                                                    value={tc.reason || ""}
                                                    onChange={(e) => handleChange("reason", e.target.value)}
                                                />}
                                        </div>
                                    </div>
                                </div>



                                {/* FOOTER */}
                                <div className="tc-footer">
                                    <div className="checkedby">Checked By</div>
                                    <div className="principal-signature">Principal Signature</div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div> {/* tc-page */}
        </Layout>
    );
}

export default TransferCertificate;