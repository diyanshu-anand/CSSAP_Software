import { useEffect, useState } from "react";
import { getProfitLoss } from "../services/financeApi";
import Layout from "../components/Layout";

export default function ProfitLoss() {

  const [data, setData] = useState(null);

  useEffect(() => {

    getProfitLoss().then(res => {
      setData(res);
    });

  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <Layout>
      <div>

        <h2>Profit & Loss</h2>

        <h3>Income</h3>

        <ul>
          {data.income.map((i, index) => (
            <li key={index}>{i.account_name} : {i.amount}</li>
          ))}
        </ul>

        <h3>Expenses</h3>

        <ul>
          {data.expenses.map((i, index) => (
            <li key={index}>{i.account_name} : {i.amount}</li>
          ))}
        </ul>

        <h3>Net Profit : {data.net_profit}</h3>

      </div>

    </Layout>

  );
}