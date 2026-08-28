import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import Layout from "../components/Layout";
import API_BASE from "../config";

import {
    Card,
    CardContent,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    TableContainer,
    TextField,
    Grid,
    MenuItem
} from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

function PrincipalFeesLedger() {

    const [ledgerData, setLedgerData] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedClass, setSelectedClass] = useState("All");

    const analyticsRef = useRef(null);

    const months = [
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        "January",
        "February",
        "March"
    ];

    const COLORS = [
        "#2563EB",
        "#16A34A"
    ];





    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {

        try {

            const res = await axios.get(
                `${API_BASE}/getFees.php`
            );

            const data = res.data.data || [];

            generateLedger(data);

        } catch (err) {
            console.error(err);
        }
    };

    /* ---------------- GENERATE LEDGER ---------------- */

    const generateLedger = (data) => {

        const grouped = {};

        /*
         * ---------------------------------------------------------
         * DUPLICATE TRANSACTION TRACKER
         * ---------------------------------------------------------
         *
         * Key:
         * student + month + payment date + amount
         *
         * If multiple different transaction UUIDs have the same
         * combination, we treat them as duplicate candidates.
         *
         * Database records are NOT deleted.
         * They are only hidden from the ledger.
         */

        const duplicateTracker = {};

        data.forEach((fee) => {

            const key = fee.student_uuid;

            if (!grouped[key]) {

                grouped[key] = {
                    student_uuid: fee.student_uuid,
                    name: fee.name,
                    class: fee.class,
                    section: fee.section,

                    oneTimePayments: [],
                    months: {}
                };
            }

            /* ---------------- FEE BREAKDOWN ---------------- */

            let breakdown = {};
            let selectedMonths = [];

            try {

                breakdown =
                    typeof fee.fee_breakdown === "string"
                        ? JSON.parse(fee.fee_breakdown)
                        : (fee.fee_breakdown || {});

            } catch {

                breakdown = {};

            }

            try {

                let temp =
                    typeof fee.selected_months === "string"
                        ? JSON.parse(fee.selected_months)
                        : (fee.selected_months || []);

                selectedMonths =
                    typeof temp === "string"
                        ? JSON.parse(temp)
                        : temp;

            } catch {

                selectedMonths = [];

            }

            const monthsData = breakdown.months || {};
            const oneTime = breakdown.one_time || {};
            const discounts = breakdown.discounts || {};


            /* ---------------- MONTH RECORD ---------------- */

            selectedMonths.forEach((month) => {

                /*
                 * IMPORTANT
                 * Initialize month array before pushing.
                 */

                if (!grouped[key].months[month]) {

                    grouped[key].months[month] = [];

                }

                const monthData = monthsData[month] || {};


                /*
                 * ---------------------------------------------------------
                 * DUPLICATE PAYMENT DETECTION
                 * ---------------------------------------------------------
                 *
                 * Same:
                 *
                 * student_uuid
                 * month
                 * payment_date
                 * amount
                 *
                 * means this is a duplicate candidate.
                 *
                 * Transaction UUID is NOT part of the duplicate key because
                 * we specifically WANT to detect different transaction IDs
                 * representing the same payment.
                 */

                const amount = Number(fee.amount || 0);

                const duplicateKey =
                    `${fee.student_uuid}__${month}__${fee.payment_date}__${amount}`;


                /*
                 * FIRST TRANSACTION
                 */

                if (!duplicateTracker[duplicateKey]) {

                    duplicateTracker[duplicateKey] = {

                        student: fee.name,

                        student_uuid: fee.student_uuid,

                        month: month,

                        payment_date: fee.payment_date,

                        amount: amount,

                        transaction_uuids: [
                            fee.transaction_uuid
                        ],

                        kept_transaction_uuid:
                            fee.transaction_uuid

                    };

                }

                /*
                 * SAME PAYMENT FOUND AGAIN
                 */

                else {

                    const tracker =
                        duplicateTracker[duplicateKey];


                    /*
                     * Make sure we don't treat the exact same
                     * transaction UUID as a duplicate of itself.
                     */

                    if (
                        !tracker.transaction_uuids.includes(
                            fee.transaction_uuid
                        )
                    ) {

                        tracker.transaction_uuids.push(
                            fee.transaction_uuid
                        );


                        console.warn(
                            "[LEDGER DUPLICATE DETECTED]",
                            {
                                student: fee.name,

                                student_uuid:
                                    fee.student_uuid,

                                month: month,

                                payment_date:
                                    fee.payment_date,

                                amount: amount,

                                kept_transaction_uuid:
                                    tracker.kept_transaction_uuid,

                                duplicate_transaction_uuid:
                                    fee.transaction_uuid,

                                all_matching_transaction_uuids:
                                    tracker.transaction_uuids
                            }
                        );


                        /*
                         * DO NOT DISPLAY THIS RECORD
                         */

                        return;

                    }

                }


                /*
                 * ---------------------------------------------------------
                 * ADD VALID / FIRST PAYMENT TO LEDGER
                 * ---------------------------------------------------------
                 */

                grouped[key].months[month].push({

                    amount: amount,

                    late_fee:
                        Number(
                            discounts.late_fee ||
                            fee.late_fee ||
                            0
                        ),

                    payment_date:
                        fee.payment_date,

                    monthly_fee:
                        Number(monthData.tuition || 0),

                    month_total:
                        Number(monthData.total || 0),

                    activity_fee:
                        Number(monthData.activity || 0),

                    annual_fee:
                        Number(oneTime.annual || 0),

                    exam_fee:
                        Number(oneTime.exam || 0),

                    admission_fee:
                        Number(oneTime.admission || 0),

                    commodities_fee:
                        Number(oneTime.commodities || 0),

                    transport_fee:
                        Number(oneTime.transport || 0),

                    other_fee:
                        Number(oneTime.other || 0),

                    transaction_uuid:
                        fee.transaction_uuid,

                    selected_months:
                        selectedMonths,

                    transaction_total:
                        Number(
                            fee.transaction_total || 0
                        ),

                    special_discount:
                        Number(
                            discounts.special ||
                            fee.special_discount ||
                            0
                        ),

                    sibling_discount:
                        Number(
                            discounts.sibling ||
                            fee.sibling_discount_amount ||
                            0
                        ),

                    balance:
                        Number(
                            fee.balance ||
                            breakdown.totals?.balance ||
                            0
                        ),

                    collected:
                        Number(
                            breakdown.totals?.collected ||
                            fee.amount ||
                            0
                        )

                });

            });


            /* ---------------- ONE TIME PAYMENTS ---------------- */

            const oneTimeItems = [];

            const addOneTime = (type, amount) => {

                amount = Number(amount || 0);

                if (amount <= 0) return;

                oneTimeItems.push({

                    type,

                    amount,

                    date: fee.payment_date

                });

            };

            addOneTime(
                "Admission Fee",
                oneTime.admission
            );

            addOneTime(
                "Annual Fee",
                oneTime.annual
            );

            addOneTime(
                "Exam Fee",
                oneTime.exam
            );

            addOneTime(
                "Commodities",
                oneTime.commodities
            );

            addOneTime(
                "Transport",
                oneTime.transport
            );

            addOneTime(
                "Other",
                oneTime.other
            );


            oneTimeItems.forEach(item => {

                const exists =
                    grouped[key].oneTimePayments.some(
                        existing =>
                            existing.type === item.type &&
                            existing.amount === item.amount &&
                            existing.date === item.date
                    );


                if (!exists) {

                    grouped[key].oneTimePayments.push(
                        item
                    );

                }

            });

        });


        /* =========================================================
         * FINAL DUPLICATE REPORT
         * ========================================================= */

        const duplicateGroups =
            Object.values(duplicateTracker)
                .filter(
                    group =>
                        group.transaction_uuids.length > 1
                );


        if (duplicateGroups.length > 0) {

            console.group(
                `%c[LEDGER CLEANUP] ${duplicateGroups.length} duplicate payment groups detected`,
                "color: #DC2626; font-weight: bold;"
            );


            duplicateGroups.forEach(group => {

                console.warn({

                    student:
                        group.student,

                    student_uuid:
                        group.student_uuid,

                    month:
                        group.month,

                    payment_date:
                        group.payment_date,

                    amount:
                        group.amount,

                    transaction_uuids:
                        group.transaction_uuids,

                    displayed_transaction:
                        group.kept_transaction_uuid,

                    hidden_transactions:
                        group.transaction_uuids.filter(
                            id =>
                                id !==
                                group.kept_transaction_uuid
                        )

                });

            });


            console.groupEnd();

        } else {

            console.log(
                "%c[LEDGER CLEANUP] No duplicate payment records detected.",
                "color: #16A34A; font-weight: bold;"
            );

        }


        /* ---------------- FINAL LEDGER ---------------- */

        setLedgerData(
            Object.values(grouped)
        );
    };



    /* ---------------- FILTER ---------------- */

    const filteredData = useMemo(() => {

        return ledgerData.filter(student => {

            const matchesSearch =
                student.name?.toLowerCase().includes(search.toLowerCase()) ||
                String(student.class || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                String(student.section || "")
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesClass =
                selectedClass === "All" ||
                String(student.class) === selectedClass;

            return matchesSearch && matchesClass;

        });

    }, [ledgerData, search, selectedClass]);

    /* ---------------- ANALYTICS ---------------- */

    const totalCollected = filteredData.reduce((sum, student) => {

        return sum + months.reduce((monthSum, month) => {

            const monthFees = student.months[month] || [];

            return monthSum +
                monthFees.reduce(
                    (sum, fee) => sum + Number(fee.amount || 0),
                    0
                );

        }, 0);

    }, 0);

    const totalLateFees = filteredData.reduce((sum, student) => {

        return sum + months.reduce((monthSum, month) => {

            const monthFees = student.months[month] || [];

            return monthSum +
                monthFees.reduce(
                    (sum, fee) => sum + Number(fee.late_fee || 0),
                    0
                );

        }, 0);

    }, 0);

    const paidMonths = filteredData.reduce((sum, student) => {

        return sum + months.filter(month => student.months[month]).length;

    }, 0);

    const pendingMonths =
        (filteredData.length * months.length) - paidMonths;

    /* ---------------- CHART DATA ---------------- */

    const monthlyRevenueData = months.map(month => {

        let total = 0;

        filteredData.forEach(student => {

            const monthFees = student.months[month] || [];

            total += monthFees.reduce(
                (sum, fee) => sum + Number(fee.amount || 0),
                0
            );
        });

        return {
            month,
            revenue: total
        };
    });

    const feeStatusData = [
        {
            name: "Paid",
            value: paidMonths
        },
        {
            name: "Pending",
            value: pendingMonths
        }
    ];

    const classOptions = [
        "All",
        ...new Set(
            ledgerData.map(item => item.class)
        )
    ];

    /* ---------------- EXPORT EXCEL ---------------- */

    const exportExcel = () => {

        const exportData = filteredData.map((student, index) => {

            const row = {
                "S.No": index + 1,
                "Student Name": student.name,
                "Class": student.class,
                "Section": student.section,
                "Computer": student.computer,
                "Abacus": student.abacus,
                "Taekwondo": student.taekwondo
            };

            months.forEach(month => {

                const fee = student.months[month];

                row[month] = fee
                    ? `
                    Paid Amount: ₹${fee.amount}
                    Monthly Fee: ₹${fee.monthly_fee}
                    Annual Fee: ₹${fee.annual_fee}
                    Exam Fee: ₹${fee.exam_fee}
                    Admission Fee: ₹${fee.admission_fee}
                    Computer Fee: ₹${fee.computer_fee}
                    Abacus Fee: ₹${fee.abacus_fee}
                    Taekwondo Fee: ₹${fee.taekwondo_fee}
                    Late Fee: ₹${fee.late_fee}
                    Payment Date: ${fee.payment_date}
                    `
                    : "Pending";
            });

            return row;
        });



        const worksheet = XLSX.utils.json_to_sheet(exportData);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Principal Ledger"
        );

        const excelBuffer = XLSX.write(
            workbook,
            {
                bookType: "xlsx",
                type: "array"
            }
        );

        const blob = new Blob(
            [excelBuffer],
            {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        );

        saveAs(
            blob,
            "Principal_Fees_Ledger.xlsx"
        );
    };

    /* ---------------- UI ---------------- */

    return (

        <Layout>

            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    color: "#1E3A8A"
                }}
            >
                Principal Fees Analytics Dashboard
            </Typography>

            {/* ---------------- ANALYTICS CARDS ---------------- */}

            <Grid container spacing={3} mb={4}>

                <Grid item xs={12} md={3}>
                    <Card sx={{
                        borderRadius: "16px",
                        background: "#DBEAFE"
                    }}>
                        <CardContent>
                            <Typography color="#1E40AF">
                                Total Collected
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                            >
                                ₹{totalCollected.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{
                        borderRadius: "16px",
                        background: "#FEF2F2"
                    }}>
                        <CardContent>
                            <Typography color="#B91C1C">
                                Total Late Fees
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                            >
                                ₹{totalLateFees.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{
                        borderRadius: "16px",
                        background: "#F0FDF4"
                    }}>
                        <CardContent>
                            <Typography color="#166534">
                                Paid Months
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                            >
                                {paidMonths}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card sx={{
                        borderRadius: "16px",
                        background: "#FFF7ED"
                    }}>
                        <CardContent>
                            <Typography color="#C2410C">
                                Pending Months
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                            >
                                {pendingMonths}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>


            {/* ---------------- EXPORT AND GRAPHS BUTTON ---------------- */}

            <Button
                variant="contained"
                onClick={exportExcel}
                sx={{
                    mb: 3,
                    background: "#166534",
                    borderRadius: "10px",
                    px: 3,
                    py: 1,
                    fontWeight: "bold"
                }}
            >
                Export Excel
            </Button>

            <Button
                variant="contained"
                onClick={() => {
                    analyticsRef.current?.scrollIntoView({
                        behavior: "smooth"
                    });
                }}
                sx={{
                    mb: 3,
                    marginLeft: 3,
                    background: "#7C3AED",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    px: 3,
                    py: 1,
                    position: "sticky",
                    top: 10,
                    zIndex: 20
                }}
            >
                Go To Graphs
            </Button>



            {/* ---------------- FILTERS ---------------- */}

            <Grid container spacing={2} mb={3}>

                <Grid item xs={12} md={8}>
                    <TextField
                        fullWidth
                        label="Search Student / Class / Section"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            background: "#fff",
                            borderRadius: "10px"
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        fullWidth
                        label="Filter By Class"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        sx={{
                            background: "#fff",
                            borderRadius: "10px"
                        }}
                    >
                        {classOptions.map(cls => (
                            <MenuItem key={cls} value={cls}>
                                {cls}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

            </Grid>




            {/* ---------------- TABLE ---------------- */}

            <Card
                sx={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
                }}
            >

                <CardContent>

                    <TableContainer
                        sx={{
                            overflowX: "auto",
                            maxHeight: "75vh"
                        }}
                    >

                        <Table
                            stickyHeader
                            sx={{
                                minWidth: 1400,
                                borderCollapse: "separate",
                                borderSpacing: 0,

                                "& td": {
                                    padding: "8px",
                                    border: "1px solid #E5E7EB"
                                },

                                "& th": {
                                    padding: "10px",
                                    background: "#1E3A8A",
                                    color: "#fff",
                                    fontWeight: "bold"
                                }
                            }}
                        >

                            {/* HEADER (IMPORTANT FOR LOOK) */}
                            <TableHead>
                                <TableRow>
                                    {[
                                        "S.No",
                                        "Name",
                                        "Class",
                                        "Section",
                                        "One Time Payments",
                                        ...months
                                    ].map((head) => (
                                        <TableCell key={head}>
                                            {head}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>

                                {filteredData.map((student, index) => (

                                    <TableRow
                                        key={student.student_uuid}
                                        hover
                                        sx={{
                                            "&:nth-of-type(odd)": {
                                                backgroundColor: "#f8fafc"
                                            }
                                        }}
                                    >

                                        <TableCell>{index + 1}</TableCell>

                                        <TableCell sx={{
                                            position: "sticky",
                                            left: 0,
                                            background: "#fff",
                                            zIndex: 5,
                                            minWidth: 180,
                                            fontWeight: "bold"
                                        }}>
                                            {student.name}
                                        </TableCell>

                                        <TableCell>{student.class}</TableCell>
                                        <TableCell>{student.section}</TableCell>
                                        <TableCell
                                            sx={{
                                                minWidth: 250,
                                                fontSize: "11px"
                                            }}
                                        >
                                            {student.oneTimePayments?.length > 0 ? (

                                                student.oneTimePayments.map(
                                                    (item, idx) => (

                                                        <div
                                                            key={idx}
                                                            style={{
                                                                marginBottom: "8px",
                                                                paddingBottom: "8px",
                                                                borderBottom:
                                                                    "1px dashed #CBD5E1"
                                                            }}
                                                        >
                                                            <strong>{item.type}</strong>

                                                            <br />

                                                            ₹{item.amount}

                                                            <br />

                                                            {item.date}
                                                        </div>

                                                    )
                                                )

                                            ) : (

                                                "—"

                                            )}
                                        </TableCell>

                                        {months.map(month => {

                                            const monthFees = student.months[month] || [];

                                            return (

                                                <TableCell
                                                    key={month}
                                                    sx={{
                                                        minWidth: 180,
                                                        fontSize: "12px",
                                                        background:
                                                            monthFees.length > 0
                                                                ? "#F0FDF4"
                                                                : "#F9FAFB",
                                                        border: "1px solid #E5E7EB",
                                                        verticalAlign: "top"
                                                    }}
                                                >

                                                    {monthFees.length > 0 ? (

                                                        monthFees.map((fee, idx) => {

                                                            const firstMonth = fee.selected_months?.[0];
                                                            const isFirstMonth = firstMonth === month;

                                                            // const discount =
                                                            //     Number(fee.special_discount || 0) +
                                                            //     Number(fee.sibling_discount || 0);


                                                            const activityFee =
                                                                Number(fee.activity_fee || 0);

                                                            const monthTotal =
                                                                Number(fee.month_total || 0);
                                                            return (

                                                                <div
                                                                    key={idx}
                                                                    style={{
                                                                        marginBottom: "10px",
                                                                        paddingBottom: "10px",
                                                                        borderBottom:
                                                                            idx !== monthFees.length - 1
                                                                                ? "1px dashed #CBD5E1"
                                                                                : "none"
                                                                    }}
                                                                >

                                                                    <Typography
                                                                        sx={{
                                                                            fontWeight: "bold",
                                                                            color: "#111827",
                                                                            fontSize: "12px"
                                                                        }}
                                                                    >
                                                                        ₹{monthTotal}
                                                                    </Typography>

                                                                    {fee.monthly_fee > 0 && (
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "10px",
                                                                                color: "#374151"
                                                                            }}
                                                                        >
                                                                            Monthly : ₹{fee.monthly_fee}
                                                                        </Typography>
                                                                    )}

                                                                    {fee.activity_fee > 0 && (
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "10px",
                                                                                color: "#2563EB",
                                                                                fontWeight: "bold"
                                                                            }}
                                                                        >
                                                                            Activity : ₹{fee.activity_fee}
                                                                        </Typography>
                                                                    )}

                                                                    {isFirstMonth && fee.annual_fee > 0 && (
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "10px",
                                                                                color: "#374151"
                                                                            }}
                                                                        >
                                                                            Annual : ₹{fee.annual_fee}
                                                                        </Typography>
                                                                    )}

                                                                    {isFirstMonth && fee.exam_fee > 0 && (
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "10px",
                                                                                color: "#374151"
                                                                            }}
                                                                        >
                                                                            Exam : ₹{fee.exam_fee}
                                                                        </Typography>
                                                                    )}

                                                                    {isFirstMonth && fee.admission_fee > 0 && (
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "10px",
                                                                                color: "#374151"
                                                                            }}
                                                                        >
                                                                            Admission : ₹{fee.admission_fee}
                                                                        </Typography>
                                                                    )}


                                                                    {(Number(fee.special_discount) + Number(fee.sibling_discount)) > 0 && (
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: "10px",
                                                                                color: "#16A34A",
                                                                                fontWeight: "bold"
                                                                            }}
                                                                        >
                                                                            Discount : -₹{
                                                                                Number(fee.special_discount || 0) +
                                                                                Number(fee.sibling_discount || 0)
                                                                            }
                                                                        </Typography>
                                                                    )}

                                                                    {Number(fee.late_fee) > 0 && (
                                                                        <Typography
                                                                            sx={{
                                                                                mt: 0.5,
                                                                                display: "inline-block",
                                                                                background: "#DC2626",
                                                                                color: "#fff",
                                                                                px: 1,
                                                                                py: 0.3,
                                                                                borderRadius: "10px",
                                                                                fontSize: "10px",
                                                                                fontWeight: "bold"
                                                                            }}
                                                                        >
                                                                            +₹{fee.late_fee}
                                                                        </Typography>
                                                                    )}

                                                                    <Typography
                                                                        sx={{
                                                                            fontSize: "10px",
                                                                            color: "#6B7280",
                                                                            mt: 0.5
                                                                        }}
                                                                    >
                                                                        {fee.payment_date}
                                                                    </Typography>

                                                                </div>

                                                            );

                                                        })

                                                    ) : (

                                                        <Typography
                                                            sx={{
                                                                color: "#9CA3AF",
                                                                fontWeight: "bold",
                                                                fontSize: "11px"
                                                            }}
                                                        >
                                                            Pending
                                                        </Typography>

                                                    )}

                                                </TableCell>

                                            );

                                        })}

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>
                    </TableContainer>
                </CardContent>

            </Card>

            {/* ---------------- CHARTS ---------------- */}

            {/* ---------------- CHARTS ---------------- */}

            <Grid
                container
                spacing={4}
                mt={5}
                ref={analyticsRef}
                alignItems="stretch"
            >

                {/* ---------------- BAR GRAPH ---------------- */}

                <Grid item xs={12} lg={8}>

                    <Card
                        sx={{
                            borderRadius: "24px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                            height: "100%"
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="h4"
                                gutterBottom
                                fontWeight="bold"
                                sx={{
                                    color: "#1E3A8A",
                                    mb: 3
                                }}
                            >
                                Monthly Revenue Analytics
                            </Typography>

                            <ResponsiveContainer width="100%" height={420}>

                                <BarChart
                                    data={monthlyRevenueData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 10,
                                        bottom: 20
                                    }}
                                >

                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 13 }}
                                    />

                                    <YAxis
                                        tick={{ fontSize: 13 }}
                                    />

                                    <Tooltip />

                                    <Bar
                                        dataKey="revenue"
                                        fill="#2563EB"
                                        radius={[10, 10, 0, 0]}
                                        barSize={42}
                                    />

                                </BarChart>

                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                </Grid>

                {/* ---------------- PIE GRAPH ---------------- */}

                <Grid item xs={12} lg={4}>

                    <Card
                        sx={{
                            borderRadius: "24px",
                            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                            height: "100%",
                            width: "200%"
                        }}
                    >

                        <CardContent>

                            <Typography
                                variant="h4"
                                gutterBottom
                                fontWeight="bold"
                                sx={{
                                    color: "#1E3A8A",
                                    mb: 3,
                                    textAlign: "center"
                                }}
                            >
                                Fees Status
                            </Typography>

                            <ResponsiveContainer width="100%" height={420}>

                                <PieChart>

                                    <Pie
                                        data={feeStatusData}
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={135}
                                        innerRadius={70}
                                        paddingAngle={4}
                                        label
                                    >

                                        {feeStatusData.map((entry, index) => (

                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />

                                        ))}

                                    </Pie>

                                    <Tooltip />

                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Layout>
    );
}

export default PrincipalFeesLedger;