import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";

const FinanceControlPanel = () => {
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedFY, setSelectedFY] = useState("");

  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationDone, setMigrationDone] = useState(false);

  const API_BASE = "https://lightblue-wolverine-671984.hostingersite.com";

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const fetchFinancialYears = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/get_financial_year.php`);
      const data = await res.json();

      setFinancialYears(data || []);

      if (!selectedFY && data?.length > 0) {
        setSelectedFY(String(data[0].id));
      }
    } catch (err) {
      console.error("Error loading financial years", err);
    }
  };

  // -----------------------------
  // LOCK FINANCIAL YEAR
  // -----------------------------
  const lockFinancialYear = async () => {
    if (!selectedFY) {
      alert("Select financial year first");
      return;
    }

    if (!window.confirm("Are you sure you want to lock this financial year?")) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/reports/lock_financial_year.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            financial_year_id: selectedFY,
          }),
        }
      );

      const data = await res.json();

      alert(data.message || "Financial year updated");

      fetchFinancialYears();
    } catch (err) {
      console.error(err);
      alert("Failed to update financial year");
    }
  };

  // -----------------------------
  // MIGRATION FUNCTION
  // -----------------------------
  const runMigration = async () => {
    if (
      !window.confirm(
        "Run migration?\n\nThis will convert all old data into journal entries."
      )
    ) {
      return;
    }

    setIsMigrating(true);

    try {
      const res = await fetch(
        `${API_BASE}/api/migrate_financials.php`
      );

      const text = await res.text(); // migration returns HTML

      console.log("Migration Response:", text);

      alert("Migration completed successfully ✅");

      setMigrationDone(true);
    } catch (err) {
      console.error(err);
      alert("Migration failed ❌");
    }

    setIsMigrating(false);
  };

  // -----------------------------
  // DOWNLOAD FUNCTIONS
  // -----------------------------
  const downloadTrialExcel = () => {
    window.open(`${API_BASE}/api/finance/export_balance_sheet.php`);
  };

  const downloadPLExcel = () => {
    window.open(`${API_BASE}/api/finance/export_profit_loss.php`);
  };

  const downloadCashFlowExcel = () => {
    window.open(`${API_BASE}/api/finance/export_cashflow_statement.php`);
  };

  // -----------------------------
  // HELPERS
  // -----------------------------
  const selectedYear = financialYears.find(
    (fy) => String(fy.id) === String(selectedFY)
  );

  const isLocked = Number(selectedYear?.is_locked) === 1;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <Layout>
      <div style={{ padding: "30px" }}>
        <h2>Finance Control Panel</h2>

        {/* FINANCIAL YEAR CONTROL */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Financial Year Control</h3>

          <select
            value={selectedFY}
            onChange={(e) => setSelectedFY(e.target.value)}
            style={{
              padding: "8px",
              marginRight: "10px",
            }}
          >
            {financialYears.map((fy) => (
              <option key={fy.id} value={String(fy.id)}>
                {fy.start_date} - {fy.end_date}
              </option>
            ))}
          </select>

          <button
            onClick={lockFinancialYear}
            disabled={isLocked}
            style={{
              padding: "8px 16px",
              background: isLocked ? "#aaa" : "#d9534f",
              color: "#fff",
              border: "none",
              cursor: isLocked ? "not-allowed" : "pointer",
            }}
          >
            {isLocked ? "Financial Year Locked" : "Lock Financial Year"}
          </button>
        </div>

        {/* MIGRATION */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Data Migration</h3>

          <button
            onClick={runMigration}
            disabled={isMigrating}
            style={{
              padding: "10px 20px",
              background: isMigrating ? "#aaa" : "#5cb85c",
              color: "#fff",
              border: "none",
              cursor: isMigrating ? "not-allowed" : "pointer",
            }}
          >
            {isMigrating ? "Running Migration..." : "Run Migration"}
          </button>

          {migrationDone && (
            <p style={{ color: "green", marginTop: "10px" }}>
              Migration completed ✔
            </p>
          )}
        </div>

        {/* REPORTS */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Download Finance Reports</h3>

          <button
            onClick={downloadTrialExcel}
            disabled={!migrationDone}
            style={{
              padding: "10px",
              marginRight: "10px",
              background: !migrationDone ? "#ccc" : "#007bff",
              color: "#fff",
              border: "none",
              cursor: !migrationDone ? "not-allowed" : "pointer",
            }}
          >
            Balance Sheet Excel
          </button>

          <button
            onClick={downloadPLExcel}
            disabled={!migrationDone}
            style={{
              padding: "10px",
              marginRight: "10px",
              background: !migrationDone ? "#ccc" : "#28a745",
              color: "#fff",
              border: "none",
              cursor: !migrationDone ? "not-allowed" : "pointer",
            }}
          >
            Profit & Loss Excel
          </button>

          <button
            onClick={downloadCashFlowExcel}
            disabled={!migrationDone}
            style={{
              padding: "10px",
              background: !migrationDone ? "#ccc" : "#f0ad4e",
              color: "#fff",
              border: "none",
              cursor: !migrationDone ? "not-allowed" : "pointer",
            }}
          >
            Cash Flow Statement
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default FinanceControlPanel;