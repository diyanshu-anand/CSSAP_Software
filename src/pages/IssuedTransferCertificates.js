import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import API_BASE from "../config";
import "./issuedTransferCertificates.css";

function IssuedTransferCertificates() {

    const [records, setRecords] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("tc_asc");

    const loadData = async () => {
        try {
            const res = await axios.get(
                `${API_BASE}/get_issued_tc.php`
            );

            const data = res.data.data || [];

            setRecords(data);
            setFiltered(data);

        } catch (err) {
            console.error(err);
            alert("Failed to load issued TCs");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {

        const value = search.toLowerCase().trim();

        // First filter
        let result = records.filter(tc =>
            tc.name?.toLowerCase().includes(value) ||
            tc.tc_number?.toLowerCase().includes(value) ||
            tc.admission_no?.toLowerCase().includes(value) ||
            tc.class_at_leaving?.toLowerCase().includes(value)
        );

        // Then sort
        result.sort((a, b) => {

            if (sortBy === "tc_asc") {
                return Number(a.tc_number) - Number(b.tc_number);
            }

            if (sortBy === "tc_desc") {
                return Number(b.tc_number) - Number(a.tc_number);
            }

            if (sortBy === "date_newest") {
                return new Date(b.issue_date) - new Date(a.issue_date);
            }

            if (sortBy === "date_oldest") {
                return new Date(a.issue_date) - new Date(b.issue_date);
            }

            return 0;
        });

        setFiltered(result);

    }, [search, records, sortBy]);

    return (
        <Layout>

            <div className="issued-tc-page">

                <div className="issued-tc-header">

                    <h2>Issued Transfer Certificates</h2>

                    <div className="issued-tc-controls">

                        <input
                            type="text"
                            placeholder="Search by Name, TC No, Admission No..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="tc_asc">
                                TC Number — Ascending
                            </option>

                            <option value="tc_desc">
                                TC Number — Descending
                            </option>

                            <option value="date_newest">
                                Issue Date — Newest First
                            </option>

                            <option value="date_oldest">
                                Issue Date — Oldest First
                            </option>
                        </select>

                    </div>

                </div>

                <div className="issued-card">

                    <table className="issued-table">

                        <thead>
                            <tr>
                                <th>TC No</th>
                                <th>Admission No</th>
                                <th>Student Name</th>
                                <th>Father Name</th>
                                <th>Class</th>
                                <th>Issue Date</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-row">
                                        No Issued Transfer Certificates Found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(tc => (
                                    <tr key={tc.id}>
                                        <td>{tc.tc_number}</td>
                                        <td>{tc.admission_no}</td>
                                        <td>{tc.name}</td>
                                        <td>{tc.father_name}</td>
                                        <td>{tc.class_at_leaving}</td>
                                        <td>{tc.issue_date}</td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </Layout>
    );
}

export default IssuedTransferCertificates;
