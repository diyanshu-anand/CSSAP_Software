const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Use proper writable path
const dbPath = app.getPath('userData') + '/database.db';

console.log("📁 DB PATH:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ DB Connection Error:", err.message);
  } else {
    console.log("✅ Connected to SQLite database");
  }
});

// Modify existing table

function addColumn(sql) {
  db.run(sql, (err) => {
    if (
      err &&
      !err.message.includes("duplicate column name")
    ) {
      console.error("Migration Error:", err.message);
    }
  });
}

function addFeeColumn(sql) {
  db.run(sql, (err) => {
    if (
      err &&
      !err.message.includes("duplicate column name")
    ) {
      console.error("Fee Migration Error:", err.message);
    }
  });
}


// Create Fees Table
db.run(`
  CREATE TABLE IF NOT EXISTS fees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT,
    student_uuid TEXT,

    name TEXT,
    class TEXT,
    section TEXT,

    amount REAL,
    month TEXT,
    year INTEGER,
    payment_date TEXT,

    status TEXT DEFAULT 'paid',

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

    payment_method TEXT DEFAULT 'cash',
    receipt_number TEXT,

    late_fee REAL DEFAULT 0,

    computer INTEGER DEFAULT 0,
    abacus INTEGER DEFAULT 0,
    taekwondo INTEGER DEFAULT 0,

    fee_breakdown TEXT,

    sync_status INTEGER DEFAULT 0
  )
`);

// Modify existing fees table


addFeeColumn(`ALTER TABLE fees ADD COLUMN fee_breakdown TEXT`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN transaction_uuid TEXT`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN selected_months TEXT`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN transaction_total REAL DEFAULT 0`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN months_count INTEGER DEFAULT 1`);

addFeeColumn(`ALTER TABLE fees ADD COLUMN include_monthly INTEGER DEFAULT 0`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN include_annual INTEGER DEFAULT 0`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN include_exam INTEGER DEFAULT 0`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN include_admission INTEGER DEFAULT 0`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN include_activity INTEGER DEFAULT 0`);

addFeeColumn(`ALTER TABLE fees ADD COLUMN sibling_discount_enabled INTEGER DEFAULT 0`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN sibling_discount_amount REAL DEFAULT 0`);

addFeeColumn(`ALTER TABLE fees ADD COLUMN remarks TEXT`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN ignore_late_fee INTEGER DEFAULT 0`);
addFeeColumn(`ALTER TABLE fees ADD COLUMN special_discount REAL DEFAULT 0`);

// Create Student Records Table
db.run(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT,
    admission_no TEXT,
    name TEXT,
    class TEXT,
    section TEXT,
    parent_name TEXT,
    parent_contact TEXT,

    computer INTEGER DEFAULT 0,
    abacus INTEGER DEFAULT 0,
    taekwondo INTEGER DEFAULT 0,

    sync_status INTEGER DEFAULT 0
  )
`);

// Create expenses table
// db.run(`
//   CREATE TABLE IF NOT EXISTS expenses (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     uuid TEXT,
//     category TEXT,
//     description TEXT,
//     amount REAL,
//     expense_date TEXT,
//     sync_status INTEGER DEFAULT 0,
//     created_at TEXT DEFAULT CURRENT_TIMESTAMP
//   )
// `);

db.run(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    uuid TEXT,

    category TEXT,
    sub_category TEXT,

    description TEXT,
    note TEXT,

    amount REAL,
    expense_date TEXT,

    is_planned INTEGER DEFAULT 0,
    is_recurring INTEGER DEFAULT 0,

    financial_year TEXT,
    month TEXT,

    sync_status INTEGER DEFAULT 0,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);


addColumn(`ALTER TABLE expenses ADD COLUMN sub_category TEXT`);
addColumn(`ALTER TABLE expenses ADD COLUMN note TEXT`);
addColumn(`ALTER TABLE expenses ADD COLUMN is_planned INTEGER DEFAULT 0`);
addColumn(`ALTER TABLE expenses ADD COLUMN is_recurring INTEGER DEFAULT 0`);
addColumn(`ALTER TABLE expenses ADD COLUMN financial_year TEXT`);
addColumn(`ALTER TABLE expenses ADD COLUMN month TEXT`);
addColumn(`ALTER TABLE expenses ADD COLUMN payment_mode TEXT DEFAULT 'cash'`);
addColumn(`ALTER TABLE expenses ADD COLUMN vendor TEXT`);
addColumn(`ALTER TABLE expenses ADD COLUMN status TEXT DEFAULT 'paid'`);


// Create Marks data table

db.run(`CREATE TABLE IF NOT EXISTS marks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  uuid TEXT,
  student_uuid TEXT,

  exam_id TEXT,
  subject_id TEXT,

  marks_obtained TEXT,
  total_marks INTEGER DEFAULT 100,

  class_id TEXT,
  section TEXT,

  sync_status INTEGER DEFAULT 0,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`)


module.exports = db;