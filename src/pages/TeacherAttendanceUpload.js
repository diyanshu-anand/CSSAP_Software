import React, { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function TeacherAttendanceUpload() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a CSV file.");
            return;
        }

        const formData = new FormData();
        formData.append("csv_file", file);

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:8080/ABM/api/uploadTeachersAttendance.php",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            //   if (response.data.status) {
            //     setMessage("Attendance uploaded successfully!");
            //   } else {
            //     setMessage("Upload failed.");
            //   }

            console.log("FULL RESPONSE:", response);
            console.log("DATA:", response.data);

            setMessage(JSON.stringify(response.data));

        } catch (error) {
            console.error(error);
            setMessage("Server error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.heading}>Teacher Monthly Attendance Upload</h2>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={styles.input}
                    />

                    <button
                        onClick={handleUpload}
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload Attendance"}
                    </button>

                    {message && <p style={styles.message}>{message}</p>}
                </div>
            </div>
        </Layout>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        backgroundColor: "#f4f6f9",
    },
    card: {
        background: "#ffffff",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        width: "400px",
        textAlign: "center",
    },
    heading: {
        marginBottom: "20px",
        color: "#2c3e50",
    },
    input: {
        marginBottom: "20px",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#2c7be5",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
    },
    message: {
        marginTop: "20px",
        fontWeight: "bold",
    },
};

export default TeacherAttendanceUpload;