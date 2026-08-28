import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Fees from "./pages/Fees";
import Expenses from "./pages/Expenses";
import MarksEntry from "./pages/MarksEntry";
import ReportCard from "./pages/ReportCard";
import TeacherAttendanceUpload from "./pages/TeacherAttendanceUpload";
import TeacherAttendanceView from "./pages/TeacherAttendanceView";
import TeacherSalarySummary from "./pages/TeacherSalarySummary";
import StudentMonthlyAttendance from "./pages/StudentMonthlyAttendance";
import StudentAttendanceAnalytics from "./pages/StudentAttendanceAnalytics";

import TrialBalances from "./pages/TrialBalance";
import ProfitLoss from "./pages/ProfitLoss";
import BalanceSheet from "./pages/BalanceSheet";
import CashFlow from "./pages/CashFlow";
import FinancialYearLock from "./pages/FinanceYearLock";
import FinanceDashboard from "./pages/FinanceDashboard";
import FinanceControlPanel from "./pages/FinanceCorner";

import LKGReportEntry from "./pages/LKGReportEntry";
import TestReport from "./pages/TestReport";
import ViewReport from "./pages/View_Report";
import ViewReport_High_School from "./pages/View_High_School_Report";
import PrincipalDashboard from "./pages/PrincipalDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AccountantDashboard from "./pages/AccountantDashboard";
import HolidayManager from "./pages/HolidayManager";

import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";

import { LoaderProvider } from "./context/LoaderContext";
import GlobalLoader from "./components/GloabalLoader";

import UploadStatusPanel from "./components/AttendanceUpload";
import SyncStatusPanel from "./components/SyncComponent";
import Teachers from "./pages/Teachers";
import TransferCertificate from "./pages/Transfer_Certificate";
import PrincipalFeesLedger from "./pages/PrincipalFeesLedger";
import FeeStructure from "./pages/FeeStructure";
import IssuedTransferCertificates from "./pages/IssuedTransferCertificates";
import FeeLedger from "./pages/FeeLedgerEntry";
import FeeHistory from "./pages/FeesHistory";

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));

  useEffect(() => {
    const handleStorage = () => {
      setUser(localStorage.getItem("user"));
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <LoaderProvider>
      <GlobalLoader />

      {/*  GLOBAL STATUS PANELS */}
      <div style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        width: "320px",
        zIndex: 9999,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        maxHeight: "300px",
        overflowY: "auto"
      }}>
        <UploadStatusPanel />
      </div>

      {/* Using HashRouter for Electron production */}
      <HashRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected - Common Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher", "accountant"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/holidays"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <HolidayManager />
              </ProtectedRoute>
            }
          />

          {/* School Sector */}
          <Route
            path="/students"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fees"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <Fees />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <Expenses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marks-entry"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <MarksEntry />
              </ProtectedRoute>
            }
          />

          <Route
            path="/report-card"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <ReportCard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marks-entry-lkg"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <LKGReportEntry />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher-attendance-upload"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <TeacherAttendanceUpload />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher-attendance"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <TeacherAttendanceView />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher-salary-summary"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal"]}>
                <TeacherSalarySummary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student-monthly-attendance"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <StudentMonthlyAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance-analytics"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <StudentAttendanceAnalytics />
              </ProtectedRoute>
            }
          />

          {/* Testing */}
          <Route
            path="/report-card-test"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <TestReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-report-card-test"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <ViewReport />
              </ProtectedRoute>
            }
          />

          <Route
            path="/view-high-report-card-test"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "teacher"]}>
                <ViewReport_High_School />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teachers"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal"]}>
                <Teachers />
              </ProtectedRoute>
            }
          />

          {/* Finance Sector */}
          <Route
            path="/finance-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <FinanceDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/finance/trial"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <TrialBalances />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fee-history"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <FeeHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fee-history"
            element={<FeeHistory />}
          />

          <Route
            path="/finance/pl"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <ProfitLoss />
              </ProtectedRoute>
            }
          />

          <Route
            path="/finance/balance"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <BalanceSheet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/finance/cashflow"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
                <CashFlow />
              </ProtectedRoute>
            }
          />

          <Route
            path="/finance/lock"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal"]}>
                <FinancialYearLock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/finance/control"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal"]}>
                <FinanceControlPanel />
              </ProtectedRoute>
            }
          />

          {/* Principal Dashboard */}
          <Route
            path="/principal-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal"]}>
                <PrincipalDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/finance-principal-tc" element={<ProtectedRoute user={user} allowedRoles={["principal", "accountant"]}>
            <TransferCertificate />
          </ProtectedRoute>} />

          {/* Teacher Dashboard */}
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Accountant Dashboard */}
          <Route
            path="/accountant-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["accountant"]}>
                <AccountantDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/fee-structure"
            element={
              <ProtectedRoute user={user} allowedRoles={["accountant", "principal"]}>
                <FeeStructure />
              </ProtectedRoute>
            }
          />

          <Route
            path="/issued-transfer-certificates"
            element={<IssuedTransferCertificates />}
          />

          <Route path="/feesnewentry" element={<FeeLedger />} />

          {/* Principal Ledger */}
          <Route
            path="/principal-ledger"
            element={
              <ProtectedRoute user={user} allowedRoles={["principal"]}>
                <PrincipalFeesLedger />
              </ProtectedRoute>
            }
          />
        </Routes>
      </HashRouter>
    </LoaderProvider>
  );
}

export default App;