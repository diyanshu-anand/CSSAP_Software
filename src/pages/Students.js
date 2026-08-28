import { useEffect, useState, useRef } from "react";
import axios from "axios";
import API_BASE from "../config";
import { v4 as uuidv4 } from "uuid";
import Layout from "../components/Layout";


import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

function Students() {

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [editUUID, setEditUUID] = useState(null);

  const [photo, setPhoto] = useState(null);

  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const [selectedStudentUUID, setSelectedStudentUUID] = useState("");

  const [studentExitState, setStudentExitState] = useState("TC");

  const [exitRemarks, setExitRemarks] = useState("");

  const formRef = useRef(null);

  const [form, setForm] = useState({
    admission_no: "",
    pen_no: "",
    name: "",
    class: "",
    class_id: "",
    section: "",
    parent_name: "",
    parent_contact: "",
    dob: "",
    mother_name: "",
    address: "",
    roll_no: "",
    activity: "",
    rte: "NO",
    gender: "",
    caste: ""
  });

  /* ---------------- FETCH ---------------- */

  const fetchStudents = () => {
    axios.get(`${API_BASE}/getStudents.php`)
      .then(res => setStudents(res.data.data));
  };

  const fetchClasses = () => {
    axios.get(`${API_BASE}/getMarksMeta.php`)
      .then(res => setClasses(res.data.classes || []));
  };

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {

    if (!form.class_id) return alert("Select Class");

    const formData = new FormData();

    formData.append("action", isEdit ? "update" : "add");
    formData.append("uuid", isEdit ? editUUID : uuidv4());

    formData.append("admission_no", form.admission_no);
    formData.append("pen_no", form.pen_no);
    formData.append("name", form.name);

    formData.append("class_id", form.class_id);
    formData.append("class", form.class);

    formData.append("section", form.section);
    formData.append("parent_name", form.parent_name);
    formData.append("parent_contact", form.parent_contact);

    formData.append("computer", form.activity === "Computer" ? 1 : 0);
    formData.append("abacus", form.activity === "Abacus" ? 1 : 0);
    formData.append("taekwondo", form.activity === "Taekwondo" ? 1 : 0);

    formData.append("roll_no", form.roll_no);
    formData.append("dob", form.dob);
    formData.append("mother_name", form.mother_name);
    formData.append("address", form.address);
    formData.append("rte", form.rte);
    formData.append("gender", form.gender);
    formData.append("caste", form.caste);


    if (photo) {
      formData.append("photo", photo);
    }

    await axios.post(`${API_BASE}/addStudent.php`, formData);

    resetForm();
    fetchStudents();
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (s) => {
    setIsEdit(true);
    setEditUUID(s.uuid);

    setForm({
      admission_no: s.admission_no,
      pen_no: s.pen_no || "",
      name: s.name,
      class: s.class,
      class_id: s.class_id,
      section: s.section,
      parent_name: s.parent_name,
      parent_contact: s.parent_contact,
      dob: s.dob || "",
      mother_name: s.mother_name || "",
      address: s.address || "",
      roll_no: s.roll_no || "",
      gender: s.gender || "",
      caste: s.caste || "",

      rte: s.rte || "NO",

      activity: s.computer ? "Computer" :
        s.abacus ? "Abacus" :
          s.taekwondo ? "Taekwondo" : ""
    });

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }, 100);
  };

  /* ---------------- DELETE ---------------- */

  // const handleDelete = async (uuid) => {
  //   if (!window.confirm("Delete student?")) return;

  //   const formData = new FormData();
  //   formData.append("action", "delete");
  //   formData.append("uuid", uuid);

  //   await axios.post(`${API_BASE}/addStudent.php`, formData);
  //   fetchStudents();
  // };


  const handleDelete = (uuid) => {

    setSelectedStudentUUID(uuid);
    setStudentExitState("TC");
    setExitRemarks("");

    setExitDialogOpen(true);

  };

  const confirmStudentExit = async () => {

    const formData = new FormData();

    formData.append("action", "delete");
    formData.append("uuid", selectedStudentUUID);
    formData.append("student_state", studentExitState);
    formData.append("remarks", exitRemarks);

    await axios.post(`${API_BASE}/addStudent.php`, formData);

    setExitDialogOpen(false);

    fetchStudents();

  };
  /* ---------------- RESET ---------------- */

  const resetForm = () => {
    setForm({
      admission_no: "",
      pen_no: "",
      name: "",
      class: "",
      class_id: "",
      section: "",
      parent_name: "",
      parent_contact: "",
      dob: "",
      mother_name: "",
      address: "",
      roll_no: "",
      activity: "",
      gender: "",
      caste: ""
    });
    setIsEdit(false);
    setEditUUID(null);
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredStudents = students.filter((s) => {

    const query = search.toLowerCase().trim();

    // Build a single searchable string
    const searchableText = `
    ${s.name || ""}
    ${s.admission_no || ""}
    ${s.pen_no || ""}
    ${s.class || ""}
    ${s.section || ""}
    ${s.roll_no || ""}
  `.toLowerCase();

    const matchSearch =
      !query || searchableText.includes(query);

    const matchClass =
      filterClass === "" || s.class === filterClass;

    return matchSearch && matchClass;
  });

  const studentCount = filteredStudents.length;

  /* ---------------- UI ---------------- */

  return (
    <Layout>

      <Typography variant="h5">Student Management</Typography>

      {/* FORM */}
      <Card sx={{ mt: 2 }}>
        <CardContent>

          <Typography variant="h6">
            {isEdit ? "Edit Student" : "Add Student"}
          </Typography>

          <Grid container spacing={2} mt={1}>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Admission No"
                value={form.admission_no}
                onChange={(e) => setForm({ ...form, admission_no: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="PEN Number"
                value={form.pen_no}
                inputProps={{ maxLength: 11 }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // only digits
                  setForm({ ...form, pen_no: value });
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="RTE Student"
                value={form.rte}
                onChange={(e) =>
                  setForm({ ...form, rte: e.target.value })
                }
              >
                <MenuItem value="YES">YES</MenuItem>
                <MenuItem value="NO">NO</MenuItem>
              </TextField>
            </Grid>

            {/* CLASS */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Class"
                value={form.class_id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedClass = classes.find(c => c.id == selectedId);

                  setForm({
                    ...form,
                    class_id: selectedId,
                    class: selectedClass?.class_name || ""
                  });
                }}

                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    fontSize: "20px",
                    fontWeight: "700",
                    background: "#fff8e1",
                    width: "160px",           //  increases actual box height
                  },
                  "& .MuiSelect-select": {
                    padding: "14px 14px",     //  makes dropdown feel bigger
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "18px",
                    fontWeight: "bold",
                  }
                }}
              >
                <MenuItem value="">Select Class</MenuItem>
                {classes.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.class_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Section"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
              />
            </Grid>

            {/* ACTIVITY */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                label="Activity"
                value={form.activity}
                onChange={(e) =>
                  setForm({ ...form, activity: e.target.value })
                }
                sx={{
                  width: "100%",
                  "& .MuiInputBase-root": {
                    fontSize: "20px",
                    fontWeight: "700",
                    background: "#fff8e1",
                    width: "160px",           //  increases actual box height
                  },
                  "& .MuiSelect-select": {
                    padding: "14px 14px",     //  makes dropdown feel bigger
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: "18px",
                    fontWeight: "bold",
                  }
                }}

              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Computer">Computer</MenuItem>
                <MenuItem value="Abacus">Abacus</MenuItem>
                <MenuItem value="Taekwondo">Taekwondo</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Father's Name"
                value={form.parent_name}
                onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Parent Contact"
                value={form.parent_contact}
                onChange={(e) => setForm({ ...form, parent_contact: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Roll No"
                value={form.roll_no}
                onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Mother's Name"
                value={form.mother_name}
                onChange={(e) => setForm({ ...form, mother_name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                multiline
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Gender"
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Caste"
                value={form.caste}
                onChange={(e) =>
                  setForm({ ...form, caste: e.target.value })
                }
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="OBC">OBC</MenuItem>
                <MenuItem value="SC/ST">SC/ST</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
            </Grid>

          </Grid>

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            {isEdit ? "Update" : "Add"}
          </Button>

        </CardContent>
      </Card>



      {/* SEARCH + FILTER */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Name / Admission No"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Filter by Class"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {classes.map(c => (
                  <MenuItem key={c.id} value={c.class_name}>
                    {c.class_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Typography fontWeight="bold">
              Total Students: {studentCount}
            </Typography>

          </Grid>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card sx={{ mt: 3 }} ref={formRef}>
        <CardContent>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Adm No</TableCell>
                <TableCell>PEN</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Roll No</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Mother</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Activity</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Caste</TableCell>
                <TableCell>RTE</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStudents.map((s) => {

                console.log("DEBUG:", {
                  student_class_id: s.class_id,
                  filterClass: filterClass
                });

                return (
                  <TableRow key={s.uuid}>
                    <TableCell>{s.admission_no}</TableCell>
                    <TableCell>{s.pen_no || "-"}</TableCell>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.class}{s.section}</TableCell>

                    <TableCell>{s.roll_no || "-"}</TableCell>
                    <TableCell>{s.dob || "-"}</TableCell>
                    <TableCell>{s.mother_name || "-"}</TableCell>
                    <TableCell>{s.address || "-"}</TableCell>

                    <TableCell>
                      {s.computer ? "Computer" :
                        s.abacus ? "Abacus" :
                          s.taekwondo ? "Taekwondo" : "-"}
                    </TableCell>

                    <TableCell>{s.parent_name}</TableCell>
                    <TableCell>{s.gender}</TableCell>
                    <TableCell>{s.caste}</TableCell>
                    <TableCell>{s.rte || "NO"}</TableCell>

                    <TableCell>
                      <Button onClick={() => handleEdit(s)}>Edit</Button>
                      {/* <Button color="error" onClick={() => handleDelete(s.uuid)}>
                        Delete
                      </Button> */}

                      <Button
                        color="warning"
                        variant="outlined"
                        onClick={() => handleDelete(s.uuid)}
                      >
                        Student Exit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

        </CardContent>
      </Card>

      <Dialog
        open={exitDialogOpen}
        onClose={() => setExitDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >

        <DialogTitle>

          Student Exit

        </DialogTitle>

        <DialogContent>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Exit Type"
            value={studentExitState}
            onChange={(e) => setStudentExitState(e.target.value)}
          >

            <MenuItem value="TC">
              Took TC
            </MenuItem>

            <MenuItem value="PASSOUT">
              Passout
            </MenuItem>

          </TextField>

          <TextField
            fullWidth
            multiline
            rows={3}
            margin="normal"
            label="Remarks (Optional)"
            value={exitRemarks}
            onChange={(e) => setExitRemarks(e.target.value)}
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setExitDialogOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="warning"
            onClick={confirmStudentExit}
          >
            Confirm
          </Button>

        </DialogActions>

      </Dialog>

    </Layout>
  );
}

export default Students;