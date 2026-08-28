import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";

import {
  Card, CardContent, Typography,
  TextField, Button, Grid,
  Table, TableHead, TableRow,
  TableCell, TableBody
} from "@mui/material";

function Teachers() {

  const [teachers, setTeachers] = useState([]);

  const [form, setForm] = useState({
    id: "",
    employee_code: "",
    name: "",
    phone: "",
    email: "",
    subject: "",
    monthly_salary: "",
    joining_date: "",
    status: "Active"
  });

  const [isEdit, setIsEdit] = useState(false);

  /* ---------------- FETCH ---------------- */

  const fetchTeachers = () => {
    axios.get(`${API_BASE}/getTeachers.php`)
      .then(res => {
        if (res.data.status) {
          setTeachers(res.data.data);
        }
      });
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {

    const formData = new FormData();

    formData.append("action", isEdit ? "update" : "add");

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    await axios.post(`${API_BASE}/addTeacher.php`, formData);

    resetForm();
    fetchTeachers();
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (t) => {
    setIsEdit(true);
    setForm(t);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete teacher?")) return;

    const formData = new FormData();
    formData.append("action", "delete");
    formData.append("id", id);

    await axios.post(`${API_BASE}/addTeacher.php`, formData);

    fetchTeachers();
  };

  /* ---------------- RESET ---------------- */

  const resetForm = () => {
    setForm({
      id: "",
      employee_code: "",
      name: "",
      phone: "",
      email: "",
      subject: "",
      monthly_salary: "",
      joining_date: "",
      status: "Active"
    });
    setIsEdit(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <Layout>

      <Typography variant="h5">Teacher Management</Typography>

      {/* FORM */}
      <Card sx={{ mt: 2 }}>
        <CardContent>

          <Typography variant="h6">
            {isEdit ? "Edit Teacher" : "Add Teacher"}
          </Typography>

          <Grid container spacing={2} mt={1}>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Employee Code"
                value={form.employee_code}
                onChange={(e) => setForm({ ...form, employee_code: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Salary"
                type="number"
                value={form.monthly_salary}
                onChange={(e) => setForm({ ...form, monthly_salary: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth type="date"
                label="Joining Date"
                InputLabelProps={{ shrink: true }}
                value={form.joining_date}
                onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              />
            </Grid>

          </Grid>

          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
            {isEdit ? "Update" : "Add"}
          </Button>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card sx={{ mt: 3 }}>
        <CardContent>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {teachers.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.employee_code}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.phone || "-"}</TableCell>
                  <TableCell>{t.subject || "-"}</TableCell>
                  <TableCell>{t.monthly_salary}</TableCell>
                  <TableCell>{t.status}</TableCell>

                  <TableCell>
                    <Button onClick={() => handleEdit(t)}>Edit</Button>
                    <Button color="error" onClick={() => handleDelete(t.id)}>
                      Delete
                    </Button>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>

        </CardContent>
      </Card>

    </Layout>
  );
}

export default Teachers;