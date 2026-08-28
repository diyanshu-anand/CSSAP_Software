import { useEffect, useState } from "react";

function UploadStatusPanel() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        console.log("Watcher mounted");

        if (!window.electronAPI) {
            console.log("⚠️ Not running inside Electron");
            return;
        }

        window.electronAPI.onUploadStatus((data) => {
            console.log("UPLOAD EVENT:", data);
            setLogs(prev => [data, ...prev]);
        });
    }, []);

    return (
        <div>
            <h3>CSV Upload Status</h3>

            {logs.map((log, i) => (
                <div key={i}>
                    <b>{log.file}</b> -
                    {log.status === "uploading" && " ⏳ Uploading"}
                    {log.status === "success" && " ✅ Uploaded"}
                    {log.status === "error" && " ❌ Failed"}
                </div>
            ))}
        </div>
    );
}

export default UploadStatusPanel;