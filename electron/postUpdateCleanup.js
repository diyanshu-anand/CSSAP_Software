const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { app } = require("electron");
const db = require("./db"); // Change path if required

// ----------------------------------------------------
// CONFIG
// ----------------------------------------------------

const POST_UPDATE_URL = "https://lightblue-wolverine-671984.hostingersite.com/updates/postUpdate.json";

// Local state file
const stateFile = path.join(
    app.getPath("userData"),
    "cleanupState.json"
);

// ----------------------------------------------------
// STATE FUNCTIONS
// ----------------------------------------------------

function getCleanupState() {

    if (!fs.existsSync(stateFile)) {

        const defaultState = {
            lastCleanupId: "",
            lastCleanupAt: "",
            appVersion: ""
        };

        fs.writeFileSync(
            stateFile,
            JSON.stringify(defaultState, null, 2)
        );

        return defaultState;
    }

    return JSON.parse(
        fs.readFileSync(stateFile, "utf8")
    );
}

function saveCleanupState(cleanupId) {

    const state = {
        lastCleanupId: cleanupId,
        lastCleanupAt: new Date().toISOString(),
        appVersion: app.getVersion()
    };

    fs.writeFileSync(
        stateFile,
        JSON.stringify(state, null, 2)
    );
}

// ----------------------------------------------------
// DATABASE CLEANUP
// ----------------------------------------------------

async function cleanDatabase() {

    console.log("🧹 Starting Post Update Cleanup...");

    const queries = [

        "DELETE FROM fees",
        "DELETE FROM students",
        "DELETE FROM expenses",
        "DELETE FROM marks"

        // Future tables...
    ];

    return new Promise((resolve, reject) => {

        db.serialize(() => {

            // Start transaction
            db.run("BEGIN TRANSACTION", err => {

                if (err) {
                    console.error("Failed to begin transaction:", err.message);
                    return reject(err);
                }

                let current = 0;

                function executeNext() {

                    if (current >= queries.length) {

                        // Commit transaction
                        return db.run("COMMIT", err => {

                            if (err) {

                                console.error("Commit failed:", err.message);

                                return db.run("ROLLBACK", () => {
                                    reject(err);
                                });

                            }

                            // Reclaim free space
                            db.run("VACUUM", vacuumErr => {

                                if (vacuumErr) {
                                    return reject(vacuumErr);
                                }

                                console.log("✅ Database cleanup completed.");

                                resolve();

                            });

                        });

                    }

                    const sql = queries[current];

                    db.run(sql, err => {

                        if (err) {

                            console.error(`❌ ${sql}`, err.message);

                            return db.run("ROLLBACK", () => {
                                reject(err);
                            });

                        }

                        console.log(`✔ ${sql}`);

                        current++;

                        executeNext();

                    });

                }

                executeNext();

            });

        });

    });

}

// ----------------------------------------------------
// MAIN FUNCTION
// ----------------------------------------------------

async function runPostUpdateCleanup() {

    try {

        console.log("Checking post update cleanup...");

        const { data } = await axios.get(POST_UPDATE_URL);

        if (!data || typeof data !== "object") {
            console.log("Invalid postUpdate.json");
            return;
        }

        if (!data.cleanup) {
            console.log("No cleanup required.");
            return;
        }

        if (!data.cleanupId || typeof data.cleanupId !== "string") {
            console.log("Invalid cleanupId.");
            return;
        }


        const localState = getCleanupState();

        if (
            localState.lastCleanupId === data.cleanupId
        ) {

            console.log("Cleanup already executed.");

            return;
        }

        console.log("Cleanup Required.");

        await cleanDatabase();

        saveCleanupState(data.cleanupId);

        console.log("Cleanup completed successfully.");

    }
    catch (err) {

        console.error(
            "Post Update Cleanup Error:",
            err.message
        );

    }

}

module.exports = {
    runPostUpdateCleanup
};