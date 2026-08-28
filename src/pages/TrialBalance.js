import { useEffect, useState } from "react";
import { getTrialBalance } from "../services/financeApi";
import Layout from "../components/Layout";

export default function TrialBalance() {

  const [data, setData] = useState([]);

  useEffect(() => {

    getTrialBalance().then(res => {
      setData(res.trial_balance);
    });

  }, []);

  return (
    <Layout>
      <div>

        <h2>Trial Balance</h2>

        <table border="1">
          <thead>
            <tr>
              <th>Account</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>

          <tbody>

            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.account_name}</td>
                <td>{row.debit}</td>
                <td>{row.credit}</td>
              </tr>
            ))}

          </tbody>
        </table>

      </div>
    </Layout>
  );
}