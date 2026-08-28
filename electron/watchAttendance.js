const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const watchFolder = "C:/SecureEye/Export";
const processedFolder = "C:/SecureEye/Export/processed";

//  Ensure processed folder exists
if (!fs.existsSync(processedFolder)) {
  fs.mkdirSync(processedFolder, { recursive: true });
}

// Track files currently being processed
let processingFiles = new Set();

function startWatcher(mainWindow) {

  console.log("👀 Watching folder:", watchFolder);

  fs.watch(watchFolder, (eventType, filename) => {

    if (!filename) return;

    const filePath = path.join(watchFolder, filename);

    //  Allow CSV + XLS + XLSX
    const ext = path.extname(filename).toLowerCase();

    if (
      ext !== ".csv" &&
      ext !== ".xls" &&
      ext !== ".xlsx"
    ) {
      return;
    }
    //  Ignore already processed files
    if (filename.startsWith("processed_")) return;

    //  Ignore files already in processing
    if (processingFiles.has(filename)) return;

    // Ensure file actually exists (important)
    if (!fs.existsSync(filePath)) return;

    // Lock file
    processingFiles.add(filename);

    setTimeout(async () => {

      try {
        console.log("📂 Detected:", filename);

        sendToUI(mainWindow, "uploading", filename);

        //  Read file safely after delay
        const formData = new FormData();
        formData.append("csv_file", fs.createReadStream(filePath));

        const res = await axios.post(
          "https://lightblue-wolverine-671984.hostingersite.com/api/uploadTeachersAttendance.php",
          formData,
          {
            headers: formData.getHeaders()
          }
        );

        console.log("✅ Uploaded:", filename);

        sendToUI(mainWindow, "success", filename, res.data);

        // ✅ Move file to processed folder
        const newPath = path.join(processedFolder, filename);

        fs.renameSync(filePath, newPath);

      } catch (err) {

        console.error("❌ Upload failed:", filename, err.message);

        sendToUI(mainWindow, "error", filename, err.message);

      } finally {
        //  Always unlock file
        processingFiles.delete(filename);
      }

    }, 3000); // delay to ensure file is fully written

  });
}

//  SEND STATUS TO FRONTEND
function sendToUI(win, status, file, data = null) {
  if (win && !win.isDestroyed()) {
    win.webContents.send("upload-status", {
      status,
      file,
      data
    });
  }
}

module.exports = startWatcher;