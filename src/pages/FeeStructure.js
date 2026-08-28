import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import API_BASE from "../config";
import Layout from "../components/Layout";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

function FeeStructure() {

  const [structures, setStructures] = useState([]);

  const [academicYear, setAcademicYear] = useState("2026-27");
  const [groupName, setGroupName] = useState("");
  const [studentType, setStudentType] = useState("old");

  const [admissionFee, setAdmissionFee] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");
  const [annualFee, setAnnualFee] = useState("");
  const [examFee, setExamFee] = useState("");

  const [computerFee, setComputerFee] = useState("");
  const [abacusFee, setAbacusFee] = useState("");
  const [taekwondoFee, setTaekwondoFee] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const academicYears = [
    "2025-26",
    "2026-27",
    "2027-28",
    "2028-29"
  ];

  const groups = [
    "Pre Nursery",
    "Nursery-UKG",
    "Class 1-2",
    "Class 3-5",
    "Class 6-8"
  ];

  const fetchStructures = async () => {
    try {

      const res = await axios.get(
        `${API_BASE}/getFeeStructure.php`
      );

      if (res.data?.data) {
        setStructures(res.data.data);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const resetForm = () => {

    setEditingId(null);

    setGroupName("");
    setStudentType("old");

    setAdmissionFee("");
    setMonthlyFee("");
    setAnnualFee("");
    setExamFee("");

    setComputerFee("");
    setAbacusFee("");
    setTaekwondoFee("");
  };

  const saveStructure = async () => {

    if (!groupName) {

      setDialogMessage("Please select group");

      setDialogOpen(true);

      return;
    }

    try {

      const payload = {

        uuid: uuidv4(),

        academic_year: academicYear,

        group_name: groupName,

        student_type: studentType,

        admission_fee: parseFloat(admissionFee || 0),

        monthly_fee: parseFloat(monthlyFee || 0),

        annual_fee: parseFloat(annualFee || 0),

        exam_fee: parseFloat(examFee || 0),

        computer_fee: parseFloat(computerFee || 0),

        abacus_fee: parseFloat(abacusFee || 0),

        taekwondo_fee: parseFloat(taekwondoFee || 0)

      };

      const res = await axios.post(
        `${API_BASE}/saveFeeStructure.php`,
        payload
      );

      if (res.data.status) {

        setDialogMessage(
          editingId
            ? "Fee structure updated successfully"
            : "Fee structure saved successfully"
        );

        setDialogOpen(true);

        resetForm();

        fetchStructures();

      } else {

        setDialogMessage(
          res.data.message || "Failed"
        );

        setDialogOpen(true);
      }

    } catch (err) {

      console.error(err);

      setDialogMessage("Server Error");

      setDialogOpen(true);
    }
  };

  const editStructure = (row) => {

    setEditingId(row.id);

    setAcademicYear(row.academic_year);

    setGroupName(row.group_name);

    setStudentType(row.student_type);

    setAdmissionFee(row.admission_fee);

    setMonthlyFee(row.monthly_fee);

    setAnnualFee(row.annual_fee);

    setExamFee(row.exam_fee);

    setComputerFee(row.computer_fee);

    setAbacusFee(row.abacus_fee);

    setTaekwondoFee(row.taekwondo_fee);
  };

  const deleteStructure = async (id) => {

    if (!window.confirm("Delete this fee structure?")) {
      return;
    }

    try {

      const res = await axios.post(
        `${API_BASE}/deleteFeeStructure.php`,
        { id }
      );

      if (res.data.status) {

        fetchStructures();

      } else {

        alert("Delete failed");
      }

    } catch (err) {

      console.error(err);
    }
  };

  return (

    <Layout>

      <Typography variant="h5" gutterBottom>
        Fee Structure Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            {editingId
              ? "Edit Fee Structure"
              : "Add Fee Structure"}
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Academic Year"
                value={academicYear}
                onChange={(e) =>
                  setAcademicYear(e.target.value)
                }
                SelectProps={{ native: true }}
              >
                {academicYears.map(year => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Group"
                value={groupName}
                onChange={(e) =>
                  setGroupName(e.target.value)
                }
                SelectProps={{ native: true }}
              >
                <option value="">
                  Select Group
                </option>

                {groups.map(group => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Student Type"
                value={studentType}
                onChange={(e) =>
                  setStudentType(e.target.value)
                }
                SelectProps={{ native: true }}
              >
                <option value="new">
                  New
                </option>

                <option value="old">
                  Old
                </option>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Admission Fee"
                type="number"
                value={admissionFee}
                onChange={(e)=>
                  setAdmissionFee(e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Monthly Fee"
                type="number"
                value={monthlyFee}
                onChange={(e)=>
                  setMonthlyFee(e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Annual Fee"
                type="number"
                value={annualFee}
                onChange={(e)=>
                  setAnnualFee(e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Exam Fee"
                type="number"
                value={examFee}
                onChange={(e)=>
                  setExamFee(e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Computer Fee"
                type="number"
                value={computerFee}
                onChange={(e)=>
                  setComputerFee(e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Abacus Fee"
                type="number"
                value={abacusFee}
                onChange={(e)=>
                  setAbacusFee(e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Taekwondo Fee"
                type="number"
                value={taekwondoFee}
                onChange={(e)=>
                  setTaekwondoFee(e.target.value)
                }
              />
            </Grid>

          </Grid>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#1E3A8A"
            }}
            onClick={saveStructure}
          >
            {editingId
              ? "Update Structure"
              : "Save Structure"}
          </Button>

        </CardContent>
      </Card>

      <Card>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Existing Fee Structures
          </Typography>

          <Table>

            <TableHead>
              <TableRow>

                <TableCell>Year</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Type</TableCell>

                <TableCell>Admission</TableCell>
                <TableCell>Monthly</TableCell>
                <TableCell>Annual</TableCell>
                <TableCell>Exam</TableCell>

                <TableCell>Computer</TableCell>
                <TableCell>Abacus</TableCell>
                <TableCell>Taekwondo</TableCell>

                <TableCell>Action</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {structures.map(row => (

                <TableRow key={row.id}>

                  <TableCell>{row.academic_year}</TableCell>

                  <TableCell>{row.group_name}</TableCell>

                  <TableCell>{row.student_type}</TableCell>

                  <TableCell>{row.admission_fee}</TableCell>

                  <TableCell>{row.monthly_fee}</TableCell>

                  <TableCell>{row.annual_fee}</TableCell>

                  <TableCell>{row.exam_fee}</TableCell>

                  <TableCell>{row.computer_fee}</TableCell>

                  <TableCell>{row.abacus_fee}</TableCell>

                  <TableCell>{row.taekwondo_fee}</TableCell>

                  <TableCell>

                    <Button
                      size="small"
                      onClick={() =>
                        editStructure(row)
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      color="error"
                      size="small"
                      onClick={() =>
                        deleteStructure(row.id)
                      }
                    >
                      Delete
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
      >
        <DialogTitle>
          Notification
        </DialogTitle>

        <DialogContent>
          {dialogMessage}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDialogOpen(false)
            }
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </Layout>
  );
}

export default FeeStructure;