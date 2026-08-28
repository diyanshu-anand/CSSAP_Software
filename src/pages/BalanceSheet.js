import { useEffect,useState } from "react";
import { getBalanceSheet } from "../services/financeApi";

export default function BalanceSheet(){

const [data,setData] = useState(null);

useEffect(()=>{

getBalanceSheet().then(res=>{
setData(res);
});

},[]);

if(!data) return <div>Loading...</div>;

return(

<div>

<h2>Balance Sheet</h2>

<h3>Assets</h3>

<ul>
{data.assets.map((a,i)=>(
<li key={i}>{a.account_name} : {a.balance}</li>
))}
</ul>

<h3>Liabilities</h3>

<ul>
{data.liabilities.map((a,i)=>(
<li key={i}>{a.account_name} : {a.balance}</li>
))}
</ul>

<h3>Equity</h3>

<p>Retained Earnings : {data.retained_earnings}</p>

</div>

);
}