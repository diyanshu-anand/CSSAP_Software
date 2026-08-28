import { useEffect,useState } from "react";
import { getCashFlow } from "../services/financeApi";

export default function CashFlow(){

const [data,setData] = useState(null);

useEffect(()=>{

getCashFlow().then(res=>{
setData(res);
});

},[]);

if(!data) return <div>Loading...</div>;

return(

<div>

<h2>Cash Flow</h2>

<h3>Operating Activities</h3>

{Object.entries(data.operating_activities).map(([k,v])=>(
<p key={k}>{k} : {v}</p>
))}

<h3>Net Cash Flow : {data.summary.net_cash_flow}</h3>

</div>

);

}