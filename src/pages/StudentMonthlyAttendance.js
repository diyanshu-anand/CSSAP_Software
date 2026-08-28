import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import Layout from "../components/Layout";

function StudentMonthlyAttendance() {

    //   const [classId, setClassId] = useState("");
    const [className, setClassName] = useState("");
    const [section, setSection] = useState("");
    const [month, setMonth] = useState("");
    // const [workingDays, setWorkingDays] = useState("");
    const [holidays, setHolidays] = useState("");
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [classId, setClassId] = useState("");
    const [totalDays, setTotalDays] = useState("");
    // const [holidays, setHolidays] = useState("");

    const workingDays =
        totalDays && holidays ? Number(totalDays) - Number(holidays) : "";


    // Fetch students by class

    const updatePositions = (list) => {
        return list.map((s, i) => ({
            ...s,
            position: i + 1
        }));
    };

    const moveUp = (index) => {
        if (index === 0) return;

        let updated = [...students];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];

        setStudents(updatePositions(updated));
    };

    const moveDown = (index) => {
        if (index === students.length - 1) return;

        let updated = [...students];
        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];

        setStudents(updatePositions(updated));
    };


    // -----------------------Position Update-------------------------------------
    const saveOrder = async () => {
        try {
            await axios.post(`${API_BASE}/updateStudentPosition.php`, {
                students: students.map(s => ({
                    id: s.id,
                    position: s.position
                }))
            });

            alert("Order Saved Successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to save order");
        }
    };


    const fetchStudents = () => {
        axios.get(`${API_BASE}/getStudentsByClass.php?class=${className}&section=${section}`)
            .then(res => {
                if (res.data.status) {
                    setStudents(
                        res.data.data.map(s => ({
                            ...s,
                            days_present: 0
                        }))
                    );
                }
            });
    };

    const handleChange = (index, value) => {
        const updated = [...students];
        updated[index].days_present = value;
        setStudents(updated);
    };

    const handleSubmit = async () => {

        if (!className || !month || !workingDays) {
            alert("Please fill all required fields");
            return;
        }

        if (students.length === 0) {
            alert("Load students first");
            return;
        }

        try {
            const res = await axios.post(
                `${API_BASE}/saveStudentMonthlyAttendance.php`,
                {
                    class: className,
                    month: month,
                    total_working_days: Number(workingDays),
                    total_holidays: Number(holidays),
                    students: students.map(s => ({
                        student_id: s.id,
                        days_present: Number(s.days_present)
                    }))
                }
            );

            console.log(res.data); // important for debugging

            if (res.data.status) {
                alert("Attendance Saved Successfully");
            } else {
                alert("Error: " + res.data.error);
            }

        } catch (error) {
            console.error(error);
            alert("Server error occurred");
        }
    };

    useEffect(() => {
        axios.get(`${API_BASE}/getClasses.php`)
            .then(res => {
                if (res.data.status) {
                    setClasses(res.data.data);
                }
            });
    }, []);

    return (
        <Layout>
            <h2>Student Monthly Attendance</h2>

            <div>
                {/* <input type="number" placeholder="Class ID"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                /> */}

                <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                >
                    <option value="">Select Class</option>

                    {classes.map((cls) => (
                        <option key={cls.id} value={cls.class_name}>
                            {cls.class_name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Section (e.g., A)"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                />

                <button onClick={fetchStudents}>Load Students</button>

                <br /><br />

                <input
                    type="month"
                    // placeholder="FOR year other than 2026 type mannually"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    min="2020-01"
                    max="2030-12"
                    // onFocus={(e) => e.target.showPicker?.()} // optional
                    onKeyDown={(e) => {
                        // allow manual typing without interference
                        e.stopPropagation();
                    }}
                />

                <input
                    type="number"
                    placeholder="Total Days in Month"
                    value={totalDays}
                    onChange={(e) => setTotalDays(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                />

                <input
                    type="number"
                    placeholder="Holidays"
                    value={holidays}
                    onChange={(e) => setHolidays(e.target.value)}
                    onWheel={(e) => e.target.blur()}
                />

                <input
                    type="number"
                    placeholder="Working Days"
                    value={workingDays}
                    readOnly
                />

                <input
                    type="number"
                    placeholder="Set all present days"
                    onChange={(e) => {
                        const value = e.target.value;
                        const updated = students.map(s => ({
                            ...s,
                            days_present: value
                        }));
                        setStudents(updated);
                    }}
                    onWheel={(e) => e.target.blur()}
                />
            </div>

            <br />

            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>Serial Number</th>
                        <th>Order</th>
                        <th>Name</th>
                        <th>Days Present</th>
                        <th>Absent</th>
                        <th>%</th>

                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => {

                        const present = Number(student.days_present || 0);
                        const total = Number(workingDays || 0);

                        const absent = Math.max(0, total - present);
                        const percentage = total > 0
                            ? ((present / total) * 100).toFixed(2)
                            : 0;

                        const isInvalid = present > total;

                        return (
                            <tr key={student.id}>

                                {/* Serial Number */}
                                <td>{index + 1}</td>

                                {/* ORDER */}
                                <td>
                                    <button onClick={() => moveUp(index)} disabled={index === 0}>↑</button>
                                    <button onClick={() => moveDown(index)} disabled={index === students.length - 1}>↓</button>
                                </td>

                                {/* NAME */}
                                <td>{student.name}</td>

                                {/* INPUT */}
                                <td>
                                    <input
                                        type="number"
                                        value={student.days_present}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const next = document.querySelectorAll(".present-input")[index + 1];
                                                if (next) next.focus();
                                            }
                                        }}
                                        style={{
                                            border: isInvalid ? "2px solid red" : ""
                                        }}
                                        className="present-input"
                                    />
                                </td>

                                <td>{absent}</td>
                                <td>{percentage}%</td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <p>
                Total Students: {students.length} |
                Avg Attendance: {
                    students.length > 0
                        ? (
                            students.reduce((sum, s) => sum + Number(s.days_present || 0), 0)
                            / students.length
                        ).toFixed(1)
                        : 0
                }
            </p>

            <br />
            <button onClick={saveOrder}>Save Order</button>
            <button onClick={handleSubmit}>Save Attendance</button>

        </Layout>
    );
}

export default StudentMonthlyAttendance;