const db = require('./db');
const axios = require('axios');

// APIs
const FEE_API = "https://lightblue-wolverine-671984.hostingersite.com/api/addFee.php";
const STUDENT_API = "https://lightblue-wolverine-671984.hostingersite.com/api/addStudent.php";
const EXPENSE_API = "https://lightblue-wolverine-671984.hostingersite.com/api/addExpenses.php";
const MARKS_API = "https://lightblue-wolverine-671984.hostingersite.com/api/addMarks.php";

// =========================
// WINDOW REF FOR UI
// =========================
let mainWindowRef = null;

function sendToUI(type, message, extra = {}) {
  if (mainWindowRef && !mainWindowRef.isDestroyed()) {
    mainWindowRef.webContents.send("sync-status", {
      type,
      message,
      ...extra
    });
  }
}

// =========================
//  SYNC FEES
// =========================
async function syncFees() {

  db.all(`SELECT * FROM fees WHERE sync_status = 0`, async (err, rows) => {

    if (err) {
      sendToUI("error", "Fee fetch error");
      return;
    }

    if (rows.length === 0) {
      sendToUI("info", "No fees to sync");
      return;
    }

    sendToUI("start", `Syncing ${rows.length} fees`);

    for (let fee of rows) {

      try {

        sendToUI("uploading", `Fee ${fee.uuid}`);

        console.log("Sending fee to server:", fee);

        console.log("SYNC VERSION 999")

        const res = await axios.post(FEE_API, {
          uuid: fee.uuid,
          transaction_uuid: fee.transaction_uuid,

          student_uuid: fee.student_uuid,

          amount: fee.amount,

          month: fee.month,
          year: fee.year,

          payment_date: fee.payment_date,
          payment_method: fee.payment_method,

          receipt_number: fee.receipt_number,

          selected_months: fee.selected_months,
          transaction_total: fee.transaction_total,
          months_count: fee.months_count,

          include_monthly: fee.include_monthly,
          include_annual: fee.include_annual,
          include_exam: fee.include_exam,
          include_admission: fee.include_admission,
          include_activity: fee.include_activity,

          late_fee: fee.late_fee,
          ignore_late_fee: fee.ignore_late_fee || 0,
          special_discount: fee.special_discount || 0,

          computer: fee.computer,
          abacus: fee.abacus,
          taekwondo: fee.taekwondo,

          fee_breakdown: fee.fee_breakdown,

          sibling_discount_enabled: fee.sibling_discount_enabled,
          sibling_discount_amount: fee.sibling_discount_amount,


          remarks: fee.remarks
        });

        console.log("SERVER RESPONSE:", res.data);

        if (res.data.status === true) {

          db.run(`UPDATE fees SET sync_status = 1 WHERE id = ?`, [fee.id]);

          sendToUI("success", `Fee synced`, { id: fee.uuid });

        } else if (res.data.permanent_reject === true) {

          // Don't retry this record again
          db.run(`UPDATE fees SET sync_status = -1 WHERE id = ?`, [fee.id]);

          console.log("Permanently rejected:", fee.uuid);

          sendToUI("warning", res.data.message, { id: fee.uuid });

        } else {

          // Keep sync_status=0 so it retries later
          sendToUI("error", `Fee failed, will retry`, { id: fee.uuid });

        }

      } catch (err) {
        sendToUI("error", `Fee failed`, { id: fee.uuid });
      }
    }

    sendToUI("done", "Fees sync completed");
  });
}

// =========================
// SYNC STUDENTS
// =========================
async function syncStudents() {

  db.all(`SELECT * FROM students WHERE sync_status = 0`, async (err, rows) => {

    if (err) {
      sendToUI("error", "Student fetch error");
      return;
    }

    if (rows.length === 0) {
      sendToUI("info", "No students to sync");
      return;
    }

    sendToUI("start", `Syncing ${rows.length} students`);

    for (let s of rows) {

      try {

        sendToUI("uploading", `Student ${s.uuid}`);

        const res = await axios.post(STUDENT_API, {
          uuid: s.uuid,
          admission_no: s.admission_no,
          name: s.name,
          class: s.class,
          section: s.section,
          parent_name: s.parent_name,
          parent_contact: s.parent_contact,
          class_id: s.class_id,
          computer: s.computer,
          abacus: s.abacus,
          taekwondo: s.taekwondo
        });

        if (res.data.status === true) {

          db.run(`UPDATE students SET sync_status = 1 WHERE id = ?`, [s.id]);

          sendToUI("success", `Student synced`, { id: s.uuid });

        } else {
          sendToUI("error", `Student rejected`, { id: s.uuid });
        }

      } catch (err) {
        sendToUI("error", `Student failed`, { id: s.uuid });
      }
    }

    sendToUI("done", "Students sync completed");
  });
}

// =========================
// SYNC EXPENSES
// =========================
async function syncExpenses() {

  db.all(`SELECT * FROM expenses WHERE sync_status = 0`, async (err, rows) => {

    if (err) {
      sendToUI("error", "Expense fetch error");
      return;
    }

    if (rows.length === 0) {
      sendToUI("info", "No expenses to sync");
      return;
    }

    sendToUI("start", `Syncing ${rows.length} expenses`);

    for (let exp of rows) {

      try {

        sendToUI("uploading", `Expense ${exp.uuid}`);

        const res = await axios.post(EXPENSE_API, {
          uuid: exp.uuid,

          // MAIN STRUCTURE
          category: exp.category,
          sub_category: exp.sub_category || null,

          description: exp.description,
          note: exp.note || null,

          amount: exp.amount,
          expense_date: exp.expense_date,

          // OPTIONAL FLAGS
          is_planned: exp.is_planned || 0,
          is_recurring: exp.is_recurring || 0,

          // NEW ADDITIONS (IMPORTANT)
          payment_mode: exp.payment_mode || "cash",
          vendor: exp.vendor || null,
          status: exp.status || "paid",

          // accounting metadata (safe future use)
          financial_year: exp.financial_year || null,
          month: exp.month || null
        });

        if (res.data.status === true) {

          db.run(`UPDATE expenses SET sync_status = 1 WHERE id = ?`, [exp.id]);

          sendToUI("success", `Expense synced`, { id: exp.uuid });

        } else {
          sendToUI("error", `Expense rejected`, { id: exp.uuid });
        }

      } catch (err) {
        sendToUI("error", `Expense failed`, { id: exp.uuid });
      }
    }

    sendToUI("done", "Expenses sync completed");
  });
}

// =========================
// SYNC MARKS
// =========================
async function syncMarks() {

  db.all(`SELECT * FROM marks WHERE sync_status = 0`, async (err, rows) => {

    if (err) {
      sendToUI("error", "Marks fetch error");
      return;
    }

    if (rows.length === 0) {
      sendToUI("info", "No marks to sync");
      return;
    }

    sendToUI("start", `Syncing ${rows.length} marks`);

    const grouped = {};

    rows.forEach(mark => {
      const key = `${mark.student_id}_${mark.exam_id}`;

      if (!grouped[key]) {
        grouped[key] = {
          student_id: mark.student_id,
          exam_id: mark.exam_id,
          marks: [],
          ids: []
        };
      }

      grouped[key].marks.push({
        subject_id: mark.subject_id,
        marks_obtained: mark.marks_obtained,
        total_marks: mark.total_marks
      });

      grouped[key].ids.push(mark.id);
    });

    for (let key in grouped) {

      const batch = grouped[key];

      try {

        sendToUI("uploading", `Marks batch ${key}`);

        const res = await axios.post(MARKS_API, {
          student_id: batch.student_id,
          exam_id: batch.exam_id,
          marks: batch.marks
        }, {
          headers: { "Content-Type": "application/json" }
        });

        if (res.data.status === true) {

          batch.ids.forEach(id => {
            db.run(`UPDATE marks SET sync_status = 1 WHERE id = ?`, [id]);
          });

          sendToUI("success", `Marks synced`, { id: key });

        } else {
          sendToUI("error", `Marks rejected`, { id: key });
        }

      } catch (err) {
        sendToUI("error", `Marks failed`, { id: key });
      }
    }

    sendToUI("done", "Marks sync completed");
  });
}

// =========================
// MASTER SYNC ENGINE
// =========================
function syncAll(mainWindow) {
  mainWindowRef = mainWindow;

  syncFees();
  syncStudents();
  syncExpenses();
  syncMarks();
}

module.exports = {
  syncFees,
  syncStudents,
  syncExpenses,
  syncMarks,
  syncAll
};