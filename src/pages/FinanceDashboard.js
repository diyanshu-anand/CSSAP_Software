// import ExportButtons from "../components/ExportButtons";

// function FinanceDashboard(){

// return(

// <div>

// <h1>Finance Corner</h1>

// <ExportButtons/>

// </div>

// );

// }

// export default FinanceDashboard;

import { use, useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import {
Card,
CardContent,
Typography,
Grid
} from "@mui/material";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts";

function FinanceDashboard(){

const [data,setData] = useState(null);
const navigate = useNavigate();

useEffect(()=>{

axios.get(`${API_BASE}/finance/financcesummary.php`)
.then(res=>{
setData(res.data);
})
.catch(err=>{
console.log(err);
});

},[]);

const navtofinancecontrolPanel = () => {

    navigate('/finance/control');

}

if(!data){
return <Layout>Loading...</Layout>
}

return(

<Layout>

<Typography variant="h5" gutterBottom>
Finance Dashboard
</Typography>

<Grid container spacing={3}>

<Grid item xs={12} md={3}>
<Card>
<CardContent>
<Typography variant="subtitle2">
Total Fees
</Typography>

<Typography variant="h5">
₹ {data.total_fees}
</Typography>
</CardContent>
</Card>
</Grid>


<Grid item xs={12} md={3}>
<Card>
<CardContent>
<Typography variant="subtitle2">
Total Expenses
</Typography>

<Typography variant="h5">
₹ {data.total_expenses}
</Typography>
</CardContent>
</Card>
</Grid>


<Grid item xs={12} md={3}>
<Card>
<CardContent>
<Typography variant="subtitle2">
Net Profit
</Typography>

<Typography variant="h5">
₹ {data.net_profit}
</Typography>
</CardContent>
</Card>
</Grid>


<Grid item xs={12} md={3}>
<Card>
<CardContent>
<Typography variant="subtitle2">
Cash Balance
</Typography>

<Typography variant="h5">
₹ {data.cash_balance}
</Typography>
</CardContent>
</Card>
</Grid>


</Grid>


<Card sx={{mt:4}}>
<CardContent>

<Typography variant="h6" gutterBottom>
Monthly Fee Collection
</Typography>

<ResponsiveContainer width="100%" height={300}>
<BarChart data={data.monthly_fees}>
<XAxis dataKey="month"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="total"/>
</BarChart>
</ResponsiveContainer>

</CardContent>
</Card>

<button
onClick={navtofinancecontrolPanel}
style={{
padding:"10px"
}}
>
Visit Finance Control Panel
</button>


</Layout>



)

}

export default FinanceDashboard;