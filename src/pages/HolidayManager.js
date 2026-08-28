import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";

function HolidayManager() {

    const [date, setDate] = useState("");
    const [reason, setReason] = useState("");
    const [holidays, setHolidays] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());

    const fetchHolidays = () => {
        axios.get(`${API_BASE}/getHolidays.php?year=${year}`)
            .then(res => {
                if (res.data.status) {
                    setHolidays(res.data.data);
                }
            });
    };

    useEffect(() => {
        fetchHolidays();
    }, [year]);

    const addHoliday = () => {
        axios.post(`${API_BASE}/addHoliday.php`, {
            holiday_date: date,
            reason
        }).then(() => {
            setDate("");
            setReason("");
            fetchHolidays();
        });
    };

    const deleteHoliday = (id) => {
        axios.post(`${API_BASE}/deleteHolidays.php`, { id })
            .then(() => fetchHolidays());
    };

    return (
        <Layout>
            <div>
                <h2>Holiday Manager</h2>

                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input type="text" placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                <button onClick={addHoliday}>Add Holiday</button>

                <hr />

                <h3>Holidays ({year})</h3>

                <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />

                <ul>
                    {holidays.map(h => (
                        //   <li key={h.id}>
                        //     {h.holiday_date} - {h.reason}
                        //     <button onClick={()=>deleteHoliday(h.id)}>❌</button>
                        //   </li>

                        <li key={h.id} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px",
                            marginBottom: "8px",
                            background: "#f6f7fb",
                            borderRadius: "8px",
                            alignItems: "center"
                        }}>

                            <div>
                                <div style={{ fontWeight: "600" }}>
                                    📅 {h.holiday_date}
                                </div>
                                <div style={{ fontSize: "12px", color: "#666" }}>
                                    {h.reason || "No reason provided"}
                                </div>
                            </div>

                            <button
                                onClick={() => deleteHoliday(h.id)}
                                style={{
                                    background: "red",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    cursor: "pointer"
                                }}
                            >
                                ❌
                            </button>

                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
}

export default HolidayManager;