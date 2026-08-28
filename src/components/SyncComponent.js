import { useEffect, useState } from "react";

function SyncStatusPanel() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        console.log("Sync mounted");

        if (!window.electronAPI) {
            console.log("⚠️ Not running inside Electron");
            return;
        }

        window.electronAPI.onSyncStatus((data) => {
            console.log("SYNC EVENT:", data);
            setLogs(prev => [data, ...prev]);
        });
    }, []);

    return (
        <div>
            <h3>Sync Status</h3>

            {logs.map((log, i) => (
                <div key={i}>
                    {log.type === "start" && `🚀 ${log.message}`}
                    {log.type === "uploading" && `⏳ ${log.message}`}
                    {log.type === "success" && `✅ ${log.message}`}
                    {log.type === "error" && `❌ ${log.message}`}
                    {log.type === "done" && `🏁 ${log.message}`}
                    {log.type === "info" && `ℹ️ ${log.message}`}
                </div>
            ))}
        </div>
    );
}

export default SyncStatusPanel;