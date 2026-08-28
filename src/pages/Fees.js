// import { useEffect, useState } from "react";
// import axios from "axios";
// import API_BASE from "../config";
// import { v4 as uuidv4 } from "uuid";
// import Layout from "../components/Layout";

// import {
// Card,
// CardContent,
// Typography,
// TextField,
// Button,
// Grid,
// Table,
// TableHead,
// TableRow,
// TableCell,
// TableBody,
// Dialog,
// DialogTitle,
// DialogContent,
// DialogActions
// } from "@mui/material";

// import Autocomplete from "@mui/material/Autocomplete";

// function Fees() {

// const [students, setStudents] = useState([]);
// const [fees, setFees] = useState([]);
// const [filteredFees, setFilteredFees] = useState([]);

// const [selectedStudent, setSelectedStudent] = useState(null);
// const [selectedClass, setSelectedClass] = useState("");

// const [amount, setAmount] = useState("");
// const [month, setMonth] = useState("");
// const [year, setYear] = useState(new Date().getFullYear());
// const [paymentMethod, setPaymentMethod] = useState("Cash");

// const [search, setSearch] = useState("");

// const [dialogOpen, setDialogOpen] = useState(false);
// const [dialogMessage, setDialogMessage] = useState("");

// const fetchStudents = (classValue = "") => {

// let url = `${API_BASE}/getStudents.php`;

// if (classValue !== "") {
// url += `?class=${classValue}`;
// }

// axios.get(url)
// .then(res => {

// if (res.data && res.data.data) {
// setStudents(res.data.data);
// }

// })
// .catch(err => console.error(err));

// };

// const fetchFees = () => {

// axios.get(`${API_BASE}/getFees.php`)
// .then(res => {

// if (res.data && res.data.data) {

// setFees(res.data.data);
// setFilteredFees(res.data.data);

// }

// })
// .catch(err => console.error(err));

// };

// useEffect(() => {

// fetchStudents(selectedClass);

// }, [selectedClass]);

// useEffect(() => {

// fetchFees();

// }, []);

// useEffect(() => {

// const value = search.toLowerCase();

// const filtered = fees.filter(f =>

// (f.name && f.name.toLowerCase().includes(value)) ||
// (f.month && f.month.toLowerCase().includes(value)) ||
// (f.section && f.section.toLowerCase().includes(value)) ||
// (f.class && String(f.class).includes(value))

// );

// setFilteredFees(filtered);

// }, [search, fees]);

// const addFee = async () => {

// if (!selectedStudent || !amount || !month) {

// setDialogMessage("Please fill all fields");
// setDialogOpen(true);
// return;

// }

// try {
// // SHIFTING TO LOCAL SYSTEM BASED SOFTWARE ARHCHITECTURE

// // const res = await axios.post(`${API_BASE}/addFee.php`, {

// // uuid: uuidv4(),
// // student_uuid: selectedStudent.uuid,
// // amount: parseFloat(amount),
// // month,
// // year,
// // payment_method: paymentMethod

// // });

// const addFee = async () => {

//   if (!selectedStudent || !amount || !month) {
//     setDialogMessage("Please fill all fields");
//     setDialogOpen(true);
//     return;
//   }

//   try {

//     const { ipcRenderer } = window.require('electron');

//     await ipcRenderer.invoke('save-fees', {
//       student_uuid: selectedStudent.uuid,
//       amount: parseFloat(amount),
//       month,
//       year,
//       payment_date: new Date().toISOString().split('T')[0],
//       payment_method: paymentMethod.toLowerCase()
//     });

//     setDialogMessage("Fee saved locally ✅");
//     setDialogOpen(true);

//     setSelectedStudent(null);
//     setAmount("");
//     setMonth("");
//     setPaymentMethod("Cash");

//   } catch (err) {
//     console.error(err);
//     setDialogMessage("Error saving fee locally");
//     setDialogOpen(true);
//   }

// };

// if (res.data.status === false) {

// setDialogMessage(res.data.message || "Failed to add fee");
// setDialogOpen(true);
// return;

// }

// setSelectedStudent(null);
// setAmount("");
// setMonth("");
// setPaymentMethod("Cash");

// fetchFees();

// } catch (err) {

// if (err.response && err.response.data.type === "FINANCIAL_YEAR_LOCKED") {

// setDialogMessage(err.response.data.message);
// setDialogOpen(true);

// } else {

// setDialogMessage("Unexpected error occurred while saving fee.");
// setDialogOpen(true);

// console.error(err);

// }

// }

// };

// return (

// <Layout>

// <Typography variant="h5" gutterBottom>
// Fees Management
// </Typography>

// <Card style={{ marginBottom: 30 }}>
// <CardContent>

// <Typography variant="h6" gutterBottom>
// Add Fee Entry
// </Typography>

// <Grid container spacing={2}>

// <Grid item xs={12} md={3}>
// <TextField
// fullWidth
// select
// label="Class"
// value={selectedClass}
// onChange={(e)=>{

// setSelectedClass(e.target.value);
// setSelectedStudent(null);

// }}
// SelectProps={{ native:true }}
// >

// <option value="">All Classes</option>
// <option value="1">Class 1</option>
// <option value="2">Class 2</option>
// <option value="3">Class 3</option>
// <option value="4">Class 4</option>
// <option value="5">Class 5</option>
// <option value="6">Class 6</option>
// <option value="7">Class 7</option>
// <option value="8">Class 8</option>
// <option value="9">Class 9</option>
// <option value="10">Class 10</option>
// <option value="11">Class 11</option>
// <option value="12">Class 12</option>

// </TextField>
// </Grid>

// <Grid item xs={12} md={4}>
// <Autocomplete
// options={students}
// getOptionLabel={(option)=>`${option.name} (${option.class}${option.section})`}
// value={selectedStudent}
// onChange={(e,newValue)=>setSelectedStudent(newValue)}
// renderInput={(params)=><TextField {...params} label="Select Student" />}
// />
// </Grid>

// <Grid item xs={12} md={2}>
// <TextField
// fullWidth
// label="Amount"
// type="number"
// value={amount}
// onChange={(e)=>setAmount(e.target.value)}
// />
// </Grid>

// <Grid item xs={12} md={2}>
// <TextField
// fullWidth
// label="Month"
// value={month}
// onChange={(e)=>setMonth(e.target.value)}
// placeholder="e.g. April"
// />
// </Grid>

// <Grid item xs={12} md={2}>
// <TextField
// fullWidth
// label="Year"
// type="number"
// value={year}
// onChange={(e)=>setYear(e.target.value)}
// />
// </Grid>

// <Grid item xs={12} md={3}>
// <TextField
// fullWidth
// select
// label="Payment Method"
// value={paymentMethod}
// onChange={(e)=>setPaymentMethod(e.target.value)}
// SelectProps={{ native:true }}
// >

// <option value="Cash">Cash</option>
// <option value="UPI">UPI</option>

// </TextField>
// </Grid>

// </Grid>

// <Button
// variant="contained"
// style={{ marginTop:20, backgroundColor:"#1E3A8A" }}
// onClick={addFee}
// >

// Add Fee

// </Button>

// </CardContent>
// </Card>

// <Card>
// <CardContent>

// <Typography variant="h6" gutterBottom>
// Fees Records
// </Typography>

// <TextField
// fullWidth
// label="Search by Student Name / Month / Section / Class"
// variant="outlined"
// style={{ marginBottom:20 }}
// value={search}
// onChange={(e)=>setSearch(e.target.value)}
// />

// <Table>

// <TableHead>

// <TableRow>

// <TableCell>Student</TableCell>
// <TableCell>Class</TableCell>
// <TableCell>Section</TableCell>
// <TableCell>Month</TableCell>
// <TableCell>Year</TableCell>
// <TableCell>Amount</TableCell>
// <TableCell>Payment</TableCell>
// <TableCell>Date</TableCell>
// <TableCell>Receipt</TableCell>

// </TableRow>

// </TableHead>

// <TableBody>

// {filteredFees.map((f)=>(
// <TableRow key={f.uuid}>

// <TableCell>{f.name}</TableCell>
// <TableCell>{f.class}</TableCell>
// <TableCell>{f.section}</TableCell>
// <TableCell>{f.month}</TableCell>
// <TableCell>{f.year}</TableCell>
// <TableCell>₹{f.amount}</TableCell>
// <TableCell>{f.payment_method}</TableCell>
// <TableCell>{f.payment_date}</TableCell>

// <TableCell>

// <Button
// variant="outlined"
// size="small"
// href={`${API_BASE}/generateReceipt.php?uuid=${f.uuid}`}
// target="_blank"
// >

// Download Receipt

// </Button>

// </TableCell>

// </TableRow>
// ))}

// </TableBody>

// </Table>

// </CardContent>
// </Card>

// <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>

// <DialogTitle>Notification</DialogTitle>

// <DialogContent>
// <Typography>{dialogMessage}</Typography>
// </DialogContent>

// <DialogActions>

// <Button onClick={()=>setDialogOpen(false)}>
// OK
// </Button>

// </DialogActions>

// </Dialog>

// </Layout>

// );

// }

// export default Fees;

// New code For SOFTWARE BASED INTEGRATION because I just messed it up so hard

// import { useEffect, useState } from "react";
// import axios from "axios";
// import API_BASE from "../config";
// import Layout from "../components/Layout";

// import {
// Card,
// CardContent,
// Typography,
// TextField,
// Button,
// Grid,
// Table,
// TableHead,
// TableRow,
// TableCell,
// TableBody,
// Dialog,
// DialogTitle,
// DialogContent,
// DialogActions
// } from "@mui/material";

// import Autocomplete from "@mui/material/Autocomplete";

// function Fees() {

// const [students, setStudents] = useState([]);
// const [fees, setFees] = useState([]);
// const [filteredFees, setFilteredFees] = useState([]);

// const [selectedStudent, setSelectedStudent] = useState(null);
// const [selectedClass, setSelectedClass] = useState("");

// const [amount, setAmount] = useState("");
// const [month, setMonth] = useState("");
// const [year, setYear] = useState(new Date().getFullYear());
// const [paymentMethod, setPaymentMethod] = useState("Cash");

// const [search, setSearch] = useState("");

// const [dialogOpen, setDialogOpen] = useState(false);
// const [dialogMessage, setDialogMessage] = useState("");

// const [localFees, setLocalFees] = useState([]);

// // ---------------- FETCH ----------------

// const fetchStudents = (classValue = "") => {
// let url = `${API_BASE}/getStudents.php`;

// if (classValue !== "") {
// url += `?class=${classValue}`;
// }

// axios.get(url)
// .then(res => {
// if (res.data && res.data.data) {
// setStudents(res.data.data);
// }
// })
// .catch(err => console.error(err));
// };

// const fetchFees = () => {
// axios.get(`${API_BASE}/getFees.php`)
// .then(res => {
// if (res.data && res.data.data) {
// setFees(res.data.data);
// setFilteredFees(res.data.data);
// }
// })
// .catch(err => console.error(err));
// };


// const fetchLocalFees = async () => {
//   try {
//     const ipcRenderer = window?.require ? window.require('electron').ipcRenderer : null;

//     if (ipcRenderer) {
//       const data = await ipcRenderer.invoke('get-local-fees');
//       setLocalFees(data);
//     }

//   } catch (err) {
//     console.error("Local fetch error:", err);
//   }
// };


// // ---------------- EFFECTS ----------------

// useEffect(() => {
// fetchStudents(selectedClass);
// }, [selectedClass]);

// useEffect(() => {
// fetchFees();
// }, []);

// useEffect(() => {
// const value = search.toLowerCase();

// const combinedFees = [
//   ...localFees.map(f => ({ ...f, source: 'local' })),
//   ...fees.map(f => ({ ...f, source: 'online' }))
// ];

// // Modification done To Improve the gui and understanding of the userof buisness operation
// // const filtered = fees.filter(f =>
// // (f.name && f.name.toLowerCase().includes(value)) ||
// // (f.month && f.month.toLowerCase().includes(value)) ||
// // (f.section && f.section.toLowerCase().includes(value)) ||
// // (f.class && String(f.class).includes(value))
// // );

// // Modified Code:
// const filtered = combinedFees.filter(f =>
//   (f.name && f.name.toLowerCase().includes(value)) ||
//   (f.month && f.month.toLowerCase().includes(value)) ||
//   (f.section && f.section.toLowerCase().includes(value)) ||
//   (f.class && String(f.class).includes(value))
// );

// setFilteredFees(filtered);

// }, [search, fees]);

// useEffect(() => {
//   fetchLocalFees();
// }, []);

// // ---------------- ADD FEE (FINAL FIXED) ----------------

// const addFee = async () => {

// if (!selectedStudent || !amount || !month) {
// setDialogMessage("Please fill all fields");
// setDialogOpen(true);
// return;
// }

// try {

// const { ipcRenderer } = window.require('electron');

// await ipcRenderer.invoke('save-fees', {
//   student_uuid: selectedStudent.uuid,

//   name: selectedStudent.name,
//   class: selectedStudent.class,
//   section: selectedStudent.section,

//   amount: parseFloat(amount),
//   month,
//   year,
//   payment_date: new Date().toISOString().split('T')[0],
//   payment_method: paymentMethod.toLowerCase()
// });


// setDialogMessage("Fee saved locally ✅");
// setDialogOpen(true);

// // Reset form
// setSelectedStudent(null);
// setAmount("");
// setMonth("");
// setPaymentMethod("Cash");

// } catch (err) {
// console.error(err);
// setDialogMessage("Error saving fee locally");
// setDialogOpen(true);
// }

// };

// // ---------------- UI ----------------

// return (

// <Layout>

// <Typography variant="h5" gutterBottom>
// Fees Management
// </Typography>

// <Card style={{ marginBottom: 30 }}>
// <CardContent>

// <Typography variant="h6" gutterBottom>
// Add Fee Entry
// </Typography>

// <Grid container spacing={2}>

// <Grid item xs={12} md={3}>
// <TextField
// fullWidth
// select
// label="Class"
// value={selectedClass}
// onChange={(e)=>{
// setSelectedClass(e.target.value);
// setSelectedStudent(null);
// }}
// SelectProps={{ native:true }}
// >
// <option value="">All Classes</option>
// <option value="1">Class 1</option>
// <option value="2">Class 2</option>
// <option value="3">Class 3</option>
// <option value="4">Class 4</option>
// <option value="5">Class 5</option>
// <option value="6">Class 6</option>
// <option value="7">Class 7</option>
// <option value="8">Class 8</option>
// <option value="9">Class 9</option>
// <option value="10">Class 10</option>
// <option value="11">Class 11</option>
// <option value="12">Class 12</option>
// </TextField>
// </Grid>

// <Grid item xs={12} md={4}>
// <Autocomplete
// options={students}
// getOptionLabel={(option)=>`${option.name} (${option.class}${option.section})`}
// value={selectedStudent}
// onChange={(e,newValue)=>setSelectedStudent(newValue)}
// renderInput={(params)=><TextField {...params} label="Select Student" />}
// />
// </Grid>

// <Grid item xs={12} md={2}>
// <TextField
// fullWidth
// label="Amount"
// type="number"
// value={amount}
// onChange={(e)=>setAmount(e.target.value)}
// />
// </Grid>

// <Grid item xs={12} md={2}>
// <TextField
// fullWidth
// label="Month"
// value={month}
// onChange={(e)=>setMonth(e.target.value)}
// placeholder="e.g. April"
// />
// </Grid>

// <Grid item xs={12} md={2}>
// <TextField
// fullWidth
// label="Year"
// type="number"
// value={year}
// onChange={(e)=>setYear(e.target.value)}
// />
// </Grid>

// <Grid item xs={12} md={3}>
// <TextField
// fullWidth
// select
// label="Payment Method"
// value={paymentMethod}
// onChange={(e)=>setPaymentMethod(e.target.value)}
// SelectProps={{ native:true }}
// >
// <option value="Cash">Cash</option>
// <option value="UPI">UPI</option>
// </TextField>
// </Grid>

// </Grid>

// <Button
// variant="contained"
// style={{ marginTop:20, backgroundColor:"#1E3A8A" }}
// onClick={addFee}
// >
// Add Fee
// </Button>

// </CardContent>
// </Card>

// <Card>
// <CardContent>

// <Typography variant="h6" gutterBottom>
// Fees Records
// </Typography>

// <TextField
// fullWidth
// label="Search by Student Name / Month / Section / Class"
// variant="outlined"
// style={{ marginBottom:20 }}
// value={search}
// onChange={(e)=>setSearch(e.target.value)}
// />

// <Table>

// <TableHead>
// <TableRow>
// <TableCell>Student</TableCell>
// <TableCell>Class</TableCell>
// <TableCell>Section</TableCell>
// <TableCell>Month</TableCell>
// <TableCell>Year</TableCell>
// <TableCell>Amount</TableCell>
// <TableCell>Payment</TableCell>
// <TableCell>Date</TableCell>
// <TableCell>Status</TableCell>
// <TableCell>Receipt</TableCell>
// </TableRow>
// </TableHead>

// <TableBody>
// {filteredFees.map((f)=>(
// <TableRow key={f.uuid}>
// <TableCell>{f.name}</TableCell>
// <TableCell>{f.class}</TableCell>
// <TableCell>{f.section}</TableCell>
// <TableCell>{f.month}</TableCell>
// <TableCell>{f.year}</TableCell>
// <TableCell>₹{f.amount}</TableCell>
// <TableCell>{f.payment_method}</TableCell>
// <TableCell>{f.payment_date}</TableCell>
// <TableCell>
//   {f.source === 'local' && f.sync_status === 0 && (
//     <span style={{ color: "orange", fontWeight: "bold" }}>
//       Pending Sync
//     </span>
//   )}

//   {f.source === 'local' && f.sync_status === 1 && (
//     <span style={{ color: "green", fontWeight: "bold" }}>
//       Synced
//     </span>
//   )}

//   {f.source === 'online' && (
//     <span style={{ color: "blue", fontWeight: "bold" }}>
//       Online
//     </span>
//   )}
// </TableCell>

// <TableCell>
// <Button
// variant="outlined"
// size="small"
// href={`${API_BASE}/generateReceipt.php?uuid=${f.uuid}`}
// target="_blank"
// >
// Download Receipt
// </Button>
// </TableCell>

// </TableRow>
// ))}
// </TableBody>

// </Table>

// </CardContent>
// </Card>

// <Dialog open={dialogOpen} onClose={()=>setDialogOpen(false)}>
// <DialogTitle>Notification</DialogTitle>
// <DialogContent>
// <Typography>{dialogMessage}</Typography>
// </DialogContent>
// <DialogActions>
// <Button onClick={()=>setDialogOpen(false)}>
// OK
// </Button>
// </DialogActions>
// </Dialog>

// </Layout>
// );
// }

// export default Fees;

// Slightly updated as i messed up there with ui


import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Alert from "@mui/material/Alert";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel
} from "@mui/material";


import Autocomplete from "@mui/material/Autocomplete";

// import Dialog from "@mui/material/Dialog";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogContent from "@mui/material/DialogContent";
// import DialogActions from "@mui/material/DialogActions";
// import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

function Fees() {

  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [localFees, setLocalFees] = useState([]);
  const [filteredFees, setFilteredFees] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");

  // const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const [feeStructure, setFeeStructure] = useState(null);

  const [annualFee, setAnnualFee] = useState("");

  const [examFee, setExamFee] = useState("");

  const [admissionFee, setAdmissionFee] = useState("");

  const [activityFee, setActivityFee] = useState("");

  const [remarks, setRemarks] = useState("");

  const [calculatedAmount, setCalculatedAmount] = useState(0);

  const [lateFee, setLateFee] = useState(0);


  const [includeSiblingDiscount, setIncludeSiblingDiscount] = useState(false);

  const [paidMonths, setPaidMonths] = useState([]);

  const [selectedMonths, setSelectedMonths] = useState([]);

  const [ignoreLateFee, setIgnoreLateFee] = useState(false);

  const [paymentDate, setPaymentDate] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [editingFee, setEditingFee] = useState(null);

  const [editAmount, setEditAmount] = useState("");

  const [editPaymentMethod, setEditPaymentMethod] = useState("");

  const [editPaymentDate, setEditPaymentDate] = useState("");

  const [editReason, setEditReason] = useState("");

  const [adminUsername, setAdminUsername] = useState("");

  const [adminPassword, setAdminPassword] = useState("");

  const [editMonthlyFee, setEditMonthlyFee] = useState(0);

  const [editAnnualFee, setEditAnnualFee] = useState(0);

  const [editExamFee, setEditExamFee] = useState(0);

  const [editAdmissionFee, setEditAdmissionFee] = useState(0);

  const [editActivityFee, setEditActivityFee] = useState(0);

  const [editLateFee, setEditLateFee] = useState(0);

  const [editSiblingDiscount, setEditSiblingDiscount] = useState(0);

  const [editRemarks, setEditRemarks] = useState("");

  const [editComputer, setEditComputer] = useState(false);

  const [editAbacus, setEditAbacus] = useState(false);

  const [editTaekwondo, setEditTaekwondo] = useState(false);
  const [editIncludeMonthly, setEditIncludeMonthly] = useState(false);

  const [editIncludeAnnual, setEditIncludeAnnual] = useState(false);

  const [editIncludeExam, setEditIncludeExam] = useState(false);

  const [editIncludeAdmission, setEditIncludeAdmission] = useState(false);

  const [editIncludeActivity, setEditIncludeActivity] = useState(false);

  const [editIncludeSiblingDiscount, setEditIncludeSiblingDiscount] = useState(false);

  const [editIgnoreLateFee, setEditIgnoreLateFee] = useState(false);

  const [editFeeBreakdown, setEditFeeBreakdown] = useState({});

  const [editCalculatedAmount, setEditCalculatedAmount] = useState();

  const [editSiblingDiscountEnabled, setEditSiblingDiscountEnabled] = useState(false);

  const [editSiblingDiscountAmount, setEditSiblingDiscountAmount] = useState(0);

  const [editSelectedMonths, setEditSelectedMonths] = useState([]);

  const [includeMonthly, setIncludeMonthly] = useState(true);

  const [discountPercent, setDiscountPercent] = useState(0);

  const [editDiscountPercent, setEditDiscountPercent] = useState(0);

  const [customDiscount, setCustomDiscount] = useState(0);

  const [editCustomDiscount, setEditCustomDiscount] = useState(0);

  const [includeActivity, setIncludeActivity] = useState(true);

  const [payableAmount, setPayableAmount] = useState(0);

  const [collectedAmount, setCollectedAmount] = useState("");

  const [editPayableAmount, setEditPayableAmount] = useState(0);

  const [editCollectedAmount, setEditCollectedAmount] = useState("");

  const [monthlyFee, setMonthlyFee] = useState(0);

  const [commoditiesFee, setCommoditiesFee] = useState("");

  const [editCommoditiesFee, setEditCommoditiesFee] = useState(0);


  // ACADEMIC MONTHS

  const academicMonths = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March"
  ];

  // total amount mannual input calculation (Paisa pehle calculate karega apun)
  const totalCollected =
    Math.max(
      0,
      Number(monthlyFee || 0) +
      Number(annualFee || 0) +
      Number(examFee || 0) +
      Number(admissionFee || 0) +
      Number(activityFee || 0) +
      Number(commoditiesFee || 0) -
      (includeSiblingDiscount
        ? (
          Number(monthlyFee || 0) +
          Number(annualFee || 0) +
          Number(examFee || 0) +
          Number(admissionFee || 0) +
          Number(activityFee || 0) +
          Number(commoditiesFee || 0)
        ) * 0.08
        : 0) -
      Number(customDiscount || 0)
    );

  // Helper function to identify if month is being paid or not.

  const isMonthPaid = (monthName) => {
    return paidMonths.some(
      m => m.month === monthName && m.year === year
    );
  };
  // ---------------- FETCH ----------------

  const fetchStudents = (classValue = "") => {
    let url = `${API_BASE}/getStudents.php`;
    if (classValue !== "") url += `?class=${classValue}`;

    axios.get(url)
      .then(res => {
        if (res.data?.data) setStudents(res.data.data);
      })
      .catch(err => console.error(err));
  };

  const fetchFees = () => {
    axios.get(`${API_BASE}/getFees.php`)
      .then(res => {
        if (res.data?.data) setFees(res.data.data);
      })
      .catch(err => console.error(err));
  };

  const fetchLocalFees = async () => {
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.getLocalFees();
        setLocalFees(data);
      }
    } catch (err) {
      console.error("Local fetch error:", err);
    }
  };

  // ----------------- Edit Feature ---------------------------------------------

  const openEditDialog = (fee) => {

    setEditingFee(fee);

    // Load selected months from transaction
    if (fee.selected_months) {

      try {

        const months = JSON.parse(fee.selected_months);

        setEditSelectedMonths(months);

      } catch {

        setEditSelectedMonths(
          fee.month ? [fee.month] : []
        );

      }

    } else {

      setEditSelectedMonths(
        fee.month ? [fee.month] : []
      );

    }

    const breakdown =
      fee.fee_breakdown
        ? JSON.parse(fee.fee_breakdown)
        : {};

    setEditFeeBreakdown(breakdown);

    setEditMonthlyFee(Number(breakdown.monthly_fee || 0));
    setEditAnnualFee(Number(breakdown.annual_fee || 0));
    setEditExamFee(Number(breakdown.exam_fee || 0));
    setEditAdmissionFee(Number(breakdown.admission_fee || 0));
    setEditActivityFee(Number(breakdown.activity_fee || 0));
    setEditCommoditiesFee(
      Number(breakdown.commodities_fee || 0)
    );

    setEditLateFee(Number(fee.late_fee || 0));

    setEditRemarks(fee.remarks || "");

    setEditComputer(Boolean(Number(fee.computer)));
    setEditAbacus(Boolean(Number(fee.abacus)));
    setEditTaekwondo(Boolean(Number(fee.taekwondo)));

    setEditSiblingDiscountEnabled(
      Boolean(Number(fee.sibling_discount_enabled))
    );

    setEditDiscountPercent(
      Number(breakdown.discount_percent || 0)
    );

    setEditSiblingDiscountAmount(
      Number(fee.sibling_discount_amount || 0)
    );

    setEditPaymentMethod(
      fee.payment_method.toUpperCase()
    );

    setEditPaymentDate(
      fee.payment_date || ""
    );

    setEditIncludeMonthly(Boolean(Number(fee.include_monthly)));

    setEditIncludeAnnual(Boolean(Number(fee.include_annual)));

    setEditIncludeExam(Boolean(Number(fee.include_exam)));

    setEditIncludeAdmission(Boolean(Number(fee.include_admission)));

    setEditIncludeActivity(Boolean(Number(fee.include_activity)));

    setEditIncludeSiblingDiscount(
      Boolean(Number(fee.sibling_discount_enabled))
    );

    setEditIgnoreLateFee(false); // DB me abhi store nahi hota

    setAdminUsername("");
    setAdminPassword("");
    setEditReason("");

    setEditDialogOpen(true);

  };

  // ---------------- EFFECTS ----------------

  useEffect(() => {
    fetchStudents(selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    fetchFees();
    fetchLocalFees();
  }, []);

  //  AUTO REFRESH
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFees();
      fetchLocalFees();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  //  MERGE + FILTER
  useEffect(() => {

    const value = search.toLowerCase();

    const onlineMap = new Map();

    fees.forEach(f => {
      onlineMap.set(f.uuid, { ...f, source: 'online' });
    });

    localFees.forEach(f => {
      if (!onlineMap.has(f.uuid)) {
        onlineMap.set(f.uuid, { ...f, source: 'local' });
      }
    });

    const combinedFees = Array.from(onlineMap.values());

    const filtered = combinedFees.filter(f =>
      (f.name && f.name.toLowerCase().includes(value)) ||
      (f.month && f.month.toLowerCase().includes(value)) ||
      (f.section && f.section.toLowerCase().includes(value)) ||
      (f.class && String(f.class).includes(value))
    );

    setFilteredFees(filtered);

  }, [search, fees, localFees]);


  // ------------------Fetch FEE STRUCTURE ---------------------
  const fetchFeeStructure = async (studentUuid) => {

    try {

      const res = await axios.get(
        `${API_BASE}/getStudentFeeStructure.php?student_uuid=${studentUuid}`
      );

      if (res.data.status) {

        setFeeStructure(res.data);

      } else {

        setFeeStructure(null);

        setDialogMessage(
          res.data.message || "Fee structure not found"
        );

        setDialogOpen(true);
      }

    } catch (err) {

      console.error(err);

      setDialogMessage("Unable to load fee structure");

      setDialogOpen(true);
    }
  };

  // Use effect for Fee struture
  useEffect(() => {
    if (feeStructure) {
      setMonthlyFee(Number(feeStructure.monthly_fee || 0));
    }
  }, [feeStructure]);

  const fetchStudentPaidMonths = async (studentUuid) => {

    try {

      const res = await axios.get(
        `${API_BASE}/getStudentPaidMonths.php?student_uuid=${studentUuid}`
      );

      if (res.data.status) {
        setPaidMonths(res.data.paidMonths);
      } else {
        setPaidMonths([]);
      }

    } catch (err) {
      console.error(err);
      setPaidMonths([]);
    }

  };

  // ------------------- Edit Fee Button Handlation Function ---------------
  const handleEditFee = async () => {

    try {

      // Original months from DB
      const originalMonths = editingFee.selected_months
        ? JSON.parse(editingFee.selected_months)
        : (editingFee.month ? [editingFee.month] : []);

      // Newly added months
      const addedMonths = editSelectedMonths.filter(
        m => !originalMonths.includes(m)
      );

      // Removed months
      const removedMonths = originalMonths.filter(
        m => !editSelectedMonths.includes(m)
      );

      console.log("Original:", originalMonths);
      console.log("Edited:", editSelectedMonths);
      console.log("Added:", addedMonths);
      console.log("Removed:", removedMonths);

      const res = await axios.post(
        `${API_BASE}/editFee.php`,
        {

          uuid: editingFee.uuid,

          // Receipt Info
          payment_date: editPaymentDate,
          payment_method: editPaymentMethod.toLowerCase(),

          // Month Editing
          selected_months: editSelectedMonths,
          added_months: addedMonths,
          removed_months: removedMonths,

          // Totals
          amount: editAmount,
          transaction_total: editCalculatedAmount,
          months_count: editSelectedMonths.length,

          // Fee Components
          include_monthly: editIncludeMonthly ? 1 : 0,
          include_annual: editIncludeAnnual ? 1 : 0,
          include_exam: editIncludeExam ? 1 : 0,
          include_admission: editIncludeAdmission ? 1 : 0,
          include_activity: editIncludeActivity ? 1 : 0,
          include_commodities:
            editCommoditiesFee > 0 ? 1 : 0,

          commodities_fee:
            editCommoditiesFee,

          // Activity
          computer: editComputer ? 1 : 0,
          abacus: editAbacus ? 1 : 0,
          taekwondo: editTaekwondo ? 1 : 0,

          // Late Fee
          late_fee: editLateFee,
          ignore_late_fee: editIgnoreLateFee ? 1 : 0,

          // Discount
          sibling_discount_enabled:
            editIncludeSiblingDiscount ? 1 : 0,

          sibling_discount_amount:
            editSiblingDiscountAmount,

          special_discount: Number(editCustomDiscount || 0),

          // Remarks
          remarks: editRemarks,

          // JSON Breakdown
          fee_breakdown: JSON.stringify({

            monthly_fee: editMonthlyFee,

            annual_fee: editAnnualFee,

            exam_fee: editExamFee,

            admission_fee: editAdmissionFee,

            activity_fee: editActivityFee,

            sibling_discount: editSiblingDiscount,

            discount_percent: editDiscountPercent,

            custom_discount: editCustomDiscount,

            commodities_fee: editCommoditiesFee


          }),

          // Admin Authentication
          username: adminUsername,
          password: adminPassword,
          reason: editReason

        }
      );

      if (res.data.status) {

        // alert(res.data.message);
        console.log(res.data);
        alert(JSON.stringify(res.data, null, 2));

        setEditDialogOpen(false);

        fetchFees();
        fetchLocalFees(); // This Refreshes fee list

      } else {

        alert(res.data.message);

      }

    } catch (err) {

      console.error(err);

      alert("Unable to update fee.");

    }

  };

  // ---------------------- Calculation engine with add fee functionalities -----------------------

  useEffect(() => {

    if (!feeStructure) return;

    let total = 0;

    let totalpayable = 0;

    if (includeMonthly) {

      total += Number(monthlyFee || 0);

      totalpayable += Number(monthlyFee || 0);

    }

    if (annualFee) {
      total += Number(feeStructure.annual_fee || 0);
      totalpayable += Number(annualFee || 0);
    }
    if (examFee) {
      total += Number(feeStructure.exam_fee || 0);
      totalpayable += Number(examFee || 0);
    }
    if (admissionFee) {
      total += Number(feeStructure.admission_fee || 0);
      totalpayable += Number(admissionFee || 0);
    }

    if (commoditiesFee) {
      total += Number(commoditiesFee || 0);
      totalpayable += Number(commoditiesFee || 0);
    }
    // total += Number(feeStructure.computer_fee || 0);
    // total += Number(feeStructure.abacus_fee || 0);
    // total += Number(feeStructure.taekwondo_fee || 0);

    // Implementing 300/- logic
    const enrolledInActivity =
      feeStructure.computer_enabled ||
      feeStructure.abacus_enabled ||
      feeStructure.taekwondo_enabled;

    if (includeActivity && enrolledInActivity) {

      total +=
        300 * selectedMonths.length;

      totalpayable += Number(activityFee || 0);

    }

    let siblingDiscount = 0;

    if (includeSiblingDiscount) {
      siblingDiscount = total * 0.08;
      total -= siblingDiscount;
      totalpayable -= siblingDiscount;
    }

    let custom = 0;

    if (discountPercent > 0) {

      custom = total * (Number(discountPercent) / 100);

      total -= custom;

      totalpayable -= custom;

    }

    setCustomDiscount(custom);


    setCalculatedAmount(total);
    // setAmount(String(total));
    setPayableAmount(totalpayable);

    if (
      collectedAmount === "" ||
      collectedAmount === null ||
      collectedAmount === undefined
    ) {
      setCollectedAmount(String(totalpayable));
    }

  }, [
    includeMonthly,
    annualFee,
    examFee,
    admissionFee,
    activityFee,
    selectedMonths,
    discountPercent,
    includeSiblingDiscount,
    feeStructure,
    monthlyFee
  ]);

  // ----------------- Calculation engine with edit functionalities ------------------------
  useEffect(() => {

    if (!editingFee) return;

    let total = 0;

    total += Number(editMonthlyFee || 0) * editSelectedMonths.length;

    total += Number(editAnnualFee || 0);

    total += Number(editExamFee || 0);

    total += Number(editAdmissionFee || 0);

    total += Number(editActivityFee || 0);

    total += Number(editCommoditiesFee || 0);

    if (editIncludeSiblingDiscount) {

      const sibling =
        Number(editSiblingDiscountAmount || 0);

      total -= sibling;
    }

    let customDiscount = 0;

    if (editDiscountPercent > 0) {

      customDiscount =
        total * (Number(editDiscountPercent) / 100);

      total -= customDiscount;

    }

    setEditCustomDiscount(customDiscount);

    setEditCalculatedAmount(total);
    setEditAmount(total);

  }, [
    editIncludeMonthly,
    editIncludeAnnual,
    editIncludeExam,
    editIncludeAdmission,
    editIncludeActivity,
    editIncludeSiblingDiscount,
    editSelectedMonths,
    editMonthlyFee,
    editAnnualFee,
    editExamFee,
    editAdmissionFee,
    editActivityFee,
    editSiblingDiscountAmount,
    editComputer,
    editAbacus,
    editTaekwondo,
    editDiscountPercent,
    editCommoditiesFee
  ]);

  // ---------------- LATE FEE ---------------
  const calculateLateFee = (feeMonth) => {

    const paymentDate = new Date();

    const feeDate = new Date(
      year,
      new Date(`${feeMonth} 1, ${year}`).getMonth(),
      1
    );

    const month15 = new Date(
      feeDate.getFullYear(),
      feeDate.getMonth(),
      15
    );

    const monthEnd = new Date(
      feeDate.getFullYear(),
      feeDate.getMonth() + 1,
      0
    );

    let fee = 0;

    if (
      paymentDate > month15 &&
      paymentDate <= monthEnd
    ) {
      fee = 50;
    }

    if (paymentDate > monthEnd) {

      const days = Math.floor(
        (paymentDate - monthEnd) /
        (1000 * 60 * 60 * 24)
      );

      fee = 50 + days;
    }

    return fee;
  };
  // ---------------- ADD FEE ----------------


  const addFee = async () => {

    if (
      !selectedStudent ||
      selectedMonths.length === 0
    ) {
      setDialogMessage("Please select at least one month.");
      setDialogOpen(true);
      return;
    }

    try {

      // SAFE ACCESS
      if (!window.electronAPI?.saveFees) {
        console.error("Electron API not found");
        setDialogMessage("System not ready. Restart app.");
        setDialogOpen(true);
        return;
      }

      // GENERATE UUID
      // const feeUUID = uuidv4();
      const transactionUUID = uuidv4();

      const receiptNumber =
        "REC-" +
        new Date().getFullYear() +
        "-" +
        Math.floor(10000 + Math.random() * 90000);

      // const payload = {
      //   uuid: feeUUID,   //  REQUIRED FIX
      //   student_uuid: selectedStudent.uuid,
      //   name: selectedStudent.name,
      //   class: selectedStudent.class,
      //   section: selectedStudent.section,
      //   amount: parseFloat(amount),
      //   month,
      //   year,
      //   payment_date: new Date().toISOString().split('T')[0],
      //   payment_method: paymentMethod.toLowerCase()
      // };

      // Late Fees

      // const calculatedLateFee = calculateLateFee();

      // Advancing the payload
      for (const selectedMonth of selectedMonths) {

        const payload = {

          uuid: uuidv4(),

          transaction_uuid: transactionUUID,

          receipt_number: receiptNumber,

          student_uuid: selectedStudent.uuid,

          selected_months: JSON.stringify(selectedMonths),

          transaction_total: calculatedAmount, // Total amount after applied discounts

          months_count: selectedMonths.length,

          name: selectedStudent.name,

          class: selectedStudent.class,

          section: selectedStudent.section,

          // amount:
          //   (includeMonthly
          //     ? Number(monthlyFee || 0)
          //     : 0)
          //   +
          //   (annualFee
          //     ? Number(feeStructure.annual_fee || 0)
          //     : 0)
          //   +
          //   (examFee
          //     ? Number(feeStructure.exam_fee || 0)
          //     : 0)
          //   +
          //   (admissionFee
          //     ? Number(feeStructure.admission_fee || 0)
          //     : 0)
          //   +
          //   (
          //     includeActivity &&
          //       (
          //         feeStructure.computer_enabled ||
          //         feeStructure.abacus_enabled ||
          //         feeStructure.taekwondo_enabled
          //       )
          //       ? 300
          //       : 0
          //   ),
          amount: Number(collectedAmount),       // Amount actually received

          // These are separate properties
          include_monthly: includeMonthly ? 1 : 0,

          include_annual: Number(annualFee) > 0 ? 1 : 0,
          include_exam: Number(examFee) > 0 ? 1 : 0,
          include_admission: Number(admissionFee) > 0 ? 1 : 0,
          include_activity: includeActivity ? 1 : 0,
          include_commodities: Number(commoditiesFee) > 0 ? 1 : 0,
          commodities_fee: Number(commoditiesFee || 0),

          month: selectedMonth,

          year,

          // payment_date: new Date().toISOString().split("T")[0], Commented due to complex payment date, shifted to backend coding ......

          payment_date: paymentDate,

          payment_method: paymentMethod.toLowerCase(),

          computer: feeStructure?.computer_enabled ? 1 : 0,

          abacus: feeStructure?.abacus_enabled ? 1 : 0,

          taekwondo: feeStructure?.taekwondo_enabled ? 1 : 0,

          late_fee: calculateLateFee(selectedMonth),

          ignore_late_fee: ignoreLateFee ? 1 : 0,

          sibling_discount_enabled: includeSiblingDiscount ? 1 : 0,

          sibling_discount_amount: includeSiblingDiscount
            ? (
              (
                (
                  includeMonthly
                    ? Number(feeStructure.monthly_fee || 0)
                    : 0
                ) +
                (
                  annualFee
                    ? Number(feeStructure.annual_fee || 0)
                    : 0
                ) +
                (
                  examFee
                    ? Number(feeStructure.exam_fee || 0)
                    : 0
                ) +
                (
                  admissionFee
                    ? Number(feeStructure.admission_fee || 0)
                    : 0
                ) +
                (
                  includeActivity &&
                    (
                      feeStructure.computer_enabled ||
                      feeStructure.abacus_enabled ||
                      feeStructure.taekwondo_enabled
                    )
                    ? 300
                    : 0
                )
              ) * 0.08
            )
            : 0,
          special_discount: Number(customDiscount || 0),

          fee_breakdown: JSON.stringify({
            monthly_fee: Number(monthlyFee || 0),

            annual_fee: Number(annualFee || 0),

            exam_fee: Number(examFee || 0),

            admission_fee: Number(admissionFee || 0),

            activity_fee: Number(activityFee || 0),
            commodities_fee: Number(commoditiesFee || 0),
            sibling_discount: includeSiblingDiscount
              ? (
                (
                  Number(feeStructure.monthly_fee || 0) +
                  Number(annualFee || 0) +

                  Number(examFee || 0) +

                  Number(admissionFee || 0) +

                  Number(activityFee || 0) +

                  Number(commoditiesFee || 0)
                ) * 0.08
              )
              : 0,

            discount_percent: discountPercent,

            custom_discount: customDiscount,

            computer_fee: Number(feeStructure.computer_fee || 0),

            abacus_fee: Number(feeStructure.abacus_fee || 0),

            taekwondo_fee: Number(feeStructure.taekwondo_fee || 0)
          }),

          // Remarks added newly for special discount purposes
          remarks: remarks

        };

        console.log(payload);

        await window.electronAPI.saveFees(payload);
      }

      // console.log("SENDING FEE DATA:", payload); //  debug

      // //  SAVE
      // const res = await window.electronAPI.saveFees(payload);

      // console.log("SAVE RESPONSE:", res); //  debug

      await fetchLocalFees();

      setDialogMessage("Fee saved successfully ✅");
      setDialogOpen(true);

      // RESET FORM
      setSelectedStudent(null);

      setFeeStructure(null);

      setSelectedMonths([]);

      setCalculatedAmount(0);

      setPayableAmount(0);

      // setAmount("");

      setMonth("");

      setPaymentMethod("Cash");

      setIncludeMonthly(true);
      setAnnualFee("");
      setExamFee("");
      setAdmissionFee("");
      setActivityFee("");
      setCommoditiesFee("");
      setRemarks("");
      setIncludeSiblingDiscount(false);
      setIgnoreLateFee(false);
      setPaymentDate("");


    } catch (err) {
      console.error("SAVE ERROR:", err);
      setDialogMessage("Error saving fee");
      setDialogOpen(true);
    }
  };

  // ------------------------ Excel Downloading -----------------------
  const exportFeesToExcel = () => {

    const exportData = filteredFees.map((f, index) => ({
      "S.No": index + 1,
      "Student Name": f.name,
      "Class": f.class,
      "Section": f.section,
      "Month": f.month,
      "Year": f.year,
      "Amount": f.collectedAmount,
      "Payment Method": f.payment_method,
      "Payment Date": f.payment_date,
      "Remarks":
        f.source === "online"
          ? "Online"
          : f.sync_status === 1
            ? "Synced"
            : "Pending"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Fees Records"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    );

    saveAs(
      fileData,
      `Fees_Report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };


  // ---------------- UI ----------------

  return (

    <Layout>

      <Typography variant="h5" gutterBottom>
        Fees Management
      </Typography>

      <Card style={{ marginBottom: 30 }}>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Add Fee Entry
          </Typography>

          <Grid container spacing={2}>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSelectedStudent(null);
                }}
                SelectProps={{ native: true }}
              >
                <option value="">All Classes</option>

                {/* LKG & UKG */}
                <option value="Pre Nursery">Pre Nursery</option>
                <option value="Nursery">Nursery</option>

                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>

                {/* Class 1–12 */}
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>
                    Class {i + 1}
                  </option>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                options={students}
                getOptionLabel={(option) =>
                  `${option.name || ""} - Class ${option.class || ""} ${option.section || ""}`
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedStudent}
                // onChange={(e, newValue) => setSelectedStudent(newValue)}
                onChange={(e, newValue) => {

                  setSelectedStudent(newValue);

                  if (newValue) {
                    setIncludeMonthly(true);
                    setAnnualFee("");
                    setExamFee("");
                    setAdmissionFee("");
                    setActivityFee("");
                    setCommoditiesFee("");
                    setRemarks("");
                    setSelectedMonths([]);

                    // setAmount("");

                    fetchFeeStructure(newValue.uuid);
                    fetchStudentPaidMonths(newValue.uuid)
                  } else {
                    setFeeStructure(null);
                    setPaidMonths([]);
                    // setAmount("");
                    setSelectedMonths([]);

                    setCalculatedAmount(0);
                    setPayableAmount(0);
                  }

                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Student"
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      ...params.InputProps,
                      style: {
                        padding: "14px",
                        fontSize: "16px"
                      }
                    }}
                  />
                )}
                sx={{
                  "& .MuiInputBase-root": {
                    minWidth: "286px", // increases box width
                  },
                  "& .MuiAutocomplete-input": {
                    padding: "10px !important",
                    fontSize: "16px",
                  }
                }}
              />
            </Grid>

            {feeStructure && (
              <Grid item xs={12}>
                <Card sx={{ mt: 3, mb: 3 }}>
                  <CardContent>

                    <Typography variant="h6" gutterBottom>
                      Fee Structure
                    </Typography>

                    <Typography>
                      Group: {feeStructure.group_name}
                    </Typography>

                    <Typography>
                      Student Type: {feeStructure.student_type}
                    </Typography>

                    <TextField
                      fullWidth
                      type="number"
                      label={`Monthly Fee (Max ₹${(feeStructure.monthly_fee || 0) * Math.max(selectedMonths.length, 1)})`}
                      value={monthlyFee}
                      onChange={(e) => {

                        let value = Number(e.target.value);

                        const max =
                          Number(feeStructure.monthly_fee || 0) *
                          Math.max(selectedMonths.length, 1);

                        if (value > max)
                          value = max;

                        if (value < 0)
                          value = 0;

                        setMonthlyFee(value);
                      }}
                      sx={{ mt: 2 }}
                    />

                    <br />

                    <FormControlLabel
                      control={
                        <TextField
                          fullWidth
                          type="number"
                          label={`Annual Fee (Max ₹${feeStructure.annual_fee || 0})`}
                          value={annualFee}
                          onChange={(e) => setAnnualFee(e.target.value)}
                          sx={{ mt: 2 }}
                        />
                      }
                    />

                    <FormControlLabel
                      control={
                        <TextField
                          fullWidth
                          type="number"
                          label="Activity Fee (Max ₹300)"
                          value={activityFee}
                          onChange={(e) => setActivityFee(e.target.value)}
                          sx={{ mt: 2 }}
                        />
                      }
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label={`Exam Fee (Max ₹${feeStructure.exam_fee || 0})`}
                      value={examFee}
                      onChange={(e) => setExamFee(e.target.value)}
                      sx={{ mt: 2 }}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label={`Admission Fee (Max ₹${feeStructure.admission_fee || 0})`}
                      value={admissionFee}
                      onChange={(e) => setAdmissionFee(e.target.value)}
                      sx={{ mt: 2 }}
                    />

                    <TextField
                      fullWidth
                      type="number"
                      label="Commodities Fee"
                      value={commoditiesFee}
                      onChange={(e) => setCommoditiesFee(e.target.value)}
                      sx={{ mt: 2 }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={includeSiblingDiscount}
                          onChange={(e) =>
                            setIncludeSiblingDiscount(e.target.checked)
                          }
                        />
                      }
                      label="Sibling Discount (8%)"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ignoreLateFee}
                          onChange={(e) => setIgnoreLateFee(e.target.checked)}
                        />
                      }
                      label="Ignore Late Fee (Migration / Already Paid / Special Cases)"
                    />

                    <TextField
                      label="Discount %"
                      type="number"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                    />

                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        label="Payment Date (Leave blank for today's date)"
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Typography>
                      Computer Fee: ₹{feeStructure.computer_fee || 0}
                    </Typography>

                    <Typography>
                      Abacus Fee: ₹{feeStructure.abacus_fee || 0}
                    </Typography>

                    <Typography>
                      Taekwondo Fee: ₹{feeStructure.taekwondo_fee || 0}
                    </Typography>


                    {/* <Typography
                      sx={{
                        mt: 1,
                        fontWeight: "bold",
                        color: "#1E3A8A"
                      }}
                    >
                      Activity Charge Applied: ₹
                      {(
                        feeStructure.computer_enabled ||
                        feeStructure.abacus_enabled ||
                        feeStructure.taekwondo_enabled
                      ) && (

                          <TextField
                            fullWidth
                            type="number"
                            label="Activity Fee (Max ₹300)"
                            value={activityFee}
                            onChange={(e) => setActivityFee(e.target.value)}
                            sx={{ mt: 2 }}
                          />

                        )}
                    </Typography> */}

                    <Typography
                      sx={{
                        fontSize: "22px",
                        fontWeight: "bold",
                        mt: 2,
                        color: "#166534"
                      }}
                    >
                      Total Due: ₹{calculatedAmount}
                    </Typography>

                    <Typography sx={{ mt: 2, fontWeight: "bold" }}>
                      Total Collected : ₹{totalCollected}
                    </Typography>


                    <Typography sx={{ mt: 1, color: "#D32F2F", fontWeight: "bold" }}>
                      Balance Due : ₹{Math.max(0, calculatedAmount - totalCollected)}
                    </Typography>

                    <TextField
                      fullWidth
                      label="Collected Amount"
                      type="number"
                      value={collectedAmount}
                      onChange={(e) => setCollectedAmount(e.target.value)}
                    />

                  </CardContent>
                </Card>
              </Grid>

            )}

            {/* <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Grid> */}

            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{ mt: 2, mb: 1 }}
              >
                Select Months to Collect
              </Typography>

              <Grid container spacing={1}>

                {academicMonths.map((m) => {

                  const paid = isMonthPaid(m);

                  return (

                    <Grid item xs={6} md={3} key={m}>

                      <FormControlLabel

                        control={

                          <Checkbox

                            checked={
                              paid ||
                              selectedMonths.includes(m)
                            }

                            disabled={paid}

                            onChange={(e) => {

                              if (e.target.checked) {

                                setSelectedMonths(prev => [
                                  ...prev,
                                  m
                                ]);

                              } else {

                                setSelectedMonths(prev =>
                                  prev.filter(month => month !== m)
                                );

                              }

                            }}

                          />

                        }

                        label={
                          paid
                            ? `${m} (Paid)`
                            : m
                        }

                      />

                    </Grid>

                  );

                })}

              </Grid>

            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </Grid>

          </Grid>

          <Button
            variant="contained"
            style={{ marginTop: 20, backgroundColor: "#1E3A8A" }}
            onClick={addFee}
          >
            Add Fee
          </Button>

        </CardContent>
      </Card>

      <Card>
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Fees Records
          </Typography>

          <TextField
            fullWidth
            label="Search..."
            style={{ marginBottom: 20 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button
            variant="contained"
            sx={{
              mb: 2,
              backgroundColor: "#166534"
            }}
            onClick={exportFeesToExcel}
          >
            Export Excel
          </Button>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Receipt</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {filteredFees.map((f) => {
                const url = `${API_BASE}/generatereceipt.php?uuid=${f.uuid}`;
                console.log("URL:", url);

                return (
                  <TableRow key={f.uuid}>
                    <TableCell>{f.name}</TableCell>
                    <TableCell>{f.class}</TableCell>
                    <TableCell>{f.section}</TableCell>
                    <TableCell>{f.month}</TableCell>
                    <TableCell>{f.year}</TableCell>
                    <TableCell>₹{f.amount}</TableCell>
                    <TableCell>{f.payment_method}</TableCell>
                    <TableCell>{f.payment_date}</TableCell>

                    <TableCell>
                      <span style={{
                        background: f.source === 'online'
                          ? "#DBEAFE"
                          : f.sync_status === 1
                            ? "#DCFCE7"
                            : "#FEF3C7",
                        color:
                          f.source === 'online'
                            ? "#1E40AF"
                            : f.sync_status === 1
                              ? "#166534"
                              : "#92400E",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}>
                        {f.source === 'online'
                          ? "Online"
                          : f.sync_status === 1
                            ? "Synced"
                            : "Pending"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(url, "_blank")}   //  better
                      >
                        Download Receipt
                      </Button>
                    </TableCell>

                    <TableCell>

                      <Button
                        variant="contained"
                        color={
                          Number(f.can_edit) === 1
                            ? "primary"
                            : "warning"
                        }
                        size="small"
                        onClick={() => openEditDialog(f)}
                        title={
                          Number(f.can_edit) === 1
                            ? "Edit Fee"
                            : "Admin authentication required"
                        }
                      >

                        {Number(f.can_edit) === 1
                          ? "✏️ Edit"
                          : "🔒 Edit"}

                      </Button>

                      {Number(f.edited_count) > 0 && (
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{
                            mt: 0.5,
                            color: "#D97706",
                            fontWeight: 600
                          }}
                        >
                          Edited {f.edited_count} time{Number(f.edited_count) > 1 ? "s" : ""}
                        </Typography>
                      )}

                    </TableCell>
                  </TableRow>
                );
              })}


            </TableBody>

          </Table>

        </CardContent>
      </Card>

      {/* Edit section */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: "80vh",      // Try 75vh or 80vh
            maxHeight: "80vh",
          }
        }}
      >
        <DialogTitle>

          Edit Fee

          <Typography variant="body2">
            Receipt : {editingFee?.receipt_number}
          </Typography>

          <Typography variant="body2">
            {editingFee?.name}
          </Typography>

          <Typography variant="body2">
            {editingFee?.class} - {editingFee?.section}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#1976d2",
              fontWeight: 600
            }}
          >
            Months : {editSelectedMonths.join(", ")}
          </Typography>

        </DialogTitle>

        <DialogContent>

          {Number(editingFee?.can_edit) === 1 ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Editable without authentication.
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Entry locked. Admin authentication required.
            </Alert>
          )}

          <Grid container spacing={2}>

            <Grid item xs={12}>

              <Card>
                <CardContent>

                  <Typography variant="h6">
                    Fee Components
                  </Typography>

                  <Typography sx={{ mb: 2, fontWeight: "bold" }}>
                    Monthly Fee : ₹{editMonthlyFee} / Month
                  </Typography>

                  <TextField
                    fullWidth
                    label="Monthly Fee"
                    type="number"
                    value={editMonthlyFee}
                    onChange={(e) => setEditMonthlyFee(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Annual Fee"
                    type="number"
                    value={editAnnualFee}
                    onChange={(e) => setEditAnnualFee(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Exam Fee"
                    type="number"
                    value={editExamFee}
                    onChange={(e) => setEditExamFee(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Admission Fee"
                    type="number"
                    value={editAdmissionFee}
                    onChange={(e) => setEditAdmissionFee(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Activity Fee"
                    type="number"
                    value={editActivityFee}
                    onChange={(e) => setEditActivityFee(Number(e.target.value))}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Commodities Fee"
                    type="number"
                    value={editCommoditiesFee}
                    onChange={(e) =>
                      setEditCommoditiesFee(Number(e.target.value))
                    }
                    sx={{ mb: 2 }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editIncludeSiblingDiscount}
                        onChange={(e) =>
                          setEditIncludeSiblingDiscount(e.target.checked)
                        }
                      />
                    }
                    label="Sibling Discount (8%)"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editIgnoreLateFee}
                        onChange={(e) =>
                          setEditIgnoreLateFee(e.target.checked)
                        }
                      />
                    }
                    label="Ignore Late Fee"
                  />

                  {/* {(feeStructure?.computer_enabled ||
                    feeStructure?.abacus_enabled ||
                    feeStructure?.taekwondo_enabled) && (

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={editIncludeActivity}
                            onChange={(e) =>
                              setEditIncludeActivity(e.target.checked)
                            }
                          />
                        }
                        label="Activity Fee ₹300"
                      />

                    )} */}

                  <Typography sx={{ mt: 2 }}>
                    Computer Fee : ₹{feeStructure?.computer_fee || 0}
                  </Typography>

                  <Typography>
                    Abacus Fee : ₹{feeStructure?.abacus_fee || 0}
                  </Typography>

                  <Typography>
                    Taekwondo Fee : ₹{feeStructure?.taekwondo_fee || 0}
                  </Typography>

                  <TextField
                    label="Discount %"
                    type="number"
                    value={editDiscountPercent}
                    onChange={(e) => setEditDiscountPercent(e.target.value)}
                  />

                  <Grid item xs={12}>

                    <Typography
                      variant="h6"
                      sx={{ mt: 2, mb: 1 }}
                    >
                      Edit Months
                    </Typography>

                    <Grid container spacing={1}>

                      {academicMonths.map((m) => (

                        <Grid item xs={6} md={3} key={m}>

                          <FormControlLabel

                            control={

                              <Checkbox

                                checked={editSelectedMonths.includes(m)}

                                onChange={(e) => {

                                  if (e.target.checked) {

                                    setEditSelectedMonths(prev => [
                                      ...prev,
                                      m
                                    ]);

                                  } else {

                                    setEditSelectedMonths(prev =>
                                      prev.filter(month => month !== m)
                                    );

                                  }

                                }}

                              />

                            }

                            label={m}

                          />

                        </Grid>

                      ))}

                    </Grid>

                  </Grid>

                </CardContent>
              </Card>

            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Payment Date"
                type="date"
                value={editPaymentDate}
                onChange={(e) =>
                  setEditPaymentDate(e.target.value)
                }
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                value={editPaymentMethod}
                onChange={(e) =>
                  setEditPaymentMethod(e.target.value)
                }
                SelectProps={{ native: true }}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={editAmount}
                onChange={(e) =>
                  setEditAmount(e.target.value)
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Remarks"
                value={editRemarks}
                onChange={(e) =>
                  setEditRemarks(e.target.value)
                }
              />
            </Grid>

            <Typography
              sx={{
                fontWeight: "bold",
                color: "#166534",
                mt: 2
              }}
            >
              Total Amount : ₹{editCalculatedAmount}
            </Typography>

            {Number(editingFee?.can_edit) === 0 && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">
                    Authorization Required
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={adminUsername}
                    onChange={(e) =>
                      setAdminUsername(e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) =>
                      setAdminPassword(e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Reason"
                    value={editReason}
                    onChange={(e) =>
                      setEditReason(e.target.value)
                    }
                  />
                </Grid>
              </>
            )}

          </Grid>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setEditDialogOpen(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleEditFee}
          >
            Save Changes
          </Button>

        </DialogActions>

      </Dialog>


      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>OK</Button>
        </DialogActions>
      </Dialog>

    </Layout>
  );
}

export default Fees;