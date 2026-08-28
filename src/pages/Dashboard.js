import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard() {
  const [data, setData] = useState({
    total_students: 0,
    monthly_fees: 0,
    monthly_expenses: 0,
    net_balance: 0
  });

  useEffect(() => {
    axios.get(`${API_BASE}/getDashboard.php`)
      .then(res => setData(res.data));
  }, []);

  const cardStyle = {
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "0.3s",
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)"
    }
  };

  const barData = {
    labels: ["Fees", "Expenses"],
    datasets: [
      {
        label: "This Month",
        data: [data.monthly_fees, data.monthly_expenses],
        backgroundColor: ["#16A34A", "#DC2626"]
      }
    ]
  };

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [data.monthly_fees, data.monthly_expenses],
        backgroundColor: ["#16A34A", "#DC2626"]
      }
    ]
  };

  return (
    <Layout>
      <Box sx={{ padding: 2, backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
        
        {/* Title */}
        <Typography variant="h4" fontWeight="600" gutterBottom>
          Dashboard Overview
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} marginBottom={4}>

          <Grid item xs={12} md={3}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Students
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {data.total_students}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Monthly Fees
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: "#16A34A" }}>
                  ₹{data.monthly_fees}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Monthly Expenses
                </Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: "#DC2626" }}>
                  ₹{data.monthly_expenses}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  Net Balance
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ₹{data.net_balance}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>

          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Monthly Comparison
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={barData} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Income vs Expense Ratio
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Pie data={pieData} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>

      </Box>
    </Layout>
  );
}

export default Dashboard;