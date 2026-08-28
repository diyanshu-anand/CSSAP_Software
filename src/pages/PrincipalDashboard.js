import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import { Bar, Pie } from "react-chartjs-2";

export default function PrincipalDashboard() {
  const [data, setData] = useState({
    total_students: 0,
    total_teachers: 0,
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
        Principal Dashboard
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>Total Students</Typography>
              <Typography variant="h4">{data.total_students}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>Total Teachers</Typography>
              <Typography variant="h4">{data.total_teachers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>Monthly Fees</Typography>
              <Typography variant="h4">₹{data.monthly_fees}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography>Net Balance</Typography>
              <Typography variant="h4">₹{data.net_balance}</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Layout>
  );
}