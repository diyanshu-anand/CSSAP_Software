import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";
import { useLoader } from "../context/LoaderContext";


import {
    Card, CardContent, Typography,
    Grid, TextField, MenuItem,
    Table, TableHead, TableRow,
    TableCell, TableBody, Button
} from "@mui/material";

function ReportCard() {

    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);

    const [classId, setClassId] = useState("");
    const [studentId, setStudentId] = useState("");
    const [examId, setExamId] = useState("");


    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    // Loader defination
    const { showLoader, hideLoader } = useLoader();

    const getAcademicYear = (date) => {
        const month = date.getMonth() + 1;

        if (month >= 4) {
            return `${date.getFullYear()}-${(date.getFullYear() + 1).toString().slice(-2)}`;
        } else {
            return `${date.getFullYear() - 1}-${date.getFullYear().toString().slice(-2)}`;
        }
    };


    // const academicYear = getAcademicYear(new Date());
    const [academicYear, setAcademicYear] = useState(getAcademicYear(new Date()));

    /* LOAD CLASSES + EXAMS */

    useEffect(() => {

        axios.get(`${API_BASE}/getMarksMeta.php`)
            .then(res => {

                setClasses(res.data.classes || []);
                setExams(res.data.exams || []);

            })
            .catch(err => console.error(err));

    }, []);


    /* LOAD STUDENTS WHEN CLASS CHANGES */

    useEffect(() => {

        if (classId === "") return;

        axios.get(`${API_BASE}/getMarksMeta.php?class_id=${classId}`)
            .then(res => {

                setStudents(res.data.students || []);

            })
            .catch(err => console.error(err));

    }, [classId]);


    /* FETCH REPORT */

    const fetchReport = async () => {

        if (!studentId) {
            alert("Select student");
            return;
        }

        showLoader();

        try {

            setLoading(true);

            window.open(
                `${API_BASE}/generateReportPDF.php?student_id=${studentId}&exam_id=${examId}`,
                "_blank"
            );

            const data = res.data?.data;

            if (!data) {
                setReport(null);
                alert("No report data found");
                return;
            }

            //  Convert backend format → frontend expected format
            const formattedReport = {
                student: data.student,
                term1: data.term1,
                term2: data.term2,

                // optional fallback fields so UI doesn't break
                subjects: [],
                total_obtained: 0,
                total_marks: 0,
                percentage: 0,
                grade: "-"
            };

            setReport(formattedReport);

        } catch (err) {
            console.error(err);
            setReport(null);
        } finally {
            setLoading(false);
            hideLoader();
        }
    };


    return (

        <Layout>

            <Typography variant="h5" gutterBottom>
                Report Card Generation
            </Typography>


            <Card sx={{ mb: 3 }}>
                <CardContent>

                    <Grid container spacing={3}>


                        {/* CLASS SELECT */}

                        <Grid item xs={12} md={4}>

                            <TextField
                                select
                                fullWidth
                                label="Select Class"
                                value={classId}
                                onChange={e => {

                                    setClassId(e.target.value);
                                    setStudentId("");

                                }}
                            >

                                {classes.map(c => (

                                    <MenuItem key={c.id} value={c.id}>
                                        {c.class_name}
                                    </MenuItem>

                                ))}

                            </TextField>

                        </Grid>

                        <Grid item xs={12} md={4}>

                            <TextField
                                select
                                fullWidth
                                label="Academic Year"
                                value={academicYear}
                                onChange={(e) => setAcademicYear(e.target.value)}
                            >
                                <MenuItem value="2025-26">2025-26</MenuItem>
                                <MenuItem value="2024-25">2024-25</MenuItem>
                            </TextField>
                        </Grid>

                        {/* STUDENT SELECT */}

                        <Grid item xs={12} md={4}>

                            <TextField
                                select
                                fullWidth
                                label="Select Student"
                                value={studentId}
                                onChange={e => setStudentId(e.target.value)}
                            >

                                {students.map(s => (

                                    <MenuItem key={s.id} value={s.id}>
                                        {s.name} ({s.section})
                                    </MenuItem>

                                ))}

                            </TextField>

                        </Grid>


                        {/* EXAM SELECT */}

                        <Grid item xs={12} md={4}>

                            <TextField
                                select
                                fullWidth
                                label="Select Exam"
                                value={examId}
                                onChange={e => setExamId(e.target.value)}
                            >

                                {exams.map(ex => (

                                    <MenuItem key={ex.id} value={ex.id}>
                                        {ex.exam_name}
                                    </MenuItem>

                                ))}

                            </TextField>

                        </Grid>


                        <Grid item xs={12} md={3}>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={fetchReport}
                                disabled={loading}
                            >

                                {loading ? "Loading..." : "Generate"}

                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={() => {

                                    if (!studentId || !examId) {
                                        alert("Select student & exam first");
                                        return;
                                    }

                                    window.open(
                                        `${API_BASE}/generateReportPDF.php?student_id=${studentId}&academic_year=${academicYear}`,
                                        "_blank"
                                    );

                                }}
                            >

                                Download PDF

                            </Button>

                        </Grid>

                    </Grid>

                </CardContent>
            </Card>


            {/* REPORT VIEW */}

            {report && (

                <Card>
                    <CardContent>

                        <Typography variant="h6" gutterBottom>
                            Student Report
                        </Typography>

                        {/* STUDENT INFO */}
                        <Typography>
                            <b>Name:</b> {report.student?.name}
                        </Typography>

                        <Typography>
                            <b>Class:</b> {report.student?.class} - {report.student?.section}
                        </Typography>

                        <Typography>
                            <b>Admission No:</b> {report.student?.admission_no}
                        </Typography>

                        <hr />

                        {/* TERM 2 DATA (your main data) */}
                        <Typography variant="subtitle1">
                            <b>Term 2 Result</b>
                        </Typography>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Subject</TableCell>
                                    <TableCell>Grade</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {Object.entries(report.term2 || {})
                                    .filter(([key, value]) =>
                                        value !== null &&
                                        value !== "" &&
                                        ![
                                            "id",
                                            "student_id",
                                            "term",
                                            "created_at",
                                            "updated_at",
                                            "academic_year"
                                        ].includes(key)
                                    )
                                    .map(([key, value], index) => (
                                        <TableRow key={index}>
                                            <TableCell>{key}</TableCell>
                                            <TableCell>{value?.toString().trim() ? value : "-"}</TableCell>
                                        </TableRow>
                                    ))
                                }

                            </TableBody>
                        </Table>

                    </CardContent>
                </Card>

            )}

        </Layout>

    );

}

export default ReportCard;