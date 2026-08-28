import Layout from "../components/Layout";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function TeacherDashboard() {
  return (
    <Layout>
      <Typography variant="h4" fontWeight="600" gutterBottom>
        Teacher Dashboard
      </Typography>

      <Grid container spacing={3}>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>My Classes</Typography>
              <Typography variant="h4">--</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Attendance Pending</Typography>
              <Typography variant="h4">--</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Marks Entry</Typography>
              <Typography variant="h4">--</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Layout>
  );
}