import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function AccountantDashboard() {
  const [data, setData] = useState({
    monthly_fees: 0,
    monthly_expenses: 0,
    net_balance: 0
  });

  useEffect(() => {
    axios.get(`${API_BASE}/getDashboard.php`)
      .then(res => setData(res.data));
  }, []);

  return (
    <Layout>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Accountant Dashboard
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Monthly Income</Typography>
              <Typography variant="h4" sx={{ color: "#16A34A" }}>
                ₹{data.monthly_fees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Monthly Expenses</Typography>
              <Typography variant="h4" sx={{ color: "#DC2626" }}>
                ₹{data.monthly_expenses}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Net Profit</Typography>
              <Typography variant="h4">
                ₹{data.net_balance}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Layout>
  );
}