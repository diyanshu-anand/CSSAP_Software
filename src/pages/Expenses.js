// SOFTWARE BASED CODE BELOW THIS CODE IS WEB BASED

// import { useEffect, useState } from "react";
// import axios from "axios";
// import API_BASE from "../config";
// import { v4 as uuidv4 } from "uuid";
// import Layout from "../components/Layout";

// import {
//   Card,
//   CardContent,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from "@mui/material";

// function Expenses() {

//   const [expenses, setExpenses] = useState([]);

//   const [form, setForm] = useState({
//     category: "",
//     description: "",
//     amount: ""
//   });

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [dialogMessage, setDialogMessage] = useState("");

//   const fetchExpenses = () => {
//     axios.get(`${API_BASE}/getExpenses.php`)
//       .then(res => {
//         if (res.data && res.data.data) {
//           setExpenses(res.data.data);
//         }
//       })
//       .catch(err => {
//         console.error("Fetch error:", err);
//       });
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const addExpense = async () => {

//     if (!form.category || !form.amount) {
//       setDialogMessage("Please fill required fields");
//       setDialogOpen(true);
//       return;
//     }

//     try {

//       const res = await axios.post(`${API_BASE}/addExpenses.php`, {
//         uuid: uuidv4(),
//         ...form,
//         amount: parseFloat(form.amount)
//       });

//       if (res.data.status === false) {
//         setDialogMessage(res.data.message || "Failed to add expense");
//         setDialogOpen(true);
//         return;
//       }

//       setForm({
//         category: "",
//         description: "",
//         amount: ""
//       });

//       fetchExpenses();

//     } catch (err) {

//       if (err.response && err.response.data.type === "FINANCIAL_YEAR_LOCKED") {

//         setDialogMessage(err.response.data.message);
//         setDialogOpen(true);

//       } else {

//         setDialogMessage("Unexpected error occurred while saving expense.");
//         setDialogOpen(true);
//         console.error(err);

//       }

//     }
//   };

//   return (
//     <Layout>

//       <Typography variant="h5" gutterBottom>
//         Expense Management
//       </Typography>

//       <Card style={{ marginBottom: 30 }}>
//         <CardContent>

//           <Typography variant="h6" gutterBottom>
//             Add Expense
//           </Typography>

//           <Grid container spacing={2}>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Category"
//                 value={form.category}
//                 onChange={e =>
//                   setForm({ ...form, category: e.target.value })
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} md={4}>
//               <TextField
//                 fullWidth
//                 label="Description"
//                 value={form.description}
//                 onChange={e =>
//                   setForm({ ...form, description: e.target.value })
//                 }
//               />
//             </Grid>

//             <Grid item xs={12} md={3}>
//               <TextField
//                 fullWidth
//                 label="Amount"
//                 type="number"
//                 value={form.amount}
//                 onChange={e =>
//                   setForm({ ...form, amount: e.target.value })
//                 }
//               />
//             </Grid>

//           </Grid>

//           <Button
//             variant="contained"
//             style={{ marginTop: 20, backgroundColor: "#1E3A8A" }}
//             onClick={addExpense}
//           >
//             Add Expense
//           </Button>

//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent>

//           <Typography variant="h6" gutterBottom>
//             Expense Records
//           </Typography>

//           <Table>

//             <TableHead>
//               <TableRow>
//                 <TableCell>Category</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Amount</TableCell>
//                 <TableCell>Date</TableCell>
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {expenses.map((e) => (
//                 <TableRow key={e.uuid}>
//                   <TableCell>{e.category}</TableCell>
//                   <TableCell>{e.description}</TableCell>
//                   <TableCell>₹{e.amount}</TableCell>
//                   <TableCell>{e.expense_date}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>

//           </Table>

//         </CardContent>
//       </Card>

//       {/* Dialog Box */}
//       <Dialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//       >
//         <DialogTitle>Notification</DialogTitle>

//         <DialogContent>
//           <Typography>{dialogMessage}</Typography>
//         </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setDialogOpen(false)}>
//             OK
//           </Button>
//         </DialogActions>

//       </Dialog>

//     </Layout>
//   );
// }

// export default Expenses;

// SOFTWARE BASED CODE :

import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import { v4 as uuidv4 } from "uuid";
import Layout from "../components/Layout";

import {
  Card, CardContent, Typography,
  TextField, Button, Grid,
  Table, TableHead, TableRow,
  TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

function Expenses() {

  const [expenses, setExpenses] = useState([]);
  const [localExpenses, setLocalExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [form, setForm] = useState({
    category: "",
    sub_category: "",
    description: "",
    note: "",
    amount: "",
    payment_mode: "cash",
    vendor: "",
    is_planned: 0,
    is_recurring: 0
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // ---------------- FETCH ----------------

  const fetchExpenses = () => {
    axios.get(`${API_BASE}/getExpenses.php`)
      .then(res => {
        if (res.data?.data) setExpenses(res.data.data);
      })
      .catch(err => console.error(err));
  };

  const fetchLocalExpenses = async () => {
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.getLocalExpenses();
        setLocalExpenses(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchLocalExpenses();
  }, []);

  // AUTO REFRESH
  useEffect(() => {
    const interval = setInterval(() => {
      fetchExpenses();
      fetchLocalExpenses();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto Categorise the Categories
  const categories = {
    "Academic Expenses": [
      "Textbooks",
      "Stationary",
      "Examination Materials"
    ],
    "Human Resource & Payroll": [
      "Salary",
      "Wages",
      "Staff Welfare"
    ],
    "Campus Maintenance & Operations": [
      "Security",
      "Plumbing",
      "Electrical Repairs",
      "Gardening"
    ],
    "Utilities": [
      "Electricity",
      "Water",
      "Internet",
      "Telephone"
    ],
    "Transportation & Logistics": [
      "Fuel",
      "Vehicle Maintenance"
    ],
    "Food & Canteen Services": [
      "Mess Food",
      "Snacks"
    ],
    "Marketing & Admission": [
      "Ads",
      "Admission Campaign"
    ],
    "Software & IT Subscriptions": [
      "Hosting",
      "Software Licenses"
    ],
    "Cultural & Events": [
      "Annual Function",
      "Sports Day"
    ]
  };

  // MERGE + FILTER
  useEffect(() => {

    const map = new Map();

    expenses.forEach(e => {
      map.set(e.uuid, { ...e, source: 'online' });
    });

    localExpenses.forEach(e => {
      if (!map.has(e.uuid)) {
        map.set(e.uuid, { ...e, source: 'local' });
      }
    });

    setFilteredExpenses(Array.from(map.values()));

  }, [expenses, localExpenses]);

  // ---------------- ADD ----------------

  const addExpense = async () => {

    if (!form.category || !form.amount) {
      setDialogMessage("Please fill required fields");
      setDialogOpen(true);
      return;
    }

    try {

      const payload = {
        uuid: uuidv4(),

        ...form,

        amount: parseFloat(form.amount),

        expense_date: new Date().toISOString().split('T')[0],

        financial_year: new Date().getFullYear().toString(),

        month: new Date().toLocaleString('default', { month: 'long' })
      };

      // LOCAL SAVE
      if (window.electronAPI) {
        await window.electronAPI.saveExpense(payload);
      }

      // ONLINE SAVE
      await axios.post(`${API_BASE}/addExpenses.php`, payload);

      setForm({
        category: "",
        sub_category: "",
        description: "",
        note: "",
        amount: "",
        payment_mode: "cash",
        vendor: "",
        is_planned: 0,
        is_recurring: 0
      });

      fetchExpenses();
      fetchLocalExpenses();

      setDialogMessage("Expense added ✅");
      setDialogOpen(true);

    } catch (err) {
      console.error(err);
      setDialogMessage("Error saving expense");
      setDialogOpen(true);
    }
  };

  // ---------------- UI ----------------

  return (
    <Layout>

      <Typography variant="h5">Expense Management</Typography>

      <Card style={{ marginBottom: 30 }}>
        <CardContent>

          <Typography variant="h6">Add Expense</Typography>

          <Grid container spacing={2}>

            {/* CATEGORY */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Category"
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                    sub_category: ""
                  })
                }
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {Object.keys(categories).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </TextField>
            </Grid>

            {/* SUB CATEGORY */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Sub Category"
                value={form.sub_category}
                onChange={(e) =>
                  setForm({ ...form, sub_category: e.target.value })
                }
                disabled={!form.category}
                SelectProps={{ native: true }}
              >
                <option value=""></option>
                {(categories[form.category] || []).map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </TextField>
            </Grid>

            {/* AMOUNT */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
              />
            </Grid>

            {/* DESCRIPTION */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </Grid>

            {/* NOTE */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Note / Purchase Detail"
                value={form.note}
                onChange={e => setForm({ ...form, note: e.target.value })}
              />
            </Grid>

            {/* VENDOR */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Vendor"
                value={form.vendor}
                onChange={e => setForm({ ...form, vendor: e.target.value })}
              />
            </Grid>

            {/* PAYMENT MODE */}
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Payment Mode"
                value={form.payment_mode}
                onChange={e => setForm({ ...form, payment_mode: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="bank">Bank</option>
              </TextField>
            </Grid>

          </Grid>

          <Grid container spacing={2} mt={1}>

            <Grid item>
              <label>
                <input
                  type="checkbox"
                  checked={form.is_planned === 1}
                  onChange={(e) =>
                    setForm({ ...form, is_planned: e.target.checked ? 1 : 0 })
                  }
                />
                Planned Expense
              </label>
            </Grid>

            <Grid item>
              <label>
                <input
                  type="checkbox"
                  checked={form.is_recurring === 1}
                  onChange={(e) =>
                    setForm({ ...form, is_recurring: e.target.checked ? 1 : 0 })
                  }
                />
                Recurring Expense
              </label>
            </Grid>

          </Grid>

          <Button
            variant="contained"
            style={{ marginTop: 20, backgroundColor: "#1E3A8A" }}
            onClick={addExpense}
          >
            Add Expense
          </Button>

        </CardContent>
      </Card>

      <Card>
        <CardContent>

          <Typography variant="h6">Expense Records</Typography>

          <Table>

            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {filteredExpenses.map(e => (
                <TableRow key={e.uuid}>

                  <TableCell>{e.category}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell>₹{e.amount}</TableCell>
                  <TableCell>{e.expense_date}</TableCell>

                  <TableCell>
                    <span style={{
                      background: e.source === 'online'
                        ? "#DBEAFE"
                        : e.sync_status === 1
                          ? "#DCFCE7"
                          : "#FEF3C7",
                      padding: "4px 10px",
                      borderRadius: "8px"
                    }}>
                      {e.source === 'online'
                        ? "Online"
                        : e.sync_status === 1
                          ? "Synced"
                          : "Pending"}
                    </span>
                  </TableCell>

                </TableRow>
              ))}

            </TableBody>

          </Table>

        </CardContent>
      </Card>

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

export default Expenses;