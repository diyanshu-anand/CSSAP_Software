import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    AppBar,
    Toolbar,
    Typography,
    Button
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

function Layout({ children }) {
    const navigate = useNavigate();

    //  Get user + role
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    // Role-based menu config
    const menuItems = [
        { label: "Dashboard", path: "/dashboard", roles: ["principal", "accountant"] },

        { label: "Students", path: "/students", roles: ["principal", "teacher", "accountant"] },

        { label: "Expenses", path: "/expenses", roles: ["principal", "accountant"] },

        // { label: "Fees", path: "/fees", roles: ["principal", "accountant"] },

        { label: "Fees History", path: "/fee-history", roles: ["principal", "accountant"] },

        {label: "Fees - New Section", path:"/feesnewentry", roles:["principal", "accountant"]},
        
        { label: "Fees Structure", path: "/fee-structure", roles: ["principal", "accountant"] },

        { label: "Numerical Marks Entry", path: "/marks-entry", roles: ["principal", "teacher"] },

        { label: "Grade Based Marks Entry", path: "/marks-entry-lkg", roles: ["principal", "teacher"] },

        // { label: "Report Card ", path: "/report-card", roles: ["principal", "teacher"] },

        { label: "View Nursery Report Card", path: "/view-report-card-test", roles: ["principal", "teacher"] },

        { label: "View From LKG to 8 Report Card", path: "/view-high-report-card-test", roles: ["principal", "teacher"] },

        { label: "Teacher's Attendance Upload", path: "/teacher-attendance-upload", roles: ["principal"] },

        { label: "Teacher's Attendance View", path: "/teacher-attendance", roles: ["principal"] },

        { label: "Monthly Salary Calculator", path: "/teacher-salary-summary", roles: ["principal"] },

        { label: "Teacher's View", path: "/teachers", roles: ["principal"]},

        { label: "Student Attendance Update", path: "/student-monthly-attendance", roles: ["principal", "teacher"] },

        { label: "Student Attendance Analytics", path: "/attendance-analytics", roles: ["principal", "teacher"] },

        { label: "Finance Dashboard", path: "/finance-dashboard", roles: ["principal", "accountant"] },

        { label: "Fee Ledger View", path:"/principal-ledger", roles: ["principal"]},

        { label: "Holiday Scheduler", path: "/holidays", roles: ["principal", "accountant"] },

        { label:"Transfer Certificate", path:"/finance-principal-tc", roles: ["principal", "accountant"] },

        { label:"Issued TCs", path:"/issued-transfer-certificates", roles:["principal", "accountant"]}
    ];

    return (
        <div style={{ display: "flex" }}>

            {/* TOP BAR */}
            <AppBar
                position="fixed"
                sx={{
                    zIndex: 1201,
                    background: "linear-gradient(90deg, #1E3A8A, #2563eb)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                }}
            >
                <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>

                    {/* LEFT - TITLE + School Logo */}
                    <img
                        src={require("../assets/ABM_Logo.jpg")}
                        alt="school"
                        style={{ width: "35px", borderRadius: "50%" }}
                    />
                    <Typography variant="h6" style={{ fontWeight: "bold" }}>
                        School ERP System
                    </Typography>

                    {/* RIGHT - LOGOS */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>


                        <Typography variant="body2" style={{ color: "#fff", marginLeft: "10px" }}>
                            {role ? role.toUpperCase() : "USER"}
                        </Typography>


                    </div>

                </Toolbar>
            </AppBar>

            {/* SIDEBAR */}

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        background: "#0f172a",
                        color: "#fff"
                    }
                }}
            >
                <Toolbar />

                {/* BACK BUTTON */}
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => navigate(-1)}
                    sx={{
                        mb: 2,
                        margin: "10px",
                        background: "#1E3A8A",
                        fontWeight: "bold"
                    }}
                >
                    ⬅ Back
                </Button>

                <List>

                    {menuItems
                        .filter(item => item.roles.includes(role))
                        .map((item, index) => (
                            <ListItem
                                button
                                key={index}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    margin: "4px 8px",
                                    borderRadius: "8px",
                                    "&:hover": {
                                        background: "#1E3A8A"
                                    }
                                }}
                            >
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}

                    {/* LOGOUT */}
                    <ListItem
                        button
                        onClick={() => {
                            localStorage.removeItem("user");
                            navigate("/");
                        }}
                        sx={{
                            margin: "10px 8px",
                            borderRadius: "8px",
                            background: "#dc2626",
                            "&:hover": {
                                background: "#b91c1c"
                            }
                        }}
                    >
                        <ListItemText primary="Logout" />
                    </ListItem>

                </List>

            </Drawer>

            {/* MAIN CONTENT */}
            <main
                style={{
                    flexGrow: 1,
                    padding: "100px 40px",
                    background: "linear-gradient(to bottom, #f8fafc, #eef2ff)",
                    minHeight: "100vh"
                }}
            >
                {children}
            </main>

        </div>
    );
}

export default Layout;