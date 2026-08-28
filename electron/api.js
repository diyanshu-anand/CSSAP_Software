const db = require('./db');
const { v4: uuidv4 } = require('uuid');

function saveFees(data) {
  return new Promise((resolve, reject) => {

    // const feeBreakdown = JSON.stringify({
    //   computer: data.computer || 0,
    //   abacus: data.abacus || 0,
    //   taekwondo: data.taekwondo || 0
    // });

    // Need complete detail of fee
    const feeBreakdown = data.fee_breakdown || null;

    const record = {
      uuid: data.uuid || uuidv4(),
      student_uuid: data.student_uuid,

      name: data.name,
      class: data.class,
      section: data.section,

      amount: data.amount,
      month: data.month,
      year: data.year,
      payment_date: data.payment_date,

      status: data.status || 'paid',

      payment_method: data.payment_method || 'cash',
      receipt_number: data.receipt_number || null,

      late_fee: data.late_fee || 0,
      ignore_late_fee: data.ignore_late_fee || 0,

      computer: data.computer || 0,
      abacus: data.abacus || 0,
      taekwondo: data.taekwondo || 0,

      fee_breakdown: feeBreakdown,
      transaction_uuid: data.transaction_uuid,
      selected_months: data.selected_months,
      transaction_total: data.transaction_total,
      months_count: data.months_count,

      include_monthly: data.include_monthly,
      include_annual: data.include_annual,
      include_exam: data.include_exam,
      include_admission: data.include_admission,
      include_activity: data.include_activity,

      sibling_discount_enabled: data.sibling_discount_enabled || 0,
      sibling_discount_amount: data.sibling_discount_amount || 0,
      special_discount: data.special_discount || 0,

      remarks: data.remarks || null,
    };

    console.log("📦 Fee Breakdown Received:");
    console.log(data.fee_breakdown);

    console.log("💰 Saving Fee:");
    console.log(record);



    db.run(
      `INSERT INTO fees (

        uuid,
        transaction_uuid,
        student_uuid,

        name,
        class,
        section,

        amount,
        month,
        year,

        payment_date,
        status,

        payment_method,
        receipt_number,

        selected_months,
        transaction_total,
        months_count,

        include_monthly,
        include_annual,
        include_exam,
        include_admission,
        include_activity,

        late_fee,

        ignore_late_fee,

        computer,
        abacus,
        taekwondo,

        fee_breakdown,

        sibling_discount_enabled,
        sibling_discount_amount,
        special_discount,
        remarks,

        sync_status

        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.uuid,
        record.transaction_uuid,
        record.student_uuid,

        record.name,
        record.class,
        record.section,

        record.amount,
        record.month,
        record.year,

        record.payment_date,
        record.status,

        record.payment_method,
        record.receipt_number,

        record.selected_months,
        record.transaction_total,
        record.months_count,

        record.include_monthly,
        record.include_annual,
        record.include_exam,
        record.include_admission,
        record.include_activity,

        record.late_fee,

        record.ignore_late_fee,

        record.computer,
        record.abacus,
        record.taekwondo,

        record.fee_breakdown,

        record.sibling_discount_enabled,
        record.sibling_discount_amount,
        record.special_discount,
        record.remarks,
        0 //sync status
      ],
      function (err) {

        if (err) {
          console.error("❌ SQLite Insert Error:", err);
          reject(err);
          return;
        }

        console.log("✅ Fee saved locally:", record);

        resolve({
          success: true,
          id: this.lastID,
          uuid: record.uuid
        });
      }
    );
  });
}

function getLocalFees() {
  return new Promise((resolve, reject) => {

    db.all(`SELECT * FROM fees ORDER BY id DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });

  });
}

function saveStudent(data) {
  return new Promise((resolve, reject) => {

    db.run(
      `INSERT INTO students (
        uuid, admission_no, name, class, section,
        parent_name, parent_contact,
        computer, abacus, taekwondo, sync_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        data.uuid,
        data.admission_no,
        data.name,
        data.class,
        data.section,
        data.parent_name,
        data.parent_contact,
        data.computer,
        data.abacus,
        data.taekwondo
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ success: true, id: this.lastID });
      }
    );

  });
}

function getLocalStudents() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM students ORDER BY id DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function saveExpense(data) {
  return new Promise((resolve, reject) => {

    db.run(`
      INSERT INTO expenses (
        uuid,
        category,
        sub_category,
        description,
        note,
        amount,
        expense_date,
        is_planned,
        is_recurring,
        payment_mode,
        vendor,
        status,
        financial_year,
        month,
        sync_status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
      [
        data.uuid,
        data.category,
        data.sub_category || null,
        data.description || null,
        data.note || null,
        data.amount,
        data.expense_date,
        data.is_planned || 0,
        data.is_recurring || 0,
        data.payment_mode || "cash",
        data.vendor || null,
        data.status || "paid",
        data.financial_year || null,
        data.month || null
      ],
      function (err) {

        if (err) {
          console.error("Expense Insert Error:", err);
          reject(err);
        } else {
          resolve({
            success: true,
            id: this.lastID
          });
        }

      });

  });
}

function getLocalExpenses() {
  return new Promise((resolve, reject) => {

    db.all(
      `SELECT * FROM expenses ORDER BY id DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );

  });
}

async function saveMarks(data) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`
      INSERT INTO marks 
      (uuid, student_uuid, exam_id, subject_id, marks_obtained, total_marks, class_id, section, sync_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
    `);

    const uuid = require('uuid').v4();

    stmt.run(
      uuid,
      data.student_uuid,
      data.exam_id,
      data.subject_id,
      data.marks_obtained,
      data.total_marks,
      data.class_id,
      data.section,
      function (err) {
        if (err) reject(err);
        else resolve({ status: true });
      }
    );
  });
}


module.exports = {
  saveFees,
  getLocalFees,
  saveStudent,
  getLocalStudents,
  saveExpense,
  getLocalExpenses,
  saveMarks
};
