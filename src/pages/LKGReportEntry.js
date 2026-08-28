import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

/* ---------------- Helpers ---------------- */

const getAcademicYear = (date = new Date()) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

const grades = ["A1", "A2", "B1", "B2", "C1", "C2", "D"];

const inputStyle = {
    width: "100%",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc"
};

/* ---------------- Reusable Components ---------------- */

const GradeDropdown = ({ value, onChange }) => (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        <option value="">Select</option>
        {grades.map((g) => (
            <option key={g} value={g}>{g}</option>
        ))}
    </select>
);

const YesNoDropdown = ({ value, onChange }) => (
    <select value={value || ""} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
        <option value="">Select</option>
        <option value="YES">Yes</option>
        <option value="NO">No</option>
    </select>
);

const Row = ({ label, children }) => (
    <tr style={{ borderBottom: "1px solid #eee" }}>
        <td style={{ padding: "10px", width: "60%", fontWeight: "500" }}>{label}</td>
        <td style={{ padding: "10px" }}>{children}</td>
    </tr>
);

const Section = ({ title, children }) => (
    <div style={{
        marginBottom: "25px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        overflow: "hidden"
    }}>
        <div style={{
            background: "#4f46e5",
            color: "#fff",
            padding: "10px 15px",
            fontWeight: "600"
        }}>
            {title}
        </div>

        <table width="100%" style={{ borderCollapse: "collapse" }}>
            <tbody>{children}</tbody>
        </table>
    </div>
);

/* ---------------- Main Component ---------------- */

export default function LKGReportEntry() {

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");

    const [form, setForm] = useState({
        student_id: "",
        term: "Term1",
        academic_year: getAcademicYear(),

        // English
        eng_reading: "", eng_writing: "", eng_recognition: "",
        eng_conversation: "", eng_recitation: "", eng_dictation: "",

        // Hindi
        hin_vachan: "", hin_lekhan: "", hin_parigyan: "",
        hin_vartalaap: "", hin_kavita: "", hin_shrit_lekhan: "",

        // Maths
        math_concepts: "", math_problem_solving: "", math_digits: "",
        math_counting: "", math_tables: "", math_dodging: "",

        // Co-Curricular
        cc_art: "", cc_coloring: "", cc_drawing: "", cc_music: "", cc_sports: "",

        // Personal Traits
        pt_concentration: "", pt_confidence: "", pt_reliance: "", pt_etiquettes: "",

        // Study Habits
        sh_regularity: "", sh_punctuality: "",
        sh_homework: "", sh_classwork: "", sh_attention: "",

        // Social Habits
        so_indoor: "", so_outdoor: "", so_cultural: "",
        so_physical: "", so_peers: "", so_teachers: "", so_sharing: "",

        // Other
        ot_creativity: "", ot_tiffin: "", ot_support: "",

        // Attendance
        working_days: "",
        present_days: "",
        absent_days: ""
    });

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    /* AUTO ABSENT */
    useEffect(() => {
        const wd = Number(form.working_days);
        const pd = Number(form.present_days);

        if (!isNaN(wd) && !isNaN(pd)) {
            setForm(prev => ({
                ...prev,
                absent_days: wd - pd
            }));
        }
    }, [form.working_days, form.present_days]);

    /* FETCH STUDENTS */
    // useEffect(() => {
    //     axios.get("https://lightblue-wolverine-671984.hostingersite.com/api/getStudents.php")
    //         .then(res => setStudents(res.data.data || []))
    //         .catch(err => console.error(err));
    // }, []);

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

    useEffect(() => {

        if (!selectedClass) {
            setStudents([]);
            return;
        }

        axios
            .get(`https://lightblue-wolverine-671984.hostingersite.com/api/getStudents.php?class=${selectedClass}`)
            .then(res => {
                if (res.data.status) {
                    setStudents(res.data.data || []);
                }
            })
            .catch(err => console.error(err));

    }, [selectedClass]);

    /* SUBMIT */
    const handleSubmit = async () => {

        if (loading) return;

        setLoading(true);

        try {
            const res = await axios.post(
                "https://lightblue-wolverine-671984.hostingersite.com/api/save_lkg_report.php",
                form,
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.status) {
                alert("Saved Successfully");

                setForm({
                    ...form,
                    student_id: "",
                    term: "Term1",
                    academic_year: getAcademicYear(),

                    working_days: "",
                    present_days: "",
                    absent_days: ""
                });

            } else {
                alert(res.data.message || "Error saving");
            }

        } catch (err) {
            console.error(err);
            alert("Server Error");
        }finally{
            setLoading(false);
        }

        
    };

    return (
        <Layout>
            <div style={{
                height: "100vh",
                overflowY: "auto",
                background: "#f5f7fb",
                padding: "20px"
            }}>
                <div style={{ maxWidth: "900px", margin: "auto" }}>

                    <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                        Play Group / Nursery Report Entry
                    </h2>

                    <select
                        value={selectedClass}
                        onChange={(e) => {
                            setSelectedClass(e.target.value);
                            handleChange("student_id", ""); // reset student
                        }}
                        style={inputStyle}
                    >
                        <option value="">Select Class</option>

                        {classes.map(c => {
                            const cleanClass = c.class_name.replace("Class ", "").trim();

                            return (
                                <option key={c.id} value={cleanClass}>
                                    {c.class_name}
                                </option>
                            );
                        })}
                    </select>

                    {/* Student + Term */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        <select value={form.student_id}
                            onChange={(e) => handleChange("student_id", e.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Select Student</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.section}) - {s.admission_no}
                                </option>
                            ))}
                        </select>

                        <select value={form.term}
                            onChange={(e) => handleChange("term", e.target.value)}
                            style={inputStyle}
                        >
                            <option value="Term1">Term 1</option>
                            <option value="Term2">Term 2</option>
                        </select>
                    </div>

                    {/* Sections (ALL restored) */}
                    <Section title="English">
                        <Row label="Reading"><GradeDropdown value={form.eng_reading} onChange={(v) => handleChange("eng_reading", v)} /></Row>
                        <Row label="Writing"><GradeDropdown value={form.eng_writing} onChange={(v) => handleChange("eng_writing", v)} /></Row>
                        <Row label="Recognition"><GradeDropdown value={form.eng_recognition} onChange={(v) => handleChange("eng_recognition", v)} /></Row>
                        <Row label="Conversation"><GradeDropdown value={form.eng_conversation} onChange={(v) => handleChange("eng_conversation", v)} /></Row>
                        <Row label="Recitation"><GradeDropdown value={form.eng_recitation} onChange={(v) => handleChange("eng_recitation", v)} /></Row>
                        <Row label="Dictation"><GradeDropdown value={form.eng_dictation} onChange={(v) => handleChange("eng_dictation", v)} /></Row>
                    </Section>

                    {/* Hindi */}
                    <Section title="Hindi">
                        <Row label="Vachan Kaushal"><GradeDropdown value={form.hin_vachan} onChange={(v) => handleChange("hin_vachan", v)} /></Row>
                        <Row label="Lekhan Kaushal"><GradeDropdown value={form.hin_lekhan} onChange={(v) => handleChange("hin_lekhan", v)} /></Row>
                        <Row label="Parigyan"><GradeDropdown value={form.hin_parigyan} onChange={(v) => handleChange("hin_parigyan", v)} /></Row>
                        <Row label="Vartalaap"><GradeDropdown value={form.hin_vartalaap} onChange={(v) => handleChange("hin_vartalaap", v)} /></Row>
                        <Row label="Kavita Path"><GradeDropdown value={form.hin_kavita} onChange={(v) => handleChange("hin_kavita", v)} /></Row>
                        <Row label="Shrut Lekhan"><GradeDropdown value={form.hin_shrit_lekhan} onChange={(v) => handleChange("hin_shrit_lekhan", v)} /></Row>
                    </Section>

                    {/* Mathematics */}
                    <Section title="Mathematics">
                        <Row label="Understanding Concepts"><GradeDropdown value={form.math_concepts} onChange={(v) => handleChange("math_concepts", v)} /></Row>
                        <Row label="Problem Solving"><GradeDropdown value={form.math_problem_solving} onChange={(v) => handleChange("math_problem_solving", v)} /></Row>
                        <Row label="Forming Digits"><GradeDropdown value={form.math_digits} onChange={(v) => handleChange("math_digits", v)} /></Row>
                        <Row label="Counting"><GradeDropdown value={form.math_counting} onChange={(v) => handleChange("math_counting", v)} /></Row>
                        <Row label="Tables"><GradeDropdown value={form.math_tables} onChange={(v) => handleChange("math_tables", v)} /></Row>
                        <Row label="Dodging"><GradeDropdown value={form.math_dodging} onChange={(v) => handleChange("math_dodging", v)} /></Row>
                    </Section>

                    {/* Co-Curricular */}
                    <Section title="Co-Curricular Activities">
                        <Row label="Art/Craft"><GradeDropdown value={form.cc_art} onChange={(v) => handleChange("cc_art", v)} /></Row>
                        <Row label="Coloring/Painting"><GradeDropdown value={form.cc_coloring} onChange={(v) => handleChange("cc_coloring", v)} /></Row>
                        <Row label="Drawing"><GradeDropdown value={form.cc_drawing} onChange={(v) => handleChange("cc_drawing", v)} /></Row>
                        <Row label="Music/Dance"><GradeDropdown value={form.cc_music} onChange={(v) => handleChange("cc_music", v)} /></Row>
                        <Row label="Sports"><GradeDropdown value={form.cc_sports} onChange={(v) => handleChange("cc_sports", v)} /></Row>
                    </Section>

                    {/* Personal Traits */}
                    <Section title="Personal Traits">
                        <Row label="Concentration"><GradeDropdown value={form.pt_concentration} onChange={(v) => handleChange("pt_concentration", v)} /></Row>
                        <Row label="Self Confidence"><GradeDropdown value={form.pt_confidence} onChange={(v) => handleChange("pt_confidence", v)} /></Row>
                        <Row label="Self Reliance"><GradeDropdown value={form.pt_reliance} onChange={(v) => handleChange("pt_reliance", v)} /></Row>
                        <Row label="Etiquettes & Manners"><GradeDropdown value={form.pt_etiquettes} onChange={(v) => handleChange("pt_etiquettes", v)} /></Row>
                    </Section>

                    {/* Study Habits */}
                    <Section title="Study Habits">
                        <Row label="Regularity"><GradeDropdown value={form.sh_regularity} onChange={(v) => handleChange("sh_regularity", v)} /></Row>
                        <Row label="Punctuality"><GradeDropdown value={form.sh_punctuality} onChange={(v) => handleChange("sh_punctuality", v)} /></Row>
                        <Row label="Completes Homework"><YesNoDropdown value={form.sh_homework} onChange={(v) => handleChange("sh_homework", v)} /></Row>
                        <Row label="Completes Classwork"><YesNoDropdown value={form.sh_classwork} onChange={(v) => handleChange("sh_classwork", v)} /></Row>
                        <Row label="Requires Special Attention"><YesNoDropdown value={form.sh_attention} onChange={(v) => handleChange("sh_attention", v)} /></Row>
                    </Section>

                    {/* Social Habits */}
                    <Section title="Social Habits">
                        <Row label="Indoor Activities"><GradeDropdown value={form.so_indoor} onChange={(v) => handleChange("so_indoor", v)} /></Row>
                        <Row label="Outdoor Activities"><GradeDropdown value={form.so_outdoor} onChange={(v) => handleChange("so_outdoor", v)} /></Row>
                        <Row label="Cultural Activities"><GradeDropdown value={form.so_cultural} onChange={(v) => handleChange("so_cultural", v)} /></Row>
                        <Row label="Physical Activities"><GradeDropdown value={form.so_physical} onChange={(v) => handleChange("so_physical", v)} /></Row>
                        <Row label="Interaction With Peers"><GradeDropdown value={form.so_peers} onChange={(v) => handleChange("so_peers", v)} /></Row>
                        <Row label="Interaction With Teachers"><GradeDropdown value={form.so_teachers} onChange={(v) => handleChange("so_teachers", v)} /></Row>
                        <Row label="Sharing"><GradeDropdown value={form.so_sharing} onChange={(v) => handleChange("so_sharing", v)} /></Row>
                    </Section>

                    {/* Other */}
                    <Section title="Other Activities">
                        <Row label="Creativity"><GradeDropdown value={form.ot_creativity} onChange={(v) => handleChange("ot_creativity", v)} /></Row>
                        <Row label="Tiffin Interest"><GradeDropdown value={form.ot_tiffin} onChange={(v) => handleChange("ot_tiffin", v)} /></Row>
                        <Row label="Support From Home"><GradeDropdown value={form.ot_support} onChange={(v) => handleChange("ot_support", v)} /></Row>
                    </Section>

                    {/* Attendance */}
                    <Section title="Attendance">
                        <Row label="Working Days">
                            <input type="number" value={form.working_days} onChange={(e) => handleChange("working_days", e.target.value)} style={inputStyle} />
                        </Row>
                        <Row label="Present Days">
                            <input type="number" value={form.present_days} onChange={(e) => handleChange("present_days", e.target.value)} style={inputStyle} />
                        </Row>
                        <Row label="Absent Days">
                            <input type="number" value={form.absent_days} readOnly style={{ ...inputStyle, background: "#eee" }} />
                        </Row>
                    </Section>

                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            style={{
                                padding: "12px 25px",
                                background: "#4f46e5",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                        >
                            {loading ? "Saving..." : "Save Report"}
                        </button>
                    </div>

                </div>
            </div>
        </Layout>
    );
}