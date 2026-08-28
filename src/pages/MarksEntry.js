import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

import { useLoader } from "../context/LoaderContext";

/* ---------------- HELPERS ---------------- */

const getAcademicYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

/* ---------------- COMPONENT ---------------- */

function MarksEntry() {

  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const [classId, setClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [examId, setExamId] = useState("");

  const [marksData, setMarksData] = useState([]);

  const [academicYear] = useState(getAcademicYear());

  const [coScholastic, setCoScholastic] = useState([
    { activity: "General Knowledge", grade: "" },
    { activity: "Moral Science", grade: "" },
    { activity: "Computer Science", grade: "" },
    { activity: "Music/Dance", grade: "" },
    { activity: "Drawing/Craft", grade: "" },
    { activity: "Health & Physical Education", grade: "" }
  ]);

  const [loading, setLoading] = useState(false);

  const { showLoader, hideLoader } = useLoader();

  /* ---------------- LOAD META ---------------- */
  useEffect(() => {
    axios.get(`${API_BASE}/getMarksMeta.php`)
      .then(res => {
        setClasses(res.data.classes || []);
        setExams(res.data.exams || []);
      })
      .catch(console.error);
  }, []);

  /* ---------------- LOAD STUDENTS + SUBJECTS ---------------- */
  useEffect(() => {

    if (!classId) return;

    setLoading(true);

    axios.get(`${API_BASE}/getMarksMeta.php`, {
      params: {
        class_id: classId,
        academic_year: academicYear
      }
    })
      .then(res => {

        const studentsData = res.data.students || [];
        const subjectsData = res.data.subjects || [];

        /* ---------- SUBJECT ORDER ---------- */
        const subjectOrder = [
          "English 1",
          "English 2",
          "Hindi 1",
          "Hindi 2",
          "Mathematics",
          "Science/EVS",
          "Social Science",
          "Sanskrit"
        ];

        const sortedSubjects = [...subjectsData].sort(
          (a, b) =>
            subjectOrder.indexOf(a.name) -
            subjectOrder.indexOf(b.name)
        );

        setStudents(studentsData);
        setSubjects(sortedSubjects);
        setExams(res.data.exams || []);

        setMarksData(
          sortedSubjects.map(sub => ({
            subject_id: sub.id,
            subject_name: sub.name,
            pt: "",
            nb: "",
            se: "",
            exam: ""
          }))
        );

        // reset co-scholastic
        setCoScholastic(prev =>
          prev.map(item => ({ ...item, grade: "" }))
        );

      })
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [classId, academicYear]);

  /* ---------------- MARKS CHANGE ---------------- */
  const handleMarksChange = (index, field, value) => {

    let val = value === "" ? "" : Number(value);

    if (val !== "") {
      if (["pt", "nb", "se"].includes(field) && val > 10) val = 10;
      if (field === "exam" && val > 70) val = 70;
      if (val < 0) val = 0;
    }

    const updated = [...marksData];
    updated[index][field] = val;

    setMarksData(updated);
  };

  /* ---------------- CO-SCHOLASTIC ---------------- */
  const handleCoScholasticChange = (index, value) => {
    const updated = [...coScholastic];
    updated[index].grade = value;
    setCoScholastic(updated);
  };

  /*------------------Predefined-Data comes up-----------------*/
  // useEffect(() => {

  //   if (!studentId || !examId || subjects.length === 0) return;

  //   axios.get(`${API_BASE}/getStudentMarks.php`, {
  //     params: {
  //       student_id: studentId,
  //       exam_id: examId
  //     }
  //   })
  //     .then(res => {

  //       if (!res.data.status) return;

  //       const existingMarks = res.data.marks || {};
  //       const existingECA = res.data.eca || {};


  //       /* ---------- PREFILL ECA ---------- */
  //       const updatedECA = coScholastic.map(item => ({
  //         ...item,
  //         grade: existingECA[item.activity] || ""
  //       }));

  //       setCoScholastic(updatedECA);

  //     })
  //     .catch(console.error);

  // }, [studentId, examId, subjects]);

  // /*---------------MAKING THE ABOVE USE EFFECT LOGIC REUSABLE ----------
  const fetchStudentMarks = async () => {

    if (!studentId || !examId) {
      alert("Select student and exam first");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/getStudentsMarks.php`, {
        params: {
          student_id: studentId,
          exam_id: examId
        }
      });

      if (!res.data.status) {
        alert("No existing data found");
        return;
      }

      const existingMarks = res.data.marks || {};
      const existingECA = res.data.eca || {};

      /* ---------- PREFILL MARKS ---------- */
      const updatedMarks = subjects.map(sub => {
        const m = existingMarks[String(sub.id)] || {};

        return {
          subject_id: sub.id,
          subject_name: sub.name,
          pt: m.pt_marks ?? "",
          nb: m.notebook_marks ?? "",
          se: m.enrichment_marks ?? "",
          exam: m.exam_marks ?? ""
        };
      });

      setMarksData(updatedMarks);

      /* ---------- PREFILL ECA ---------- */
      const updatedECA = coScholastic.map(item => ({
        ...item,
        grade: existingECA[item.activity] || ""
      }));

      setCoScholastic(updatedECA);

    } catch (err) {
      console.error(err);
      alert("Error fetching marks");
    }
  };
  // /* ---------------- SUBMIT ---------------- */
  const submitMarks = async () => {

    if (loading) return;

    if (!classId) return alert("Select class");
    if (!studentId) return alert("Select student");
    if (!examId) return alert("Select exam");

    setLoading(true);
    showLoader();

    try {

      const payload = {
        student_id: Number(studentId),
        exam_id: Number(examId),
        academic_year: academicYear,

        marks: marksData.map(m => ({
          subject_id: Number(m.subject_id),
          pt_marks: Number(m.pt || 0),
          notebook_marks: Number(m.nb || 0),
          enrichment_marks: Number(m.se || 0),
          exam_marks: Number(m.exam || 0)
        })),

        co_scholastic: coScholastic
      };

      const res = await axios.post(
        `${API_BASE}/addMarks.php`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.status) {
        alert("Saved Successfully");

        // REFETCH DATA INSTEAD OF RESET
        axios.get(`${API_BASE}/getStudentsMarks.php`, {
          params: {
            student_id: studentId,
            exam_id: examId
          }
        }).then(res => {

          if (!res.data.status) return;

          const existingMarks = res.data.marks || {};
          const existingECA = res.data.eca || {};

          const updatedMarks = subjects.map(sub => {
            const m = existingMarks[String(sub.id)] || {};

            return {
              subject_id: sub.id,
              subject_name: sub.name,
              pt: m.pt_marks ?? "",
              nb: m.notebook_marks ?? "",
              se: m.enrichment_marks ?? "",
              exam: m.exam_marks ?? ""
            };
          });

          setMarksData(updatedMarks);

          const updatedECA = coScholastic.map(item => ({
            ...item,
            grade: existingECA[item.activity] || ""
          }));

          setCoScholastic(updatedECA);

        });

      } else {
        alert(res.data.message || "Error saving");
      }

    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      hideLoader();
      setLoading(false);
    }


  };

  /* ---------------- UI ---------------- */
  return (
    <Layout>

      <Typography variant="h5" gutterBottom>
        Marks Entry
      </Typography>

      <Card>
        <CardContent>

          {/* SELECTORS */}
          <Grid container spacing={3} mb={3}>

            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Select Class"
                value={classId}
                onChange={(e) => {
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
              <TextField select fullWidth label="Select Student"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              >
                {students.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} ({s.section})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField select fullWidth label="Select Exam"
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
              >
                {exams.map(ex => (
                  <MenuItem key={ex.id} value={ex.id}>
                    {ex.exam_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={fetchStudentMarks}
              >
                Load Existing Marks
              </Button>
            </Grid>

          </Grid>

          {/* SUBJECT MARKS */}
          <Grid container spacing={2}>
            {marksData.map((m, index) => {

              const total =
                (Number(m.pt) || 0) +
                (Number(m.nb) || 0) +
                (Number(m.se) || 0) +
                (Number(m.exam) || 0);

              return (
                <Grid item xs={12} key={m.subject_id}>
                  <Card sx={{ p: 2, background: "#f9fafb" }}>

                    <Typography fontWeight="bold">
                      {m.subject_name}
                    </Typography>

                    <Grid container spacing={2}>
                      {["pt", "nb", "se", "exam"].map(field => (
                        <Grid item xs={3} key={field}>
                          <TextField
                            fullWidth
                            label={field.toUpperCase()}
                            type="number"
                            value={m[field]}
                            onChange={(e) =>
                              handleMarksChange(index, field, e.target.value)
                            }
                            onWheel={(e) => e.target.blur()}
                          />
                        </Grid>
                      ))}
                    </Grid>

                    <Typography mt={1} color="primary">
                      Total: {total} / 100
                    </Typography>

                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* CO-SCHOLASTIC */}
          <Card sx={{ mt: 4, p: 2, background: "#fefce8" }}>
            <Typography variant="h6">Co-Scholastic Areas</Typography>

            <Grid container spacing={3}>
              {coScholastic.map((item, index) => (
                <Grid item xs={12} md={12} key={index}>
                  <TextField
                    select
                    fullWidth
                    label={item.activity}
                    value={item.grade}
                    onChange={(e) =>
                      handleCoScholasticChange(index, e.target.value)
                    } sx={{
                      "& .MuiInputBase-root": {
                        width: 160,
                        fontSize: "16px"
                      }
                    }}
                  >
                    <MenuItem value="">Select Grade</MenuItem>
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                    <MenuItem value="D">D</MenuItem>
                  </TextField>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Button
            variant="contained"
            sx={{ mt: 3, background: "#1E3A8A" }}
            onClick={submitMarks}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save All Data"}
          </Button>

        </CardContent>
      </Card>

    </Layout>
  );
}

export default MarksEntry;