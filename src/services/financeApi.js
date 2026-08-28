const API = "http://localhost:8080/ABM/api/reports";

export const getTrialBalance = async () => {
  const res = await fetch(`${API}/trial_balance.php`);
  return res.json();
};

export const getProfitLoss = async () => {
  const res = await fetch(`${API}/profit_loss.php`);
  return res.json();
};

export const getBalanceSheet = async () => {
  const res = await fetch(`${API}/balance_sheet.php`);
  return res.json();
};

export const getCashFlow = async () => {
//   const res = await fetch(`${API}/cashflow_statement.php?from=2025-04-01&to=2026-03-31`);
  const res = await fetch(`${API}/cashflow_statement.php`);

  return res.json();
};

export const getScheduleIII = async () => {
  const res = await fetch(`${API}/balance_sheet_schedule3.php`);
  return res.json();
};

export const lockFinancialYear = async (id) => {
  const res = await fetch(`${API}/lock_financial_year.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ financial_year_id: id })
  });

  return res.json();
};