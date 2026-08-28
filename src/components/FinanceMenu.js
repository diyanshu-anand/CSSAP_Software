import { Link } from "react-router-dom";

export default function FinanceMenu() {
  return (
    <div className="finance-menu">
      <Link to="/finance/trial">Trial Balance</Link>
      <Link to="/finance/pl">Profit & Loss</Link>
      <Link to="/finance/balance">Balance Sheet</Link>
      <Link to="/finance/cashflow">Cash Flow</Link>
      <Link to="/finance/schedule3">Schedule III</Link>
      <Link to="/finance/lock">Lock Financial Year</Link>
    </div>
  );
}