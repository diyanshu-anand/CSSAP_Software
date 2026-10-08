import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Stack,
    TextField,
    Button,
    Divider,
    MenuItem,
    Autocomplete,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    FormControlLabel,
    FormGroup
} from "@mui/material";

import API_BASE from "../config";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Checkbox from "@mui/material/Checkbox";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";



const academicMonths = [
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
    "March",
];

const paymentMethods = [
    "cash",
    "upi",
    "card",
    "bank",
    "cheque",
];

const createEmptyLedger = () => ({
    April: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    May: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    June: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    July: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    August: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    September: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    October: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    November: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    December: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    January: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    February: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
    March: { tuition: "", activity: "", tutionPaid: false, activityPaid: false, paid: false, receipt: null, fee: null },
});

export default function FeeLedger() {
    const API = API_BASE;

    const [loading, setLoading] = useState(false);

    const [students, setStudents] = useState([]);
    const [feeStructures, setFeeStructures] = useState([]);
    const [fees, setFees] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState(null);

    const [ledger, setLedger] = useState(createEmptyLedger());

    const [editOpen, setEditOpen] = useState(false);

    const [editingFee, setEditingFee] = useState(null);

    const [editForm, setEditForm] = useState(null);

    const [editLedger, setEditLedger] = useState({});

    const [editReceipt, setEditReceipt] = useState(null);

    const [editedReceipt, setEditedReceipt] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [ignoreFeeStructure, setIgnoreFeeStructure] = useState(false);

    const [summaryFees, setSummaryFees] = useState([]);

    const navigate = useNavigate();

    const [defaultOneTimeFees, setDefaultOneTimeFees] = useState({
        admission: 0,
        annual: 0,
        exam: 0,
        commodities: 0,
        transport: 0,
        other: 0,
    });

    const [paymentHistory, setPaymentHistory] = useState({
        monthly: {},
        admission: null,
        annual: null,
        exam: null,
        commodities: null,
        transport: null,
        other: null,
        deposit: 0,
        pending: 0,
    });


    const previousPending = Number(paymentHistory.pending || 0);
    const previousDeposit = Number(paymentHistory.deposit || 0);


    const [ignoredFeeItems, setIgnoredFeeItems] = useState({
        monthly: false,
        activity: false,
        annual: false,
        exam: false,
        admission: false,
        commodities: false,
        transport: false,
        other: false
    });


    const [saving, setSaving] = useState(false);

    const [oneTimeFees, setOneTimeFees] = useState({
        admission: "",
        annual: "",
        exam: "",
        commodities: "",
        transport: "",
        other: "",
    });

    const [paidOneTimeFees, setPaidOneTimeFees] = useState({
        admission: null,
        annual: null,
        exam: null,
        commodities: null,
        transport: null,
        other: null,
    });


    const [discounts, setDiscounts] = useState({
        lateFee: "",
        sibling: "",
        special: "",
    });

    const [authOpen, setAuthOpen] = useState(false);

    const [authData, setAuthData] = useState({
        username: "",
        password: "",
        reason: ""
    });

    const [pendingPayload, setPendingPayload] = useState(null);

    // const [totals, setTotals] = useState({
    //     monthlyTotal: 0,
    //     oneTimeTotal: 0,
    //     gross: 0,
    //     discount: 0,
    //     net: 0,
    //     collected: 0,
    //     balance: 0
    // });

    const monthlyTotal = useMemo(() => {
        return academicMonths.reduce((sum, month) => {
            const tuition =
                ledger[month].tuition === ""
                    ? 0
                    : Number(ledger[month].tuition);

            const activity =
                ledger[month].activity === ""
                    ? 0
                    : Number(ledger[month].activity);

            return sum + tuition + activity;
        }, 0);
    }, [ledger]);

    const oneTimeTotal = useMemo(() => {
        return (
            (oneTimeFees.admission === "" ? 0 : Number(oneTimeFees.admission)) +
            (oneTimeFees.annual === "" ? 0 : Number(oneTimeFees.annual)) +
            (oneTimeFees.exam === "" ? 0 : Number(oneTimeFees.exam)) +
            (oneTimeFees.commodities === "" ? 0 : Number(oneTimeFees.commodities)) +
            (oneTimeFees.transport === "" ? 0 : Number(oneTimeFees.transport)) +
            (oneTimeFees.other === "" ? 0 : Number(oneTimeFees.other))
        );
    }, [oneTimeFees]);

    const totalDiscount = useMemo(() => {
        return (
            Number(discounts.sibling || 0) +
            Number(discounts.special || 0)
        );
    }, [discounts]);

    const grossTotal = useMemo(() => {
        return (
            monthlyTotal +
            oneTimeTotal +
            Number(discounts.lateFee || 0)
        );
    }, [monthlyTotal, oneTimeTotal, discounts]);

    const netTotal = useMemo(() => {
        return grossTotal - totalDiscount;
    }, [grossTotal, totalDiscount]);

    const carriedForward = useMemo(() => {
        return (
            Number(paymentHistory.pending || 0) -
            Number(paymentHistory.deposit || 0)
        );
    }, [paymentHistory.pending, paymentHistory.deposit]);

    const [collectedAmount, setCollectedAmount] = useState("");

    const [editingOneTimeFee, setEditingOneTimeFee] = useState(null);

    const carryForward = useMemo(() => {
        return (
            Number(paymentHistory.pending || 0) -
            Number(paymentHistory.deposit || 0)
        );
    }, [paymentHistory.pending, paymentHistory.deposit]);

    const adjustedNetTotal = useMemo(() => {
        return netTotal + carriedForward;
    }, [netTotal, carriedForward]);

    const balance = useMemo(() => {
        return adjustedNetTotal - Number(collectedAmount || 0);
    }, [adjustedNetTotal, collectedAmount]);

    const [paymentMethod, setPaymentMethod] = useState("cash");

    const [paymentDate, setPaymentDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [ignoreLateFeeState, setIgnoreLateFeeState] = useState(false);

    const [remarks, setRemarks] = useState("");

    const updateLedger = (month, field, value) => {
        setLedger((prev) => ({
            ...prev,
            [month]: {
                ...prev[month],
                [field]: value,
            },
        }));
    };

    const loadStudents = async () => {
        try {
            const res = await axios.get(`${API}/getStudents.php`);

            if (res.data.status) {
                setStudents(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadFeeStructures = async () => {
        try {
            const res = await axios.get(`${API}/getFeeStructure.php`);

            if (res.data.status) {
                setFeeStructures(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const loadFees = async () => {
        try {
            const res = await axios.get(`${API}/getFees.php`);

            if (res.data.status) {
                setFees(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);

            await Promise.all([
                loadStudents(),
                loadFeeStructures(),
                loadFees(),
            ]);

            setLoading(false);
        };

        init();
    }, []);

    const addMonth = (month) => {

        if (editedReceipt.months.includes(month))
            return;

        setEditedReceipt(prev => ({

            ...prev,

            months: [...prev.months, month],

            addedMonths: [
                ...(prev.addedMonths || []),
                month
            ],

            breakdown: {

                ...prev.breakdown,

                [month]: {

                    tuition: 0,

                    activity: 0,

                    total: 0

                }

            }

        }));

    };


    // Newly added to load summary fees .......


    const loadSummaryFees = async (student) => {
        if (!student) {
            setSummaryFees([]);
            return;
        }

        try {
            const res = await axios.get(`${API}/getFees.php`);

            if (!res.data.status) {
                setSummaryFees([]);
                return;
            }

            const allFees = res.data.data || [];

            const studentFees = allFees.filter(
                (fee) =>
                    fee.student_uuid === student.uuid &&
                    fee.fee_status !== "CANCELLED"
            );

            setSummaryFees(studentFees);
        } catch (err) {
            console.error(
                "Unable to load payment summary:",
                err
            );

            setSummaryFees([]);
        }
    };



    const handleStudentSelect = async (student) => {

        setSelectedStudent(student);

        if (student) {
            await loadSummaryFees(student);
        } else {
            setSummaryFees([]);
        }

        setLedger(createEmptyLedger());

        setCollectedAmount("");

        setOneTimeFees({
            admission: "",
            annual: "",
            exam: "",
            commodities: "",
            transport: "",
            other: "",
        });

        setDiscounts({
            lateFee: "",
            sibling: "",
            special: "",
        });

        setPaidOneTimeFees({
            admission: null,
            annual: null,
            exam: null,
            commodities: null,
            transport: null,
            other: null,
        });

        setPaymentHistory({
            monthly: {},
            admission: null,
            annual: null,
            exam: null,
            commodities: null,
            transport: null,
            other: null,
            deposit: 0,
            pending: 0,
        });

        if (!student) return;

        //--------------------------------------------------
        // Find Fee Structure
        //--------------------------------------------------

        const structure = feeStructures.find((item) => {

            const cls1 = String(item.group_name)
                .replace("Class ", "")
                .trim();

            const cls2 = String(student.class)
                .replace("Class ", "")
                .trim();

            return (
                cls1 === cls2 &&
                item.student_type.toLowerCase() ===
                student.student_type.toLowerCase()
            );

        });

        //--------------------------------------------------
        // One Time Fees
        //--------------------------------------------------

        if (structure) {

            setOneTimeFees({
                admission: "",
                annual: "",
                exam: "",
                commodities: "",
                transport: "",
                other: "",
            });

            setDefaultOneTimeFees({
                admission: Number(structure.admission_fee),
                annual: Number(structure.annual_fee),
                exam: Number(structure.exam_fee),
                commodities: 0,
                transport: 0,
                other: 0,
            });

        }

        //--------------------------------------------------
        // Monthly Ledger
        //--------------------------------------------------

        const newLedger = createEmptyLedger();

        academicMonths.forEach((month) => {

            if (structure) {

                let activity = 0;

                if (student.computer == 1)
                    activity += Number(structure.computer_fee);

                if (student.abacus == 1)
                    activity += Number(structure.abacus_fee);

                if (student.taekwondo == 1)
                    activity += Number(structure.taekwondo_fee);

                // Keep defaults separately
                newLedger[month].defaultTuition =
                    Number(structure.monthly_fee);

                newLedger[month].defaultActivity =
                    activity;

                // User input starts blank
                newLedger[month].tuition = "";

                newLedger[month].activity = "";

            }

        });

        //--------------------------------------------------
        // Already Paid Months (supports multi-month receipts)
        //--------------------------------------------------

        // Fee filtration ka ye tareeka dangerous hai as
        // Settlement calculation ke liye ye deduplication dangerous ho sakta hai.
        // Agar same student ne genuinely do baar ₹300 same month/component pay kiya, 
        // to second transaction accounting se remove ho sakti hai.

        // const paidFees = fees.filter(
        //     (fee) => fee.student_uuid === student.uuid
        // );



        const paidFees = fees.filter(
            (fee) =>
                fee.student_uuid === student.uuid &&
                String(fee.fee_status || "ACTIVE").toUpperCase() === "ACTIVE"
        );

        const history = {
            monthly: {},
            admission: null,
            annual: null,
            exam: null,
            commodities: null,
            transport: null,
            other: null,
            deposit: 0,
            pending: 0,
        };

        const latestReceipt =
            paidFees.length > 0
                ? [...paidFees].sort(
                    (a, b) =>
                        new Date(b.payment_date) -
                        new Date(a.payment_date)
                )[0]
                : null;

        // --------------------------------------------------
        // Remove logical duplicate accounting records
        // --------------------------------------------------
        // A payment may exist more than once in `fees` for
        // accounting purposes. We only want to count the
        // same financial breakdown once in Payment History.

        const seenPaymentRecords = new Set();

        const uniquePaidFees = paidFees.filter((fee) => {

            const logicalKey = [
                fee.student_uuid,
                Number(fee.transaction_total || fee.amount || 0),
                fee.selected_months || "",
                fee.fee_breakdown || ""
            ].join("|");

            if (seenPaymentRecords.has(logicalKey)) {
                console.log(
                    "Skipping duplicate accounting fee:",
                    fee.id,
                    fee.receipt_number
                );

                return false;
            }

            seenPaymentRecords.add(logicalKey);

            return true;
        });


        uniquePaidFees.forEach((fee) => {

            let months = [];

            // Need to change the looping-mechnaism to establish the accounting
            // and finacial matchhings in representation
            // paidFees.forEach((fee) => {

            //     let months = [];
            // Breakdown code for fee history
            let breakdown = [];

            try {
                breakdown = JSON.parse(fee.fee_breakdown || "{}");
            } catch { }

            console.log("Raw fee_breakdown:", fee.fee_breakdown);
            console.log("Parsed breakdown:", breakdown);
            console.log("Months:", breakdown.months);

            Object.entries(breakdown.months || {}).forEach(([month, data]) => {
                const tuition = Number(data.tuition || 0);
                const activity = Number(data.activity || 0);
                const total = tuition + activity;

                const existing = history.monthly[month];

                history.monthly[month] = {
                    tuition:
                        Number(existing?.tuition || 0) + tuition,

                    activity:
                        Number(existing?.activity || 0) + activity,

                    amount:
                        Number(existing?.amount || 0) + total,

                    receipt: fee.receipt_number,
                    date: fee.payment_date,

                    // Keep component-specific receipts
                    tuitionReceipt:
                        tuition > 0
                            ? fee.receipt_number
                            : existing?.tuitionReceipt || null,

                    activityReceipt:
                        activity > 0
                            ? fee.receipt_number
                            : existing?.activityReceipt || null,

                    tuitionDate:
                        tuition > 0
                            ? fee.payment_date
                            : existing?.tuitionDate || null,

                    activityDate:
                        activity > 0
                            ? fee.payment_date
                            : existing?.activityDate || null
                };
            });
            if (fee.include_admission == 1) {
                history.admission = {
                    amount: Number(breakdown.one_time?.admission || 0),
                    receipt: fee.receipt_number,
                    date: fee.payment_date,
                    fee
                };
            }

            if (fee.include_annual == 1) {
                history.annual = {
                    amount: Number(breakdown.one_time?.annual || 0),
                    receipt: fee.receipt_number,
                    date: fee.payment_date,
                    fee
                };
            }

            if (fee.include_exam == 1) {
                history.exam = {
                    amount: Number(breakdown.one_time?.exam || 0),
                    receipt: fee.receipt_number,
                    date: fee.payment_date,
                    fee
                };
            }

            if (Number(breakdown.one_time?.commodities || 0) > 0) {
                history.commodities = {
                    amount: Number(breakdown.one_time.commodities || 0),
                    receipt: fee.receipt_number,
                    date: fee.payment_date,
                    fee
                };
            }

            if (Number(breakdown.one_time?.transport || 0) > 0) {
                history.transport = {
                    amount: Number(breakdown.one_time.transport || 0),
                    receipt: fee.receipt_number,
                    date: fee.payment_date,
                    fee
                };
            }

            if (Number(breakdown.one_time?.other || 0) > 0) {
                history.other = {
                    amount: Number(breakdown.one_time.other || 0),
                    receipt: fee.receipt_number,
                    date: fee.payment_date,
                    fee
                };
            }

            if (Array.isArray(fee.selected_months)) {

                months = fee.selected_months;

            } else if (
                typeof fee.selected_months === "string" &&
                fee.selected_months.trim() !== ""
            ) {

                try {

                    months = JSON.parse(fee.selected_months);

                    // Handles old double-encoded JSON
                    if (typeof months === "string") {
                        months = JSON.parse(months);
                    }

                } catch {

                    // Handles old comma-separated format
                    months = fee.selected_months
                        .split(",")
                        .map(m => m.trim())
                        .filter(Boolean);

                }

            }

            // Old single-month records
            if (months.length === 0 && fee.month) {
                months = [fee.month];
            }

            // This was for month as single unit feature logic.
            // months.forEach((month) => {

            //     if (!newLedger[month]) return;

            //     newLedger[month].paid = true;

            //     newLedger[month].receipt = fee.receipt_number;

            //     newLedger[month].fee = fee;



            //     //-------------------------------------
            //     // One Time Fees Already Paid
            //     //-------------------------------------

            //     if (fee.include_admission == 1) {

            //         setPaidOneTimeFees(prev => ({
            //             ...prev,
            //             admission: fee
            //         }));

            //     }

            //     if (fee.include_annual == 1) {

            //         setPaidOneTimeFees(prev => ({
            //             ...prev,
            //             annual: fee
            //         }));

            //     }

            //     if (fee.include_exam == 1) {

            //         setPaidOneTimeFees(prev => ({
            //             ...prev,
            //             exam: fee
            //         }));

            //     }


            // });

            // This is for tution and activity sepreate logics to be implemented 
            // Monthly activity fee is applied to every case no case left....
            // months.forEach((month) => {
            //     if (!newLedger[month]) return;

            //     const monthData = breakdown.months?.[month] || {};

            //     const tuitionAmount = Number(monthData.tuition || 0);
            //     const activityAmount = Number(monthData.activity || 0);

            //     // -----------------------------------------
            //     // Component-level payment tracking
            //     // -----------------------------------------

            //     if (tuitionAmount > 0) {
            //         newLedger[month].tuitionPaid = true;
            //     }

            //     if (activityAmount > 0) {
            //         newLedger[month].activityPaid = true;
            //     }

            //     // Month is fully paid ONLY when both
            //     // tuition and activity have been paid.
            //     newLedger[month].paid =
            //         newLedger[month].tuitionPaid &&
            //         newLedger[month].activityPaid;

            //     // Keep latest receipt for display/actions
            //     newLedger[month].receipt = fee.receipt_number;
            //     newLedger[month].fee = fee;
            // });

            months.forEach((month) => {
                if (!newLedger[month]) return;

                const monthData = breakdown.months?.[month] || {};

                const tuitionAmount = Number(monthData.tuition || 0);
                const activityAmount = Number(monthData.activity || 0);

                // -----------------------------------------
                // Component-level payment tracking
                // -----------------------------------------

                if (tuitionAmount > 0) {
                    newLedger[month].tuitionPaid = true;
                }

                if (activityAmount > 0) {
                    newLedger[month].activityPaid = true;
                }

                // If no activity fee applies to this student,
                // activity is considered settled automatically.
                const activityRequired =
                    Number(newLedger[month].defaultActivity || 0) > 0;

                newLedger[month].paid =
                    newLedger[month].tuitionPaid &&
                    (!activityRequired || newLedger[month].activityPaid);

                newLedger[month].receipt = fee.receipt_number;
                newLedger[month].fee = fee;
            });

            // Affecting the accounting principal and accounting method. 
            // Wrong accounting implementation identified ...........

            // console.log("Balance Check", {
            //     receipt: fee.receipt_number,
            //     feeBalance: fee.balance,
            //     breakdownBalance: breakdown.totals?.balance
            // });

            // const bal = Number(fee.balance || 0);

            // if (bal > 0) {
            //     history.pending += bal;
            // } else if (bal < 0) {
            //     history.deposit += Math.abs(bal);
            // }


        });

        // ==========================================================
        // REBUILD PENDING / DEPOSIT CHRONOLOGICALLY
        // ==========================================================
        // DO NOT use fee.balance here.
        // balance is a snapshot of the transaction at that time.
        // We need to reconstruct the actual financial position.

        let runningPending = 0;
        let runningDeposit = 0;

        // Modification is required to do due to identification of flaw in accounting .....
        // const settlementFees = [...uniquePaidFees].sort((a, b) => {
        //     const dateA = new Date(a.payment_date || 0);
        //     const dateB = new Date(b.payment_date || 0);

        //     const dateDiff = dateA - dateB;

        //     if (dateDiff !== 0) {
        //         return dateDiff;
        //     }

        //     return Number(a.id || 0) - Number(b.id || 0);
        // });

        const settlementFees = [...paidFees].sort((a, b) => {
            const dateA = new Date(a.payment_date || 0);
            const dateB = new Date(b.payment_date || 0);

            const dateDiff = dateA - dateB;

            if (dateDiff !== 0) {
                return dateDiff;
            }

            return Number(a.id || 0) - Number(b.id || 0);
        });

        // Save ledger bacha hai aake karta hu usko tune in..... 
        // Kar liya done ....... (12:54 a.m.)
        settlementFees.forEach((fee) => {
            const due = Math.max(
                0,
                Number(fee.transaction_total || 0)
            );

            const paid = Math.max(
                0,
                Number(fee.amount || 0)
            );

            // ------------------------------------------------------
            // CASE 1:
            // Payment is less than transaction due
            // ------------------------------------------------------
            if (paid < due) {
                runningPending += due - paid;
                return;
            }

            // ------------------------------------------------------
            // CASE 2:
            // Fully paid exactly
            // ------------------------------------------------------
            if (paid === due) {
                return;
            }

            // ------------------------------------------------------
            // CASE 3:
            // Payment is greater than current transaction due
            // ------------------------------------------------------
            let extraPayment = paid - due;

            // First consume any old pending
            if (runningPending > 0 && extraPayment > 0) {
                const pendingUsed = Math.min(
                    runningPending,
                    extraPayment
                );

                runningPending -= pendingUsed;
                extraPayment -= pendingUsed;
            }

            // Anything still left becomes genuine deposit
            if (extraPayment > 0) {
                runningDeposit += extraPayment;
            }
        });

        history.pending = Math.max(0, runningPending);
        history.deposit = Math.max(0, runningDeposit);

        console.log("FINAL SETTLEMENT HISTORY", {
            pending: history.pending,
            deposit: history.deposit,
            transactions: settlementFees.map((fee) => ({
                receipt: fee.receipt_number,
                date: fee.payment_date,
                due: Number(fee.transaction_total || 0),
                paid: Number(fee.amount || 0),
                storedBalance: Number(fee.balance || 0)
            }))
        });



        console.log("Final History:", history);
        setPaymentHistory(history);
        setPaidOneTimeFees({
            admission: history.admission,
            annual: history.annual,
            exam: history.exam,
            commodities: history.commodities,
            transport: history.transport,
            other: history.other
        });



        setLedger(newLedger);

    };

    const viewReceipt = (fee) => {

        if (!fee?.uuid) {
            alert("Receipt not found.");
            return;
        }

        window.open(
            `${API}/generatereceipt.php?uuid=${fee.uuid}`,
            "_blank"
        );

    };


    const editMonth = (fee) => {

        let breakdown = {};
        let selectedMonths = [];

        try {
            breakdown = JSON.parse(fee.fee_breakdown || "{}");
        } catch { }



        try {
            selectedMonths = JSON.parse(fee.selected_months || "[]");
        } catch { }

        const months = {};

        academicMonths.forEach(month => {

            const monthData = breakdown.months?.[month] || {};

            months[month] = {

                checked: selectedMonths.includes(month),

                tuition: Number(monthData.tuition || 0),

                activity: Number(monthData.activity || 0),

                total: Number(monthData.total || 0),

            };

        });

        const editData = {

            uuid: fee.uuid,

            transaction_uuid: fee.transaction_uuid,

            receipt_number: fee.receipt_number,

            student_uuid: fee.student_uuid,

            payment_date: fee.payment_date,

            payment_method: fee.payment_method || "cash",

            remarks: fee.remarks || "",

            amount: Number(fee.amount || 0),

            balance: Number(fee.balance || 0),

            transaction_total: Number(fee.transaction_total || 0),

            months,

            admission_fee:
                Number(breakdown.one_time?.admission || 0),

            annual_fee:
                Number(breakdown.one_time?.annual || 0),

            exam_fee:
                Number(breakdown.one_time?.exam || 0),

            commodities_fee:
                Number(breakdown.one_time?.commodities || 0),

            transport_fee:
                Number(breakdown.one_time?.transport || 0),

            other_fee:
                Number(breakdown.one_time?.other || 0),

            late_fee:
                Number(breakdown.discounts?.late_fee || 0),

            sibling_discount_amount:
                Number(breakdown.discounts?.sibling || 0),

            special_discount:
                Number(breakdown.discounts?.special || 0),

            include_admission: fee.include_admission,

            include_annual: fee.include_annual,

            include_exam: fee.include_exam,

            include_activity: fee.include_activity,

            include_commodities: fee.include_commodities,

            computer: fee.computer,

            abacus: fee.abacus,

            taekwondo: fee.taekwondo,

            selected_months: selectedMonths,

            addedMonths: [],

            removedMonths: []

        };

        console.log("Edit Receipt Loaded", editData);


        setEditReceipt(editData);

        setEditingFee(fee);

        setIsEditing(true);

        setEditOpen(true);

    };

    const updateEditMonth = (month, field, value) => {

        setEditReceipt(prev => ({

            ...prev,

            months: {

                ...prev.months,

                [month]: {

                    ...prev.months[month],

                    [field]: Number(value)

                }

            }

        }));

    };

    const updateEditField = (field, value) => {

        setEditReceipt(prev => ({

            ...prev,

            [field]: value

        }));

    };

    const calculateEditTotals = (data) => {

        let monthlyTotal = 0;

        Object.values(data.months).forEach(month => {

            if (month.checked) {

                monthlyTotal +=
                    Number(month.tuition || 0) +
                    Number(month.activity || 0);

            }

        });

        const oneTime =

            Number(data.admission_fee || 0) +
            Number(data.annual_fee || 0) +
            Number(data.exam_fee || 0) +
            Number(data.commodities_fee || 0) +
            Number(data.transport_fee || 0) +
            Number(data.other_fee || 0);

        const gross = monthlyTotal + oneTime;

        const totalDiscount =

            Number(data.sibling_discount_amount || 0) +
            Number(data.special_discount || 0);

        const net = gross - totalDiscount;

        const balance =
            net - Number(data.amount || 0);

        return {

            gross,

            net,

            balance

        };

    };

    const editTotals = useMemo(() => {

        if (!editReceipt) return {

            gross: 0,

            net: 0,

            balance: 0

        };

        return calculateEditTotals(editReceipt);

    }, [editReceipt]);

    function calculateLateFee(paymentDate) {

        if (!paymentDate) return 0;

        const payment = new Date(paymentDate);

        const dueDate = new Date(payment);

        // Fee is due on the 15th
        dueDate.setDate(15);

        // Paid on or before 15th
        if (payment <= dueDate)
            return 0;

        const monthEnd = new Date(
            payment.getFullYear(),
            payment.getMonth() + 1,
            0
        );

        // Paid after 15th but before month ends
        if (payment <= monthEnd)
            return 50;

        // After month end
        const nextMonthStart = new Date(
            payment.getFullYear(),
            payment.getMonth() + 1,
            1
        );

        const diffDays = Math.ceil(
            (payment - nextMonthStart) /
            (1000 * 60 * 60 * 24)
        ) + 1;

        return 50 + diffDays;

    }

    useEffect(() => {

        setDiscounts(prev => ({
            ...prev,
            lateFee: calculateLateFee(paymentDate)
        }));

    }, [paymentDate]);


    const deleteMonth = async (fee, month) => {

        if (!window.confirm(`Delete ${month} fee?`))
            return;

        await axios.post(`${API}/editFee.php`, {

            uuid: fee.uuid,

            delete_months: [month],

            payment_date: fee.payment_date,

            payment_method: fee.payment_method

        });

        await loadFees();

        handleStudentSelect(selectedStudent);

        console.log(fee);

    };

    const transactionUuidRef = useRef(null);



    // const saveLedger = async () => {

    //     // =========================================================
    //     // PREVENT MULTIPLE SUBMISSIONS
    //     // =========================================================

    //     if (saving) {
    //         return;
    //     }

    //     if (!selectedStudent) {

    //         alert("Select a student");

    //         return;

    //     }

    //     // Lock the save operation immediately.
    //     // This prevents rapid multiple clicks.
    //     setSaving(true);


    //     try {

    //         const selectedMonths = [];

    //         const feeBreakdown = {
    //             months: {},
    //             one_time: {},
    //             discounts: {},
    //             totals: {}
    //         };

    //         let transactionTotal = 0;


    //         // =========================================================
    //         // MONTHLY FEES
    //         // =========================================================

    //         // The loop works for fee with conditional uniting system logic 
    //         // academicMonths.forEach((month) => {

    //         //     // Already paid months are ignored
    //         //     if (ledger[month].paid)
    //         //         return;


    //         //     const tuition =
    //         //         ledger[month].tuition === ""
    //         //             ? 0
    //         //             : Number(ledger[month].tuition);


    //         //     const activity =
    //         //         ledger[month].activity === ""
    //         //             ? 0
    //         //             : Number(ledger[month].activity);


    //         //     // Skip month if operator entered nothing
    //         //     if (
    //         //         ledger[month].tuition === "" &&
    //         //         ledger[month].activity === ""
    //         //     ) {
    //         //         return;
    //         //     }


    //         //     selectedMonths.push(month);


    //         //     feeBreakdown.months[month] = {
    //         //         tuition,
    //         //         activity,
    //         //         total: tuition + activity
    //         //     };


    //         //     transactionTotal += tuition + activity;

    //         // });

    //         // The below code use systematic conditional logic to work with.......
    //         academicMonths.forEach((month) => {
    //             const row = ledger[month];

    //             const tuition =
    //                 row.tuition === ""
    //                     ? 0
    //                     : Number(row.tuition);

    //             const activity =
    //                 row.activity === ""
    //                     ? 0
    //                     : Number(row.activity);

    //             // Nothing newly entered for this month
    //             if (tuition === 0 && activity === 0) {
    //                 return;
    //             }

    //             selectedMonths.push(month);

    //             feeBreakdown.months[month] = {
    //                 tuition,
    //                 activity,
    //                 total: tuition + activity
    //             };

    //             transactionTotal += tuition + activity;
    //         });


    //         // =========================================================
    //         // ONE-TIME FEES
    //         // =========================================================

    //         transactionTotal +=
    //             (oneTimeFees.admission === ""
    //                 ? 0
    //                 : Number(oneTimeFees.admission)) +

    //             (oneTimeFees.annual === ""
    //                 ? 0
    //                 : Number(oneTimeFees.annual)) +

    //             (oneTimeFees.exam === ""
    //                 ? 0
    //                 : Number(oneTimeFees.exam)) +

    //             (oneTimeFees.commodities === ""
    //                 ? 0
    //                 : Number(oneTimeFees.commodities)) +

    //             (oneTimeFees.transport === ""
    //                 ? 0
    //                 : Number(oneTimeFees.transport)) +

    //             (oneTimeFees.other === ""
    //                 ? 0
    //                 : Number(oneTimeFees.other));


    //         // =========================================================
    //         // DISCOUNTS / LATE FEE
    //         // =========================================================

    //         transactionTotal +=
    //             Number(discounts.lateFee || 0);


    //         transactionTotal -=
    //             Number(discounts.sibling || 0);


    //         transactionTotal -=
    //             Number(discounts.special || 0);


    //         // =========================================================
    //         // BREAKDOWN TOTALS
    //         // =========================================================

    //         feeBreakdown.totals = {

    //             gross: grossTotal,

    //             current_net: netTotal,

    //             previous_pending: previousPending,

    //             previous_deposit: previousDeposit,

    //             carry_forward: carryForward,

    //             net: adjustedNetTotal,

    //             collected:
    //                 Number(collectedAmount || 0),

    //             balance:
    //                 balance

    //         };


    //         // =========================================================
    //         // ONE-TIME FEE BREAKDOWN
    //         // =========================================================

    //         feeBreakdown.one_time = {

    //             admission:
    //                 oneTimeFees.admission === ""
    //                     ? 0
    //                     : Number(oneTimeFees.admission),

    //             annual:
    //                 oneTimeFees.annual === ""
    //                     ? 0
    //                     : Number(oneTimeFees.annual),

    //             exam:
    //                 oneTimeFees.exam === ""
    //                     ? 0
    //                     : Number(oneTimeFees.exam),

    //             commodities:
    //                 oneTimeFees.commodities === ""
    //                     ? 0
    //                     : Number(oneTimeFees.commodities),

    //             transport:
    //                 oneTimeFees.transport === ""
    //                     ? 0
    //                     : Number(oneTimeFees.transport),

    //             other:
    //                 oneTimeFees.other === ""
    //                     ? 0
    //                     : Number(oneTimeFees.other)

    //         };


    //         // =========================================================
    //         // DISCOUNT BREAKDOWN
    //         // =========================================================

    //         feeBreakdown.discounts = {

    //             late_fee:
    //                 Number(discounts.lateFee || 0),

    //             sibling:
    //                 Number(discounts.sibling || 0),

    //             special:
    //                 Number(discounts.special || 0)

    //         };


    //         // =========================================================
    //         // PAYLOAD
    //         // =========================================================

    //         const payload = {

    //             // Unique record ID
    //             uuid:
    //                 crypto.randomUUID(),


    //             // Student
    //             student_uuid:
    //                 selectedStudent.uuid,


    //             // ONE transaction UUID for the complete payment
    //             transaction_uuid:
    //                 crypto.randomUUID(),


    //             // Backend generates receipt number
    //             receipt_number:
    //                 "",


    //             // Actual collected amount
    //             amount:
    //                 Number(collectedAmount),


    //             // Remaining balance
    //             balance:
    //                 balance,


    //             // Late fee
    //             late_fee:
    //                 Number(discounts.lateFee || 0),


    //             // Payment method
    //             payment_method:
    //                 paymentMethod,


    //             // Payment date
    //             payment_date:
    //                 paymentDate,


    //             // First selected month retained for compatibility
    //             month:
    //                 selectedMonths[0] || null,


    //             // Payment year
    //             year:
    //                 new Date(paymentDate).getFullYear(),


    //             // IMPORTANT:
    //             // All selected months remain inside ONE transaction
    //             selected_months:
    //                 JSON.stringify(selectedMonths),


    //             months_count:
    //                 selectedMonths.length,


    //             // Complete transaction value
    //             transaction_total:
    //                 transactionTotal,


    //             // Monthly fee included?
    //             include_monthly:
    //                 selectedMonths.length > 0
    //                     ? 1
    //                     : 0,


    //             // One-time fee flags
    //             include_admission:
    //                 oneTimeFees.admission !== ""
    //                     ? 1
    //                     : 0,


    //             include_annual:
    //                 oneTimeFees.annual !== ""
    //                     ? 1
    //                     : 0,


    //             include_exam:
    //                 oneTimeFees.exam !== ""
    //                     ? 1
    //                     : 0,


    //             include_activity:
    //                 selectedMonths.some(
    //                     month =>
    //                         Number(
    //                             ledger[month].activity || 0
    //                         ) > 0
    //                 )
    //                     ? 1
    //                     : 0,


    //             include_commodities:
    //                 oneTimeFees.commodities !== ""
    //                     ? 1
    //                     : 0,


    //             commodities_fee:
    //                 oneTimeFees.commodities === ""
    //                     ? 0
    //                     : Number(oneTimeFees.commodities),


    //             // Student activities
    //             computer:
    //                 selectedStudent.computer,

    //             abacus:
    //                 selectedStudent.abacus,

    //             taekwondo:
    //                 selectedStudent.taekwondo,


    //             // Discounts
    //             sibling_discount_enabled:
    //                 Number(discounts.sibling) > 0
    //                     ? 1
    //                     : 0,


    //             sibling_discount_amount:
    //                 Number(discounts.sibling || 0),


    //             special_discount:
    //                 Number(discounts.special || 0),


    //             // Complete breakdown
    //             fee_breakdown:
    //                 JSON.stringify(feeBreakdown),


    //             // Ignored fee structure
    //             ignore_fee_structure:
    //                 ignoreFeeStructure
    //                     ? 1
    //                     : 0,


    //             ignored_fee_items:
    //                 JSON.stringify(ignoredFeeItems),


    //             remarks:
    //                 remarks

    //         };


    //         // =========================================================
    //         // DEBUG LOG
    //         // =========================================================

    //         console.log(
    //             "Saving fee transaction:",
    //             payload.transaction_uuid
    //         );

    //         console.log(
    //             "Selected months:",
    //             selectedMonths
    //         );

    //         console.log(
    //             "Payment payload:",
    //             payload
    //         );


    //         // =========================================================
    //         // SAVE TO BACKEND
    //         // =========================================================

    //         const res = await axios.post(
    //             `${API}/addFee.php`,
    //             payload
    //         );


    //         // =========================================================
    //         // RESPONSE
    //         // =========================================================

    //         if (res.data.status) {

    //             alert("Fee saved successfully");


    //             await loadFees();


    //             handleStudentSelect(
    //                 selectedStudent
    //             );


    //         } else {

    //             alert(
    //                 res.data.message ||
    //                 "Unable to save fee."
    //             );

    //         }


    //     } catch (err) {

    //         console.error(
    //             "Fee save error:",
    //             err
    //         );

    //         // alert(
    //         //     "Unable to save fee."
    //         // );


    //     } finally {

    //         // =========================================================
    //         // UNLOCK AFTER REQUEST FINISHES
    //         // =========================================================

    //         setSaving(false);

    //     }

    // };

    // const saveLedger = async () => {

    //     // =========================================================
    //     // PREVENT MULTIPLE SUBMISSIONS
    //     // =========================================================

    //     if (saving) {
    //         return;
    //     }

    //     if (!selectedStudent) {
    //         alert("Select a student");
    //         return;
    //     }

    //     // Lock immediately
    //     setSaving(true);

    //     try {

    //         // =========================================================
    //         // CREATE / REUSE TRANSACTION UUID
    //         // =========================================================
    //         //
    //         // IMPORTANT:
    //         //
    //         // Do NOT generate a new transaction UUID every retry.
    //         //
    //         // If the request reaches PHP successfully but the browser
    //         // does not receive the response, retrying with the same
    //         // transaction_uuid allows the backend to recognize it as
    //         // the same transaction.
    //         //

    //         if (!transactionUuidRef.current) {
    //             transactionUuidRef.current = crypto.randomUUID();
    //         }

    //         const transactionUuid = transactionUuidRef.current;


    //         // =========================================================
    //         // INITIAL DATA
    //         // =========================================================

    //         const selectedMonths = [];

    //         const feeBreakdown = {
    //             months: {},
    //             one_time: {},
    //             discounts: {},
    //             totals: {}
    //         };

    //         let transactionTotal = 0;


    //         // =========================================================
    //         // MONTHLY FEES
    //         // =========================================================

    //         academicMonths.forEach((month) => {

    //             const row = ledger[month];

    //             if (!row) {
    //                 return;
    //             }

    //             const tuition =
    //                 row.tuition === ""
    //                     ? 0
    //                     : Number(row.tuition);

    //             const activity =
    //                 row.activity === ""
    //                     ? 0
    //                     : Number(row.activity);


    //             // Nothing newly entered for this month
    //             if (
    //                 tuition === 0 &&
    //                 activity === 0
    //             ) {
    //                 return;
    //             }


    //             selectedMonths.push(month);

    //             feeBreakdown.months[month] = {
    //                 tuition,
    //                 activity,
    //                 total: tuition + activity
    //             };


    //             transactionTotal +=
    //                 tuition + activity;

    //         });


    //         // =========================================================
    //         // DETERMINE WHETHER THIS TRANSACTION HAS MONTHLY FEES
    //         // =========================================================
    //         //
    //         // This must match the backend logic.
    //         //
    //         // Tuition OR activity > 0 means monthly fee exists.
    //         //

    //         const hasMonthlyFee =
    //             selectedMonths.length > 0;


    //         // =========================================================
    //         // ONE-TIME FEES
    //         // =========================================================

    //         const admission =
    //             oneTimeFees.admission === ""
    //                 ? 0
    //                 : Number(oneTimeFees.admission);

    //         const annual =
    //             oneTimeFees.annual === ""
    //                 ? 0
    //                 : Number(oneTimeFees.annual);

    //         const exam =
    //             oneTimeFees.exam === ""
    //                 ? 0
    //                 : Number(oneTimeFees.exam);

    //         const commodities =
    //             oneTimeFees.commodities === ""
    //                 ? 0
    //                 : Number(oneTimeFees.commodities);

    //         const transport =
    //             oneTimeFees.transport === ""
    //                 ? 0
    //                 : Number(oneTimeFees.transport);

    //         const other =
    //             oneTimeFees.other === ""
    //                 ? 0
    //                 : Number(oneTimeFees.other);


    //         transactionTotal +=
    //             admission +
    //             annual +
    //             exam +
    //             commodities +
    //             transport +
    //             other;


    //         // =========================================================
    //         // LATE FEE
    //         // =========================================================
    //         //
    //         // Backend rules:
    //         //
    //         // 1. ignore_late_fee = true  => late fee = 0
    //         //
    //         // 2. No monthly fee            => late fee = 0
    //         //
    //         // 3. Monthly fee exists        => supplied late fee allowed
    //         //

    //         const ignoreLateFee =
    //             ignoreLateFeeState
    //                 ? 1
    //                 : 0;


    //         let effectiveLateFee =
    //             Number(discounts.lateFee || 0);


    //         if (
    //             ignoreLateFee ||
    //             !hasMonthlyFee
    //         ) {
    //             effectiveLateFee = 0;
    //         }


    //         // =========================================================
    //         // DISCOUNTS / LATE FEE
    //         // =========================================================

    //         transactionTotal +=
    //             effectiveLateFee;


    //         const siblingDiscount =
    //             Number(discounts.sibling || 0);

    //         const specialDiscount =
    //             Number(discounts.special || 0);


    //         transactionTotal -=
    //             siblingDiscount;

    //         transactionTotal -=
    //             specialDiscount;


    //         // =========================================================
    //         // ONE-TIME FEE BREAKDOWN
    //         // =========================================================

    //         feeBreakdown.one_time = {

    //             admission,

    //             annual,

    //             exam,

    //             commodities,

    //             transport,

    //             other

    //         };


    //         // =========================================================
    //         // DISCOUNT BREAKDOWN
    //         // =========================================================

    //         feeBreakdown.discounts = {

    //             late_fee:
    //                 effectiveLateFee,

    //             sibling:
    //                 siblingDiscount,

    //             special:
    //                 specialDiscount

    //         };


    //         // =========================================================
    //         // BREAKDOWN TOTALS
    //         // =========================================================

    //         feeBreakdown.totals = {

    //             gross:
    //                 grossTotal,

    //             current_net:
    //                 netTotal,

    //             previous_pending:
    //                 previousPending,

    //             previous_deposit:
    //                 previousDeposit,

    //             carry_forward:
    //                 carryForward,

    //             net:
    //                 adjustedNetTotal,

    //             collected:
    //                 Number(collectedAmount || 0),

    //             balance:
    //                 Number(balance || 0)

    //         };


    //         // =========================================================
    //         // BASIC FRONTEND VALIDATION
    //         // =========================================================

    //         const collectedAmountNumber =
    //             Number(collectedAmount || 0);

    //         if (collectedAmountNumber <= 0) {

    //             alert(
    //                 "Please enter a valid payment amount."
    //             );

    //             return;
    //         }


    //         // =========================================================
    //         // PAYMENT YEAR
    //         // =========================================================
    //         //
    //         // Avoid:
    //         //
    //         // new Date("2026-01-01").getFullYear()
    //         //
    //         // because YYYY-MM-DD parsing can involve UTC.
    //         //
    //         // The backend expects the year associated with the
    //         // payment_date.
    //         //

    //         const paymentYear =
    //             Number(
    //                 String(paymentDate).slice(0, 4)
    //             );


    //         // =========================================================
    //         // PAYLOAD
    //         // =========================================================

    //         const payload = {

    //             // -----------------------------------------------------
    //             // UNIQUE RECORD UUID
    //             // -----------------------------------------------------
    //             //
    //             // This identifies the individual DB row.
    //             //
    //             uuid:
    //                 crypto.randomUUID(),


    //             // -----------------------------------------------------
    //             // STUDENT
    //             // -----------------------------------------------------

    //             student_uuid:
    //                 selectedStudent.uuid,


    //             // -----------------------------------------------------
    //             // TRANSACTION UUID
    //             // -----------------------------------------------------
    //             //
    //             // IMPORTANT:
    //             // Reused for the lifetime of this save attempt.
    //             //

    //             transaction_uuid:
    //                 transactionUuid,


    //             // -----------------------------------------------------
    //             // RECEIPT
    //             // -----------------------------------------------------
    //             //
    //             // Empty means PHP generates it.
    //             //

    //             receipt_number:
    //                 "",


    //             // -----------------------------------------------------
    //             // PAYMENT AMOUNT
    //             // -----------------------------------------------------

    //             amount:
    //                 collectedAmountNumber,


    //             // -----------------------------------------------------
    //             // BALANCE
    //             // -----------------------------------------------------

    //             balance:
    //                 Number(balance || 0),


    //             // -----------------------------------------------------
    //             // LATE FEE
    //             // -----------------------------------------------------

    //             late_fee:
    //                 effectiveLateFee,


    //             // -----------------------------------------------------
    //             // IMPORTANT:
    //             // Tell backend whether late fee is ignored.
    //             // -----------------------------------------------------

    //             ignore_late_fee:
    //                 ignoreLateFee,


    //             // -----------------------------------------------------
    //             // PAYMENT METHOD
    //             // -----------------------------------------------------

    //             payment_method:
    //                 paymentMethod,


    //             // -----------------------------------------------------
    //             // PAYMENT DATE
    //             // -----------------------------------------------------

    //             payment_date:
    //                 paymentDate,


    //             // -----------------------------------------------------
    //             // COMPATIBILITY MONTH
    //             // -----------------------------------------------------

    //             month:
    //                 selectedMonths[0] || null,


    //             // -----------------------------------------------------
    //             // PAYMENT YEAR
    //             // -----------------------------------------------------

    //             year:
    //                 paymentYear,


    //             // -----------------------------------------------------
    //             // SELECTED MONTHS
    //             // -----------------------------------------------------

    //             selected_months:
    //                 JSON.stringify(selectedMonths),

    //             months_count:
    //                 selectedMonths.length,


    //             // -----------------------------------------------------
    //             // TRANSACTION TOTAL
    //             // -----------------------------------------------------

    //             transaction_total:
    //                 transactionTotal,


    //             // -----------------------------------------------------
    //             // MONTHLY FLAG
    //             // -----------------------------------------------------

    //             include_monthly:
    //                 hasMonthlyFee
    //                     ? 1
    //                     : 0,


    //             // -----------------------------------------------------
    //             // ONE-TIME FLAGS
    //             // -----------------------------------------------------

    //             include_admission:
    //                 admission > 0
    //                     ? 1
    //                     : 0,

    //             include_annual:
    //                 annual > 0
    //                     ? 1
    //                     : 0,

    //             include_exam:
    //                 exam > 0
    //                     ? 1
    //                     : 0,


    //             // -----------------------------------------------------
    //             // ACTIVITY FLAG
    //             // -----------------------------------------------------

    //             include_activity:
    //                 selectedMonths.some(
    //                     (month) =>
    //                         Number(
    //                             ledger[month]?.activity || 0
    //                         ) > 0
    //                 )
    //                     ? 1
    //                     : 0,


    //             // -----------------------------------------------------
    //             // COMMODITIES
    //             // -----------------------------------------------------

    //             include_commodities:
    //                 commodities > 0
    //                     ? 1
    //                     : 0,

    //             commodities_fee:
    //                 commodities,


    //             // -----------------------------------------------------
    //             // STUDENT ACTIVITIES
    //             // -----------------------------------------------------

    //             computer:
    //                 Number(selectedStudent.computer || 0),

    //             abacus:
    //                 Number(selectedStudent.abacus || 0),

    //             taekwondo:
    //                 Number(selectedStudent.taekwondo || 0),


    //             // -----------------------------------------------------
    //             // SIBLING DISCOUNT
    //             // -----------------------------------------------------

    //             sibling_discount_enabled:
    //                 siblingDiscount > 0
    //                     ? 1
    //                     : 0,

    //             sibling_discount_amount:
    //                 siblingDiscount,


    //             // -----------------------------------------------------
    //             // SPECIAL DISCOUNT
    //             // -----------------------------------------------------

    //             special_discount:
    //                 specialDiscount,


    //             // -----------------------------------------------------
    //             // COMPLETE BREAKDOWN
    //             // -----------------------------------------------------

    //             fee_breakdown:
    //                 JSON.stringify(feeBreakdown),


    //             // -----------------------------------------------------
    //             // FEE STRUCTURE
    //             // -----------------------------------------------------

    //             ignore_fee_structure:
    //                 ignoreFeeStructure
    //                     ? 1
    //                     : 0,

    //             ignored_fee_items:
    //                 JSON.stringify(
    //                     ignoredFeeItems || []
    //                 ),


    //             // -----------------------------------------------------
    //             // REMARKS
    //             // -----------------------------------------------------

    //             remarks:
    //                 remarks || null

    //         };


    //         // =========================================================
    //         // DEBUG
    //         // =========================================================

    //         console.log(
    //             "Saving fee transaction:",
    //             transactionUuid
    //         );

    //         console.log(
    //             "Selected months:",
    //             selectedMonths
    //         );

    //         console.log(
    //             "Has monthly fee:",
    //             hasMonthlyFee
    //         );

    //         console.log(
    //             "Ignore late fee:",
    //             ignoreLateFee
    //         );

    //         console.log(
    //             "Effective late fee:",
    //             effectiveLateFee
    //         );

    //         console.log(
    //             "Transaction total:",
    //             transactionTotal
    //         );

    //         console.log(
    //             "Payment payload:",
    //             payload
    //         );


    //         // =========================================================
    //         // SAVE TO BACKEND
    //         // =========================================================

    //         const res = await axios.post(
    //             `${API}/addFee.php`,
    //             payload
    //         );


    //         // =========================================================
    //         // RESPONSE
    //         // =========================================================

    //         if (res.data.status) {

    //             alert(
    //                 res.data.message ||
    //                 "Fee saved successfully"
    //             );


    //             // =====================================================
    //             // IMPORTANT:
    //             // Transaction is now successfully saved.
    //             //
    //             // Clear the transaction UUID so the NEXT payment
    //             // gets a completely new transaction UUID.
    //             // =====================================================

    //             transactionUuidRef.current = null;


    //             await loadFees();

    //             handleStudentSelect(
    //                 selectedStudent
    //             );


    //         } else {

    //             alert(
    //                 res.data.message ||
    //                 "Unable to save fee."
    //             );

    //         }


    //     } catch (err) {

    //         console.error(
    //             "Fee save error:",
    //             err
    //         );


    //         /*
    //          * DO NOT clear transactionUuidRef here.
    //          *
    //          * If the request reached the backend but the response
    //          * was lost, the user can retry and the same
    //          * transaction_uuid will allow the backend to detect the
    //          * already-saved transaction.
    //          */

    //         alert(
    //             err?.response?.data?.message ||
    //             "Unable to save fee. Please try again."
    //         );


    //     } finally {

    //         // =========================================================
    //         // UNLOCK AFTER REQUEST FINISHES
    //         // =========================================================

    //         setSaving(false);

    //     }
    // };

    // Above one fails due to bad code push one
    const saveLedger = async () => {
        // =========================================================
        // PREVENT MULTIPLE SUBMISSIONS
        // =========================================================
        if (saving) {
            return;
        }

        if (!selectedStudent) {
            alert("Select a student");
            return;
        }

        setSaving(true);

        try {
            // =========================================================
            // CREATE / REUSE TRANSACTION UUID
            // =========================================================
            //
            // IMPORTANT:
            // Do NOT generate a new transaction UUID on retry.
            //
            // If PHP saves successfully but browser does not receive
            // response, retrying with same transaction_uuid lets backend
            // identify it as the same transaction.
            //
            if (!transactionUuidRef.current) {
                transactionUuidRef.current = crypto.randomUUID();
            }

            const transactionUuid =
                transactionUuidRef.current;

            // =========================================================
            // INITIAL DATA
            // =========================================================

            const selectedMonths = [];

            const feeBreakdown = {
                months: {},
                one_time: {},
                discounts: {},
                totals: {}
            };

            let transactionTotal = 0;

            // =========================================================
            // MONTHLY FEES
            // =========================================================

            academicMonths.forEach((month) => {
                const row = ledger[month];

                if (!row) {
                    return;
                }

                const tuition =
                    row.tuition === ""
                        ? 0
                        : Number(row.tuition);

                const activity =
                    row.activity === ""
                        ? 0
                        : Number(row.activity);

                // Nothing newly entered for this month
                if (
                    tuition === 0 &&
                    activity === 0
                ) {
                    return;
                }

                selectedMonths.push(month);

                feeBreakdown.months[month] = {
                    tuition,
                    activity,
                    total: tuition + activity
                };

                transactionTotal +=
                    tuition + activity;
            });

            // =========================================================
            // MONTHLY FEE FLAG
            // =========================================================

            const hasMonthlyFee =
                selectedMonths.length > 0;

            // =========================================================
            // ONE-TIME FEES
            // =========================================================

            const admission =
                oneTimeFees.admission === ""
                    ? 0
                    : Number(oneTimeFees.admission);

            const annual =
                oneTimeFees.annual === ""
                    ? 0
                    : Number(oneTimeFees.annual);

            const exam =
                oneTimeFees.exam === ""
                    ? 0
                    : Number(oneTimeFees.exam);

            const commodities =
                oneTimeFees.commodities === ""
                    ? 0
                    : Number(oneTimeFees.commodities);

            const transport =
                oneTimeFees.transport === ""
                    ? 0
                    : Number(oneTimeFees.transport);

            const other =
                oneTimeFees.other === ""
                    ? 0
                    : Number(oneTimeFees.other);

            transactionTotal +=
                admission +
                annual +
                exam +
                commodities +
                transport +
                other;

            // =========================================================
            // LATE FEE
            // =========================================================

            const ignoreLateFee =
                ignoreLateFeeState
                    ? 1
                    : 0;

            let effectiveLateFee =
                Number(discounts.lateFee || 0);

            // Backend rules:
            //
            // ignore_late_fee = 1 => late fee 0
            // no monthly fee    => late fee 0
            //
            if (
                ignoreLateFee ||
                !hasMonthlyFee
            ) {
                effectiveLateFee = 0;
            }

            transactionTotal +=
                effectiveLateFee;

            // =========================================================
            // DISCOUNTS
            // =========================================================

            const siblingDiscount =
                Number(discounts.sibling || 0);

            const specialDiscount =
                Number(discounts.special || 0);

            transactionTotal -=
                siblingDiscount;

            transactionTotal -=
                specialDiscount;

            // Never allow current transaction total below zero
            transactionTotal = Math.max(
                0,
                transactionTotal
            );

            // =========================================================
            // ONE-TIME BREAKDOWN
            // =========================================================

            feeBreakdown.one_time = {
                admission,
                annual,
                exam,
                commodities,
                transport,
                other
            };

            // =========================================================
            // DISCOUNT BREAKDOWN
            // =========================================================

            feeBreakdown.discounts = {
                late_fee: effectiveLateFee,
                sibling: siblingDiscount,
                special: specialDiscount
            };

            // =========================================================
            // CURRENT PAYMENT
            // =========================================================

            const collectedAmountNumber =
                Number(collectedAmount || 0);

            if (
                !Number.isFinite(collectedAmountNumber) ||
                collectedAmountNumber <= 0
            ) {
                alert(
                    "Please enter a valid payment amount."
                );
                return;
            }

            // =========================================================
            // PREVIOUS SETTLEMENT
            // =========================================================
            //
            // paymentHistory comes from handleStudentSelect().
            //
            // previousPending:
            //     old unpaid amount
            //
            // previousDeposit:
            //     old genuine excess payment
            //
            const oldPending =
                Math.max(
                    0,
                    Number(previousPending || 0)
                );

            const oldDeposit =
                Math.max(
                    0,
                    Number(previousDeposit || 0)
                );

            // =========================================================
            // CURRENT NET
            // =========================================================
            //
            // This is ONLY the current transaction's fee.
            //
            const currentNet =
                Math.max(
                    0,
                    Number(netTotal || 0)
                );

            // =========================================================
            // TOTAL AMOUNT THAT NEEDS TO BE SETTLED
            // =========================================================
            //
            // Example:
            //
            // Previous pending = 300
            // Current fee      = 300
            // Previous deposit = 0
            //
            // Total due = 600
            //
            const totalDue =
                Math.max(
                    0,
                    currentNet +
                    oldPending -
                    oldDeposit
                );

            // =========================================================
            // CURRENT BALANCE
            // =========================================================

            const finalBalance =
                Math.max(
                    0,
                    totalDue -
                    collectedAmountNumber
                );

            // =========================================================
            // CURRENT GENUINE DEPOSIT
            // =========================================================
            //
            // Only amount above the TOTAL outstanding amount
            // becomes a deposit.
            //
            const actualDeposit =
                Math.max(
                    0,
                    collectedAmountNumber -
                    totalDue
                );

            // =========================================================
            // CURRENT PAYMENT ALLOCATION
            // =========================================================
            //
            // Useful for frontend debugging / receipt breakdown.
            //
            let paymentRemaining =
                collectedAmountNumber;

            // First consume previous pending
            const pendingUsed =
                Math.min(
                    oldPending,
                    paymentRemaining
                );

            paymentRemaining -=
                pendingUsed;

            // Then pay current fee
            const currentFeePaid =
                Math.min(
                    currentNet,
                    paymentRemaining
                );

            paymentRemaining -=
                currentFeePaid;

            // Anything left is deposit
            const depositCreated =
                Math.max(
                    0,
                    paymentRemaining
                );

            const pendingRemaining =
                Math.max(
                    0,
                    oldPending -
                    pendingUsed
                );

            const currentFeeRemaining =
                Math.max(
                    0,
                    currentNet -
                    currentFeePaid
                );

            // =========================================================
            // FINAL SETTLEMENT STATE
            // =========================================================

            const finalPending =
                Math.max(
                    0,
                    pendingRemaining +
                    currentFeeRemaining
                );

            const finalDeposit =
                Math.max(
                    0,
                    oldDeposit +
                    depositCreated -
                    Math.min(
                        oldDeposit,
                        currentNet
                    )
                );

            // =========================================================
            // BREAKDOWN TOTALS
            // =========================================================

            feeBreakdown.totals = {
                // Current fee only
                gross:
                    Number(grossTotal || 0),

                current_net:
                    currentNet,

                // Previous account position
                previous_pending:
                    oldPending,

                previous_deposit:
                    oldDeposit,

                // Net carry-forward from previous account
                carry_forward:
                    oldPending -
                    oldDeposit,

                // Total amount that should be settled
                net:
                    totalDue,

                // Actual money received now
                collected:
                    collectedAmountNumber,

                // Remaining unpaid amount after this payment
                balance:
                    finalBalance,

                // New genuine deposit created by this payment
                deposit:
                    actualDeposit,

                // Detailed allocation
                pending_used:
                    pendingUsed,

                current_fee_paid:
                    currentFeePaid,

                current_fee_remaining:
                    currentFeeRemaining,

                deposit_created:
                    depositCreated,

                final_pending:
                    finalPending,

                final_deposit:
                    finalDeposit
            };

            // =========================================================
            // PAYMENT YEAR
            // =========================================================

            const paymentYear =
                Number(
                    String(paymentDate).slice(0, 4)
                );

            // =========================================================
            // PAYLOAD
            // =========================================================

            const payload = {
                // -----------------------------------------------------
                // UNIQUE DB ROW UUID
                // -----------------------------------------------------
                uuid:
                    crypto.randomUUID(),

                // -----------------------------------------------------
                // STUDENT
                // -----------------------------------------------------
                student_uuid:
                    selectedStudent.uuid,

                // -----------------------------------------------------
                // TRANSACTION UUID
                // -----------------------------------------------------
                transaction_uuid:
                    transactionUuid,

                // -----------------------------------------------------
                // RECEIPT
                // -----------------------------------------------------
                receipt_number:
                    "",

                // -----------------------------------------------------
                // ACTUAL MONEY COLLECTED
                // -----------------------------------------------------
                amount:
                    collectedAmountNumber,

                // -----------------------------------------------------
                // FRONTEND CALCULATED BALANCE
                // -----------------------------------------------------
                //
                // Backend MUST recalculate this.
                //
                balance:
                    finalBalance,

                // -----------------------------------------------------
                // LATE FEE
                // -----------------------------------------------------
                late_fee:
                    effectiveLateFee,

                ignore_late_fee:
                    ignoreLateFee,

                // -----------------------------------------------------
                // PAYMENT DETAILS
                // -----------------------------------------------------
                payment_method:
                    paymentMethod,

                payment_date:
                    paymentDate,

                // -----------------------------------------------------
                // COMPATIBILITY MONTH
                // -----------------------------------------------------
                month:
                    selectedMonths[0] || null,

                year:
                    paymentYear,

                // -----------------------------------------------------
                // SELECTED MONTHS
                // -----------------------------------------------------
                selected_months:
                    JSON.stringify(
                        selectedMonths
                    ),

                months_count:
                    selectedMonths.length,

                // -----------------------------------------------------
                // CURRENT TRANSACTION TOTAL
                // -----------------------------------------------------
                //
                // IMPORTANT:
                // This is current fee only.
                // Previous pending/deposit are settlement data,
                // not part of current transaction_total.
                //
                transaction_total:
                    transactionTotal,

                // -----------------------------------------------------
                // MONTHLY FLAG
                // -----------------------------------------------------
                include_monthly:
                    hasMonthlyFee
                        ? 1
                        : 0,

                // -----------------------------------------------------
                // ONE-TIME FLAGS
                // -----------------------------------------------------
                include_admission:
                    admission > 0
                        ? 1
                        : 0,

                include_annual:
                    annual > 0
                        ? 1
                        : 0,

                include_exam:
                    exam > 0
                        ? 1
                        : 0,

                // -----------------------------------------------------
                // ACTIVITY FLAG
                // -----------------------------------------------------
                include_activity:
                    selectedMonths.some(
                        (month) =>
                            Number(
                                ledger[month]?.activity || 0
                            ) > 0
                    )
                        ? 1
                        : 0,

                // -----------------------------------------------------
                // COMMODITIES
                // -----------------------------------------------------
                include_commodities:
                    commodities > 0
                        ? 1
                        : 0,

                commodities_fee:
                    commodities,

                // -----------------------------------------------------
                // STUDENT ACTIVITIES
                // -----------------------------------------------------
                computer:
                    Number(
                        selectedStudent.computer || 0
                    ),

                abacus:
                    Number(
                        selectedStudent.abacus || 0
                    ),

                taekwondo:
                    Number(
                        selectedStudent.taekwondo || 0
                    ),

                // -----------------------------------------------------
                // SIBLING DISCOUNT
                // -----------------------------------------------------
                sibling_discount_enabled:
                    siblingDiscount > 0
                        ? 1
                        : 0,

                sibling_discount_amount:
                    siblingDiscount,

                // -----------------------------------------------------
                // SPECIAL DISCOUNT
                // -----------------------------------------------------
                special_discount:
                    specialDiscount,

                // -----------------------------------------------------
                // COMPLETE BREAKDOWN
                // -----------------------------------------------------
                fee_breakdown:
                    JSON.stringify(
                        feeBreakdown
                    ),

                // -----------------------------------------------------
                // FEE STRUCTURE
                // -----------------------------------------------------
                ignore_fee_structure:
                    ignoreFeeStructure
                        ? 1
                        : 0,

                ignored_fee_items:
                    JSON.stringify(
                        ignoredFeeItems || []
                    ),

                // -----------------------------------------------------
                // REMARKS
                // -----------------------------------------------------
                remarks:
                    remarks || null
            };

            // =========================================================
            // DEBUG
            // =========================================================

            console.log(
                "========== SAVE FEE DEBUG =========="
            );

            console.log(
                "Student:",
                selectedStudent.uuid
            );

            console.log(
                "Transaction UUID:",
                transactionUuid
            );

            console.log(
                "Selected Months:",
                selectedMonths
            );

            console.log(
                "Current Gross:",
                grossTotal
            );

            console.log(
                "Current Net:",
                currentNet
            );

            console.log(
                "Previous Pending:",
                oldPending
            );

            console.log(
                "Previous Deposit:",
                oldDeposit
            );

            console.log(
                "Total Due:",
                totalDue
            );

            console.log(
                "Collected:",
                collectedAmountNumber
            );

            console.log(
                "Pending Used:",
                pendingUsed
            );

            console.log(
                "Current Fee Paid:",
                currentFeePaid
            );

            console.log(
                "Current Fee Remaining:",
                currentFeeRemaining
            );

            console.log(
                "Deposit Created:",
                depositCreated
            );

            console.log(
                "Final Pending:",
                finalPending
            );

            console.log(
                "Final Deposit:",
                finalDeposit
            );

            console.log(
                "Final Balance:",
                finalBalance
            );

            console.log(
                "Transaction Total:",
                transactionTotal
            );

            console.log(
                "Payment Payload:",
                payload
            );

            console.log(
                "===================================="
            );

            // =========================================================
            // SAVE TO BACKEND
            // =========================================================

            const res = await axios.post(
                `${API}/addFee.php`,
                payload
            );

            // =========================================================
            // RESPONSE
            // =========================================================

            if (res.data.status) {
                alert(
                    res.data.message ||
                    "Fee saved successfully"
                );

                // =====================================================
                // SUCCESS
                // =====================================================
                //
                // Clear transaction UUID only after successful save.
                //
                transactionUuidRef.current = null;

                await loadFees();

                handleStudentSelect(
                    selectedStudent
                );

            } else {
                alert(
                    res.data.message ||
                    "Unable to save fee."
                );
            }

        } catch (err) {
            console.error(
                "Fee save error:",
                err
            );

            // =========================================================
            // IMPORTANT:
            // DO NOT clear transactionUuidRef here.
            //
            // If backend saved the transaction but response was lost,
            // retrying with same transaction_uuid lets backend detect
            // duplicate transaction safely.
            // =========================================================

            alert(
                err?.response?.data?.message ||
                "Unable to save fee. Please try again."
            );

        } finally {
            setSaving(false);
        }
    };


    // const saveEditedFee = async () => {

    //     try {

    //         const selectedMonths = [];

    //         const breakdown = JSON.parse(
    //             editingFee.fee_breakdown || "{}"
    //         );



    //         const feeBreakdown = {
    //             months: {},
    //             one_time: {},
    //             discounts: {},
    //             totals: {}
    //         };

    //         let transactionTotal = 0;

    //         academicMonths.forEach((month) => {

    //             if (!editReceipt.months[month]?.checked)
    //                 return;

    //             const tuition =
    //                 Number(editReceipt.months?.[month]?.tuition || 0);

    //             const activity =
    //                 Number(editReceipt.months?.[month]?.activity || 0);

    //             selectedMonths.push(month);

    //             feeBreakdown.months[month] = {
    //                 tuition,
    //                 activity,
    //                 total: tuition + activity
    //             };

    //             feeBreakdown.one_time = {

    //                 admission: Number(editReceipt.admission_fee || 0),
    //                 annual: Number(editReceipt.annual_fee || 0),
    //                 exam: Number(editReceipt.exam_fee || 0),
    //                 commodities: Number(editReceipt.commodities_fee || 0),
    //                 transport: Number(editReceipt.transport_fee || 0),
    //                 other: Number(editReceipt.other_fee || 0)

    //             };

    //             feeBreakdown.discounts = {

    //                 late_fee: Number(editReceipt.late_fee || 0),
    //                 sibling: Number(editReceipt.sibling_discount_amount || 0),
    //                 special: Number(editReceipt.special_discount || 0)

    //             };

    //             feeBreakdown.totals = {

    //                 collected: Number(editReceipt.amount || 0),
    //                 balance: Number(editReceipt.balance || 0),
    //                 gross: transactionTotal,
    //                 net:
    //                     transactionTotal -
    //                     Number(editReceipt.sibling_discount_amount || 0) -
    //                     Number(editReceipt.special_discount || 0)

    //             };

    //             transactionTotal += tuition + activity;

    //         });

    //         transactionTotal +=
    //             Number(editReceipt.admission_fee || 0) +
    //             Number(editReceipt.annual_fee || 0) +
    //             Number(editReceipt.exam_fee || 0) +
    //             Number(editReceipt.commodities_fee || 0) +
    //             Number(editReceipt.transport_fee || 0) +
    //             Number(editReceipt.other_fee || 0);

    //         transactionTotal += Number(editReceipt.late_fee || 0);

    //         transactionTotal -= Number(editReceipt.sibling_discount_amount || 0);

    //         transactionTotal -= Number(editReceipt.special_discount || 0);

    //         setOneTimeFees({
    //             admission: breakdown.one_time?.admission || 0,
    //             annual: breakdown.one_time?.annual || 0,
    //             exam: breakdown.one_time?.exam || 0,
    //             commodities: breakdown.one_time?.commodities || 0,
    //             transport: breakdown.one_time?.transport || 0,
    //             other: breakdown.one_time?.other || 0,
    //         });

    //         setDiscounts({
    //             lateFee: breakdown.discounts?.late_fee || 0,
    //             sibling: breakdown.discounts?.sibling || 0,
    //             special: breakdown.discounts?.special || 0,
    //         });

    //         setCollectedAmount(breakdown.totals?.collected || 0);

    //         // academicMonths.forEach(month => {

    //         //     const monthData = breakdown.months?.[month] || {};

    //         //     months[month] = {

    //         //         checked: selectedMonths.includes(month),

    //         //         tuition: monthData.tuition || 0,

    //         //         activity: monthData.activity || 0,

    //         //         total: monthData.total || 0

    //         //     };

    //         // });

    //         const payload = {

    //             uuid: editReceipt.uuid,

    //             payment_date: editReceipt.payment_date,

    //             payment_method: editReceipt.payment_method,

    //             amount: editReceipt.amount,

    //             balance: editTotals.balance,

    //             remarks: editReceipt.remarks,

    //             selected_months: selectedMonths,

    //             added_months: editReceipt.addedMonths || [],

    //             removed_months: editReceipt.removedMonths || [],

    //             transaction_total: editTotals.net,

    //             months_count: selectedMonths.length,

    //             include_monthly: 1,

    //             include_admission:
    //                 Number(editReceipt.admission_fee) > 0 ? 1 : 0,

    //             include_annual:
    //                 Number(editReceipt.annual_fee) > 0 ? 1 : 0,

    //             include_exam:
    //                 Number(editReceipt.exam_fee) > 0 ? 1 : 0,

    //             include_activity: 1,

    //             include_commodities:
    //                 Number(editReceipt.commodities_fee) > 0 ? 1 : 0,

    //             commodities_fee:
    //                 Number(editReceipt.commodities_fee || 0),

    //             computer: editReceipt.computer,

    //             abacus: editReceipt.abacus,

    //             taekwondo: editReceipt.taekwondo,

    //             late_fee:
    //                 Number(editReceipt.late_fee || 0),

    //             sibling_discount_enabled:
    //                 Number(editReceipt.sibling_discount_amount || 0) > 0 ? 1 : 0,

    //             sibling_discount_amount:
    //                 Number(editReceipt.sibling_discount_amount || 0),

    //             special_discount:
    //                 Number(editReceipt.special_discount || 0),

    //             fee_breakdown:
    //                 JSON.stringify(feeBreakdown),

    //             ignore_fee_structure: ignoreFeeStructure ? 1 : 0,

    //             ignored_fee_items: JSON.stringify(ignoredFeeItems)

    //         };

    //         const res = await axios.post(
    //             `${API}/editFee.php`,
    //             payload
    //         );

    //         if (
    //             !res.data.status &&
    //             res.data.message ===
    //             "Username, Password and Reason are required."
    //         ) {

    //             setPendingPayload(payload);

    //             setAuthOpen(true);

    //             return;
    //         }

    //     } catch (err) {

    //         console.log(err);

    //         alert("Unable to update receipt.");

    //     }

    // };

    // const authenticateAndSave = async () => {

    //     try {

    //         const payload = {

    //             ...pendingPayload,

    //             username: authData.username,

    //             password: authData.password,

    //             reason: authData.reason

    //         };

    //         const res = await axios.post(
    //             `${API}/editFee.php`,
    //             payload
    //         );

    //         if (res.data.status) {

    //             alert("Receipt Updated Successfully");

    //             setAuthOpen(false);

    //             setEditOpen(false);

    //             setPendingPayload(null);

    //             setAuthData({
    //                 username: "",
    //                 password: "",
    //                 reason: ""
    //             });

    //             await loadFees();

    //             if (selectedStudent) {
    //                 handleStudentSelect(selectedStudent);
    //             }

    //         } else {

    //             alert(res.data.message);

    //         }

    //     } catch (err) {

    //         console.log(err);

    //         alert("Unable to authenticate.");

    //     }

    // };

    // Above code has balance removed due to which accounting issues were happening ....

    let payload = null
    const saveEditedFee = async () => {
        try {
            const selectedMonths = [];

            const breakdown = JSON.parse(
                editingFee?.fee_breakdown || "{}"
            );

            const feeBreakdown = {
                months: {},
                one_time: {
                    admission: Number(editReceipt.admission_fee || 0),
                    annual: Number(editReceipt.annual_fee || 0),
                    exam: Number(editReceipt.exam_fee || 0),
                    commodities: Number(editReceipt.commodities_fee || 0),
                    transport: Number(editReceipt.transport_fee || 0),
                    other: Number(editReceipt.other_fee || 0)
                },
                discounts: {
                    late_fee: Number(editReceipt.late_fee || 0),
                    sibling: Number(
                        editReceipt.sibling_discount_amount || 0
                    ),
                    special: Number(
                        editReceipt.special_discount || 0
                    )
                },
                totals: {
                    collected: Number(editReceipt.amount || 0),
                    balance: 0,
                    gross: 0,
                    net: 0
                }
            };

            let transactionTotal = 0;

            /*
             * ==========================================
             * MONTHLY FEES
             * ==========================================
             */

            academicMonths.forEach((month) => {

                if (!editReceipt.months?.[month]?.checked) {
                    return;
                }

                const tuition = Number(
                    editReceipt.months?.[month]?.tuition || 0
                );

                const activity = Number(
                    editReceipt.months?.[month]?.activity || 0
                );

                selectedMonths.push(month);

                feeBreakdown.months[month] = {
                    tuition,
                    activity,
                    total: tuition + activity
                };

                transactionTotal +=
                    tuition + activity;
            });


            /*
             * ==========================================
             * ONE TIME FEES
             * ==========================================
             */

            transactionTotal +=
                Number(editReceipt.admission_fee || 0) +
                Number(editReceipt.annual_fee || 0) +
                Number(editReceipt.exam_fee || 0) +
                Number(editReceipt.commodities_fee || 0) +
                Number(editReceipt.transport_fee || 0) +
                Number(editReceipt.other_fee || 0);


            /*
             * ==========================================
             * LATE FEE
             * ==========================================
             */

            transactionTotal += Number(
                editReceipt.late_fee || 0
            );


            /*
             * ==========================================
             * DISCOUNTS
             * ==========================================
             */

            transactionTotal -= Number(
                editReceipt.sibling_discount_amount || 0
            );

            transactionTotal -= Number(
                editReceipt.special_discount || 0
            );


            /*
             * Never allow negative transaction due.
             */

            transactionTotal = Math.max(
                0,
                transactionTotal
            );


            /*
             * ==========================================
             * BREAKDOWN TOTALS
             *
             * IMPORTANT:
             *
             * balance is NOT calculated here.
             *
             * Backend settlement engine will calculate
             * the authoritative pending balance.
             * ==========================================
             */

            feeBreakdown.totals = {
                collected: Number(
                    editReceipt.amount || 0
                ),

                balance: 0,

                gross: transactionTotal,

                net: transactionTotal
            };


            /*
             * ==========================================
             * UPDATE UI SUPPORTING STATES
             * ==========================================
             */

            setOneTimeFees({
                admission:
                    breakdown.one_time?.admission || 0,

                annual:
                    breakdown.one_time?.annual || 0,

                exam:
                    breakdown.one_time?.exam || 0,

                commodities:
                    breakdown.one_time?.commodities || 0,

                transport:
                    breakdown.one_time?.transport || 0,

                other:
                    breakdown.one_time?.other || 0
            });


            setDiscounts({
                lateFee:
                    breakdown.discounts?.late_fee || 0,

                sibling:
                    breakdown.discounts?.sibling || 0,

                special:
                    breakdown.discounts?.special || 0
            });


            setCollectedAmount(
                breakdown.totals?.collected || 0
            );


            /*
             * ==========================================
             * AUTHORITATIVE FRONTEND PAYMENT
             *
             * This is the actual amount being paid
             * by the current edited receipt.
             *
             * DO NOT use editTotals.balance here.
             * ==========================================
             */

            const currentPayment = Math.max(
                0,
                Number(editReceipt.amount || 0)
            );


            /*
             * ==========================================
             * PAYLOAD
             * ==========================================
             */

            payload = {

                uuid: editReceipt.uuid,

                payment_date:
                    editReceipt.payment_date,

                payment_method:
                    editReceipt.payment_method,

                /*
                 * Actual current payment.
                 */
                amount: currentPayment,

                /*
                 * IMPORTANT:
                 *
                 * Do NOT send frontend balance.
                 *
                 * Backend calculates:
                 *
                 * previous pending
                 *      ↓
                 * current payment
                 *      ↓
                 * current fee
                 *      ↓
                 * final pending/deposit
                 *
                 * So balance is intentionally omitted.
                 */

                remarks:
                    editReceipt.remarks || "",


                /*
                 * ======================================
                 * MONTHS
                 * ======================================
                 */

                selected_months:
                    selectedMonths,

                added_months:
                    editReceipt.addedMonths || [],

                removed_months:
                    editReceipt.removedMonths || [],


                /*
                 * ======================================
                 * CURRENT TRANSACTION DUE
                 * ======================================
                 */

                transaction_total:
                    transactionTotal,

                months_count:
                    selectedMonths.length || 1,


                /*
                 * ======================================
                 * FEE FLAGS
                 * ======================================
                 */

                include_monthly:
                    selectedMonths.length > 0 ? 1 : 0,

                include_admission:
                    Number(editReceipt.admission_fee || 0) > 0
                        ? 1
                        : 0,

                include_annual:
                    Number(editReceipt.annual_fee || 0) > 0
                        ? 1
                        : 0,

                include_exam:
                    Number(editReceipt.exam_fee || 0) > 0
                        ? 1
                        : 0,

                include_activity:
                    1,

                include_commodities:
                    Number(editReceipt.commodities_fee || 0) > 0
                        ? 1
                        : 0,


                /*
                 * ======================================
                 * OTHER FEES
                 * ======================================
                 */

                commodities_fee:
                    Number(
                        editReceipt.commodities_fee || 0
                    ),

                computer:
                    Number(editReceipt.computer || 0),

                abacus:
                    Number(editReceipt.abacus || 0),

                taekwondo:
                    Number(editReceipt.taekwondo || 0),

                late_fee:
                    Number(
                        editReceipt.late_fee || 0
                    ),


                /*
                 * ======================================
                 * DISCOUNTS
                 * ======================================
                 */

                sibling_discount_enabled:
                    Number(
                        editReceipt.sibling_discount_amount || 0
                    ) > 0
                        ? 1
                        : 0,

                sibling_discount_amount:
                    Number(
                        editReceipt.sibling_discount_amount || 0
                    ),

                special_discount:
                    Number(
                        editReceipt.special_discount || 0
                    ),


                /*
                 * ======================================
                 * BREAKDOWN
                 * ======================================
                 */

                fee_breakdown:
                    JSON.stringify(feeBreakdown),


                /*
                 * ======================================
                 * IGNORED FEE STRUCTURE
                 * ======================================
                 */

                ignore_fee_structure:
                    ignoreFeeStructure ? 1 : 0,

                ignored_fee_items:
                    JSON.stringify(
                        ignoredFeeItems || []
                    )
            };


            /*
             * ==========================================
             * DEBUG
             *
             * Temporary. Testing complete hone ke baad
             * isko remove kar sakte ho.
             * ==========================================
             */

            console.log(
                "EDIT FEE PAYLOAD:",
                payload
            );


            /*
             * ==========================================
             * API REQUEST
             * ==========================================
             */

            const res = await axios.post(
                `${API}/editFee.php`,
                payload
            );

            console.log("EDIT RESPONSE:", res);
            console.log("EDIT RESPONSE DATA:", res.data);
            console.log("STATUS:", res.data?.status);
            console.log("MESSAGE:", JSON.stringify(res.data?.message));
            console.log(
                "AUTH CONDITION:",
                !res.data?.status &&
                res.data?.message ===
                "Username, Password and Reason are required."
            );


            /*
             * ==========================================
             * ADMIN AUTH REQUIRED
             * ==========================================
             */

            if (
                !res.data.status &&
                res.data.message ===
                "Username, Password and Reason are required."
            ) {

                setPendingPayload(payload);

                setAuthOpen(true);

                return;
            }


            /*
             * ==========================================
             * SUCCESS
             * ==========================================
             */

            if (res.data.status) {

                console.log(
                    "EDIT SETTLEMENT RESULT:",
                    {
                        previousPending:
                            res.data.previous_pending,

                        pendingUsed:
                            res.data.pending_used,

                        currentFeePaid:
                            res.data.current_fee_paid,

                        currentDeposit:
                            res.data.current_deposit,

                        finalPending:
                            res.data.pending,

                        finalDeposit:
                            res.data.deposit,

                        balance:
                            res.data.balance
                    }
                );


                alert(
                    `Receipt Updated Successfully\n\n` +
                    `Pending: ₹${Number(
                        res.data.pending || 0
                    ).toFixed(2)}\n` +
                    `Deposit: ₹${Number(
                        res.data.deposit || 0
                    ).toFixed(2)}`
                );


                setEditOpen(false);

                setPendingPayload(null);


                /*
                 * Reload fee list.
                 */

                await loadFees();


                /*
                 * Reload selected student.
                 */

                if (selectedStudent) {

                    handleStudentSelect(
                        selectedStudent
                    );
                }

            } else {

                alert(
                    res.data.message ||
                    "Unable to update receipt."
                );
            }

        } catch (err) {
            console.log(
                "saveEditedFee error:",
                err
            );

            console.log(
                "Server response:",
                err?.response?.data
            );

            const responseData = err?.response?.data;

            // ==========================================
            // ADMIN AUTH REQUIRED
            // Backend returns HTTP 403
            // ==========================================
            if (
                err?.response?.status === 403 &&
                responseData?.message ===
                "Username, Password and Reason are required."
            ) {
                console.log(
                    "ADMIN AUTH REQUIRED - OPENING AUTH MODAL"
                );

                setPendingPayload(payload);

                setAuthData({
                    username: "",
                    password: "",
                    reason: ""
                });

                setAuthOpen(true);

                return;
            }

            alert(
                responseData?.message ||
                "Unable to update receipt."
            );
        }
    };


    /*
     * =====================================================
     * ADMIN AUTHENTICATION + SAVE
     * =====================================================
     */

    const authenticateAndSave = async () => {

        try {

            if (!pendingPayload) {

                alert(
                    "No pending edit found."
                );

                return;
            }


            const payload = {

                ...pendingPayload,

                username:
                    authData.username,

                password:
                    authData.password,

                reason:
                    authData.reason
            };


            console.log(
                "AUTHENTICATED EDIT PAYLOAD:",
                payload
            );


            const res = await axios.post(
                `${API}/editFee.php`,
                payload
            );


            /*
             * ==========================================
             * SUCCESS
             * ==========================================
             */

            if (res.data.status) {

                console.log(
                    "AUTH EDIT SETTLEMENT RESULT:",
                    {
                        previousPending:
                            res.data.previous_pending,

                        pendingUsed:
                            res.data.pending_used,

                        currentFeePaid:
                            res.data.current_fee_paid,

                        currentDeposit:
                            res.data.current_deposit,

                        finalPending:
                            res.data.pending,

                        finalDeposit:
                            res.data.deposit,

                        balance:
                            res.data.balance
                    }
                );


                alert(
                    `Receipt Updated Successfully\n\n` +
                    `Pending: ₹${Number(
                        res.data.pending || 0
                    ).toFixed(2)}\n` +
                    `Deposit: ₹${Number(
                        res.data.deposit || 0
                    ).toFixed(2)}`
                );


                /*
                 * Close authentication modal.
                 */

                setAuthOpen(false);


                /*
                 * Close edit modal.
                 */

                setEditOpen(false);


                /*
                 * Clear pending payload.
                 */

                setPendingPayload(null);


                /*
                 * Clear authentication fields.
                 */

                setAuthData({
                    username: "",
                    password: "",
                    reason: ""
                });


                /*
                 * Reload fees.
                 */

                await loadFees();


                /*
                 * Reload selected student.
                 */

                if (selectedStudent) {

                    handleStudentSelect(
                        selectedStudent
                    );
                }

            } else {

                alert(
                    res.data.message ||
                    "Unable to authenticate."
                );
            }

        } catch (err) {

            console.log(
                "authenticateAndSave error:",
                err
            );

            console.log(
                "Server response:",
                err?.response?.data
            );

            alert(
                err?.response?.data?.message ||
                "Unable to authenticate."
            );
        }
    };

    // const summaryRows = [
    //     ...academicMonths.map(month => [
    //         month,
    //         paymentHistory.monthly[month] || null
    //     ]),
    //     ["Admission Fee", paymentHistory.admission],
    //     ["Annual Fee", paymentHistory.annual],
    //     ["Exam Fee", paymentHistory.exam],
    //     ["Commodity Fee", paymentHistory.commodities],
    //     ["Transport Fee", paymentHistory.transport],
    //     ["Other Fee", paymentHistory.other],
    // ];

    // To show the complete clarity ..............

    // const summaryRows = academicMonths
    //     .map((month) => {
    //         const item = paymentHistory.monthly?.[month];

    //         return {
    //             month,
    //             item: item || null
    //         };
    //     })
    //     .filter(({ item }) => item);

    // This fails badly changing the code ............
    const summaryRows = summaryFees.map((fee) => {
        let months = [];

        // =========================================================
        // PARSE SELECTED MONTHS
        // =========================================================
        if (Array.isArray(fee.selected_months)) {
            months = fee.selected_months;
        } else if (
            typeof fee.selected_months === "string" &&
            fee.selected_months.trim() !== ""
        ) {
            try {
                months = JSON.parse(fee.selected_months);

                if (typeof months === "string") {
                    months = JSON.parse(months);
                }
            } catch {
                months = fee.selected_months
                    .split(",")
                    .map((m) => m.trim())
                    .filter(Boolean);
            }
        }

        if (!Array.isArray(months) && fee.month) {
            months = [fee.month];
        }

        if (!Array.isArray(months)) {
            months = [];
        }

        // =========================================================
        // FEE BREAKDOWN
        // =========================================================
        let tuitionTotal = 0;
        let activityTotal = 0;
        let monthlyTotal = 0;

        let feeBreakdown = {};

        if (fee.fee_breakdown) {
            try {
                feeBreakdown =
                    typeof fee.fee_breakdown === "string"
                        ? JSON.parse(fee.fee_breakdown)
                        : fee.fee_breakdown;

                if (typeof feeBreakdown === "string") {
                    feeBreakdown = JSON.parse(feeBreakdown);
                }
            } catch (err) {
                console.error(
                    "Unable to parse fee breakdown:",
                    err
                );

                feeBreakdown = {};
            }
        }

        Object.values(
            feeBreakdown.months || {}
        ).forEach((monthData) => {
            tuitionTotal += Number(
                monthData?.tuition || 0
            );

            activityTotal += Number(
                monthData?.activity || 0
            );

            monthlyTotal += Number(
                monthData?.total || 0
            );
        });

        return {
            fee,
            months,
            tuitionTotal,
            activityTotal,
            monthlyTotal
        };
    });

    return (

        <Layout>
            <Box p={2}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                    >
                        Fee Ledger
                    </Typography>

                    <Button
                        variant="outlined"
                        onClick={() => navigate("/fee-history")}
                    >
                        View Student Fee History
                    </Button>
                </Stack>

                <Card sx={{ mb: 2 }}>
                    <CardContent>

                        <Typography variant="h6" gutterBottom>
                            Student Details
                        </Typography>

                        <Autocomplete
                            options={students}
                            value={selectedStudent}
                            getOptionLabel={(option) =>
                                `${option.name} (${option.class}-${option.section})`
                            }
                            onChange={(e, value) =>
                                handleStudentSelect(value)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Student"
                                />
                            )}
                        />

                        <Grid container spacing={2} mt={1}>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Class"
                                    value={selectedStudent?.class || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Section"
                                    value={selectedStudent?.section || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Admission No"
                                    value={selectedStudent?.admission_no || ""}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Grid>

                        </Grid>

                    </CardContent>
                </Card>

                {/* <Card sx={{ mt: 2 }}>
                    <CardContent>

                        <Typography variant="h6" gutterBottom>
                            Payment Summary
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <TableContainer component={Paper}>
                            <Table>

                                <TableHead>
                                    <TableRow>
                                        <TableCell>Fee</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Amount</TableCell>
                                        <TableCell>Receipt</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>



                                <TableBody>

                                    {summaryRows.map(([title, item]) => (

                                        <TableRow key={title}>

                                            <TableCell>{title}</TableCell>

                                            <TableCell>
                                                <Chip
                                                    size="small"
                                                    color={item ? "success" : "warning"}
                                                    label={item ? "Paid" : "Pending"}
                                                />
                                            </TableCell>

                                            <TableCell>
                                                {item ? `₹${item.amount}` : "-"}
                                            </TableCell>

                                            <TableCell>
                                                {item ? item.receipt : "-"}
                                            </TableCell>

                                            <TableCell>
                                                {item ? item.date : "-"}
                                            </TableCell>

                                        </TableRow>

                                    ))}

                                </TableBody>

                            </Table>
                        </TableContainer>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Deposit"
                                    value={paymentHistory.deposit}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Pending"
                                    value={paymentHistory.pending}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                        </Grid>

                    </CardContent>
                </Card> */}

                {/* Above code fails to make user understand of the transactions in a better way ........ */}

                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Payment Summary
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <TableContainer
                            component={Paper}
                            sx={{
                                maxHeight: 500,
                                overflow: "auto"
                            }}
                        >
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <b>Month</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Date</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Receipt</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Tuition</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Activity</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Transaction Total</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Collected</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Balance</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Payment Method</b>
                                        </TableCell>

                                        <TableCell>
                                            <b>Remarks</b>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {summaryRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={10}
                                                align="center"
                                            >
                                                No payment history found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        summaryRows.map(
                                            ({
                                                fee,
                                                months,
                                                tuitionTotal,
                                                activityTotal,
                                                monthlyTotal
                                            }) => {
                                                const transactionTotal =
                                                    Number(
                                                        fee.transaction_total ||
                                                        monthlyTotal ||
                                                        0
                                                    );

                                                const collected =
                                                    Number(
                                                        fee.amount || 0
                                                    );

                                                const balance =
                                                    Number(
                                                        fee.balance || 0
                                                    );

                                                return (
                                                    <TableRow
                                                        key={
                                                            fee.transaction_uuid ||
                                                            fee.uuid
                                                        }
                                                        hover
                                                    >
                                                        {/* MONTH */}
                                                        <TableCell>
                                                            <b>
                                                                {months.length
                                                                    ? months.join(
                                                                        ", "
                                                                    )
                                                                    : fee.month ||
                                                                    "-"}
                                                            </b>
                                                        </TableCell>

                                                        {/* DATE */}
                                                        <TableCell>
                                                            {fee.payment_date ||
                                                                "-"}
                                                        </TableCell>

                                                        {/* RECEIPT */}
                                                        <TableCell>
                                                            {fee.receipt_number ||
                                                                "-"}
                                                        </TableCell>

                                                        {/* TUITION */}
                                                        <TableCell>
                                                            ₹
                                                            {tuitionTotal.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>

                                                        {/* ACTIVITY */}
                                                        <TableCell>
                                                            ₹
                                                            {activityTotal.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>

                                                        {/* TRANSACTION TOTAL */}
                                                        <TableCell>
                                                            ₹
                                                            {transactionTotal.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>

                                                        {/* COLLECTED */}
                                                        <TableCell>
                                                            ₹
                                                            {collected.toFixed(
                                                                2
                                                            )}
                                                        </TableCell>

                                                        {/* BALANCE */}
                                                        <TableCell>
                                                            {balance > 0 ? (
                                                                <Chip
                                                                    size="small"
                                                                    color="warning"
                                                                    label={`Pending ₹${balance.toFixed(
                                                                        2
                                                                    )}`}
                                                                />
                                                            ) : (
                                                                <Chip
                                                                    size="small"
                                                                    color="success"
                                                                    label="Settled"
                                                                />
                                                            )}
                                                        </TableCell>

                                                        {/* PAYMENT METHOD */}
                                                        <TableCell>
                                                            {fee.payment_method
                                                                ? fee.payment_method.toUpperCase()
                                                                : "-"}
                                                        </TableCell>

                                                        {/* REMARKS */}
                                                        <TableCell>
                                                            {fee.remarks || "-"}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Total Collected"
                                    value={`₹${summaryFees
                                        .reduce(
                                            (total, fee) =>
                                                total +
                                                Number(
                                                    fee.amount || 0
                                                ),
                                            0
                                        )
                                        .toFixed(2)}`}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Deposit"
                                    value={`₹${Number(
                                        paymentHistory?.deposit || 0
                                    ).toFixed(2)}`}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Pending"
                                    value={`₹${summaryFees
                                        .reduce(
                                            (total, fee) =>
                                                total +
                                                Number(
                                                    fee.balance || 0
                                                ),
                                            0
                                        )
                                        .toFixed(2)}`}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                        </Grid> */}
                        {/* Above code has some calculation mismatch 
                        due to latest paymnt summary format change */}
                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Total Collected"
                                    value={`₹${summaryFees
                                        .reduce(
                                            (total, fee) =>
                                                total + Number(fee.amount || 0),
                                            0
                                        )
                                        .toFixed(2)}`}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Deposit"
                                    value={`₹${Number(
                                        paymentHistory?.deposit || 0
                                    ).toFixed(2)}`}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    label="Pending"
                                    value={`₹${Math.max(
                                        0,
                                        summaryFees.reduce(
                                            (total, fee) =>
                                                total +
                                                Math.max(
                                                    0,
                                                    Number(fee.transaction_total || 0)
                                                ),
                                            0
                                        ) -
                                        summaryFees.reduce(
                                            (total, fee) =>
                                                total + Number(fee.amount || 0),
                                            0
                                        )
                                    ).toFixed(2)}`}
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card>

                    <CardContent>

                        <Typography variant="h6" gutterBottom>
                            Monthly Ledger
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <TableContainer component={Paper}>

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>Month</TableCell>

                                        <TableCell>Tuition</TableCell>

                                        <TableCell>Activity</TableCell>

                                        <TableCell width={120}>
                                            Status
                                        </TableCell>

                                        <TableCell>Receipt</TableCell>
                                        <TableCell align="center">Actions</TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {academicMonths.map((month) => (

                                        <TableRow key={month}>

                                            <TableCell>
                                                {month}
                                            </TableCell>

                                            <TableCell>

                                                <TextField
                                                    disabled={ledger[month].tutionPaid}
                                                    size="small"
                                                    type="number"
                                                    value={ledger[month].tuition}
                                                    placeholder={ledger[month].defaultTuition}
                                                    onChange={(e) =>
                                                        updateLedger(
                                                            month,
                                                            "tuition",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </TableCell>

                                            <TableCell>

                                                <TextField
                                                    disabled={ledger[month].activityPaid}
                                                    size="small"
                                                    type="number"
                                                    value={ledger[month].activity}
                                                    placeholder={ledger[month].defaultActivity}
                                                    onChange={(e) =>
                                                        updateLedger(
                                                            month,
                                                            "activity",
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </TableCell>


                                            <TableCell>

                                                <Chip
                                                    size="small"
                                                    color={
                                                        ledger[month].paid
                                                            ? "success"
                                                            : ledger[month].tuitionPaid ||
                                                                ledger[month].activityPaid
                                                                ? "info"
                                                                : "warning"
                                                    }
                                                    label={
                                                        ledger[month].paid
                                                            ? "Paid"
                                                            : ledger[month].tuitionPaid ||
                                                                ledger[month].activityPaid
                                                                ? "Partial"
                                                                : "Pending"
                                                    }
                                                />

                                            </TableCell>

                                            <TableCell>

                                                {ledger[month].receipt || "-"}

                                            </TableCell>

                                            <TableCell align="center">

                                                {(ledger[month].tuitionPaid ||
                                                    ledger[month].activityPaid) && (
                                                        <Stack
                                                            direction="row"
                                                            spacing={1}
                                                            justifyContent="center"
                                                        >
                                                            <Tooltip title="View Receipt">
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        viewReceipt(ledger[month].fee)
                                                                    }
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Edit Month">
                                                                <IconButton
                                                                    color="warning"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        editMonth(ledger[month].fee, month)
                                                                    }
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Delete Month">
                                                                <IconButton
                                                                    color="error"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        deleteMonth(ledger[month].fee, month)
                                                                    }
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Stack>
                                                    )}

                                            </TableCell>

                                        </TableRow>

                                    ))}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    </CardContent>

                </Card>

                <Card sx={{ mt: 2 }}>
                    <CardContent>

                        <Typography variant="h6" gutterBottom>
                            One Time Fees
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>

                            {[
                                {
                                    key: "admission",
                                    label: "Admission Fee",
                                    fee: paidOneTimeFees.admission
                                },
                                {
                                    key: "annual",
                                    label: "Annual Fee",
                                    fee: paidOneTimeFees.annual
                                },
                                {
                                    key: "exam",
                                    label: "Exam Fee",
                                    fee: paidOneTimeFees.exam
                                },
                                {
                                    key: "commodities",
                                    label: "Commodity Fee",
                                    fee: paidOneTimeFees.commodities
                                },
                                {
                                    key: "transport",
                                    label: "Transport Fee",
                                    fee: paidOneTimeFees.transport
                                },
                                {
                                    key: "other",
                                    label: "Other Fee",
                                    fee: paidOneTimeFees.other
                                },
                            ].map((item) => {

                                const isPaid = !!item.fee;

                                const isEditing =
                                    editingOneTimeFee === item.key;

                                return (
                                    <Grid
                                        item
                                        xs={12}
                                        md={4}
                                        key={item.key}
                                    >

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >

                                            <TextField
                                                fullWidth
                                                type="number"
                                                label={item.label}
                                                disabled={isPaid && !isEditing}
                                                value={oneTimeFees[item.key] || ""}
                                                placeholder="Enter amount"
                                                onChange={(e) =>
                                                    setOneTimeFees(prev => ({
                                                        ...prev,
                                                        [item.key]: e.target.value
                                                    }))
                                                }
                                            />

                                            {/* {isPaid && (
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                    alignItems="center"
                                                >

                                                    <Chip
                                                        size="small"
                                                        color="success"
                                                        label="Paid"
                                                    />

                                                    {!isEditing ? (
                                                        <>
                                                            <Tooltip title="Edit Fee">
                                                                <IconButton
                                                                    color="warning"
                                                                    size="small"
                                                                    onClick={() => {
                                                                        setEditingOneTimeFee(item.key);

                                                                        // Load existing paid amount
                                                                        setOneTimeFees(prev => ({
                                                                            ...prev,
                                                                            [item.key]: item.fee.amount
                                                                        }));
                                                                    }}
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="View Receipt">
                                                                <IconButton
                                                                    color="primary"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        viewReceipt(item.fee)
                                                                    }
                                                                >
                                                                    <VisibilityIcon />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Delete Fee">
                                                                <IconButton
                                                                    color="error"
                                                                    size="small"
                                                                    onClick={() =>
                                                                        deleteMonth(item.fee)
                                                                    }
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <Tooltip title="Cancel Edit">
                                                            <IconButton
                                                                color="inherit"
                                                                size="small"
                                                                onClick={() =>
                                                                    setEditingOneTimeFee(null)
                                                                }
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}

                                                </Stack>
                                            )} */}

                                        </Stack>

                                    </Grid>
                                );
                            })}

                        </Grid>

                    </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>

                    <CardContent>

                        <Typography variant="h6">
                            Discounts
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Late Fee"
                                    type="number"
                                    value={discounts.lateFee}
                                    placeholder="Enter amount"
                                    onChange={(e) =>
                                        setDiscounts(prev => ({
                                            ...prev,
                                            lateFee: e.target.value
                                        }))
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Sibling Discount"
                                    value={discounts.sibling}
                                    onChange={(e) =>
                                        setDiscounts(prev => ({
                                            ...prev,
                                            sibling: e.target.value
                                        }))
                                    }
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Special Discount"
                                    value={discounts.special}
                                    onChange={(e) =>
                                        setDiscounts(prev => ({
                                            ...prev,
                                            special: e.target.value
                                        }))
                                    }
                                />
                            </Grid>

                            {/* <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={ignoreFeeStructure}
                                        onChange={(e) =>
                                            setIgnoreFeeStructure(e.target.checked)
                                        }
                                    />
                                }
                                label="Ignore Fee Structure Costing"
                            />

                            {ignoreFeeStructure && (

                                <Box
                                    sx={{
                                        border: "1px solid #ddd",
                                        p: 2,
                                        borderRadius: 2,
                                        mt: 1
                                    }}
                                >

                                    <Typography fontWeight={600}>
                                        Ignore these while calculating balance
                                    </Typography>

                                    <FormGroup>

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.monthly}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            monthly: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Monthly Fee"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.activity}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            activity: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Activity Fee"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.annual}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            annual: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Annual Fee"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.exam}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            exam: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Exam Fee"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.admission}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            admission: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Admission Fee"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.commodities}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            commodities: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Commodities Fee"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.transport}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            transport: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Transport Fee"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={ignoredFeeItems.other}
                                                    onChange={(e) =>
                                                        setIgnoredFeeItems(prev => ({
                                                            ...prev,
                                                            other: e.target.checked
                                                        }))
                                                    }
                                                />}
                                            label="Other Fee"
                                        />

                                    </FormGroup>

                                </Box>

                            )}
 Will make it better later .....*/}
                        </Grid>

                    </CardContent>

                </Card>

                <Card sx={{ mt: 2 }}>

                    <CardContent>

                        <Typography variant="h6">
                            Totals
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>

                            <Grid item xs={12} md={2.4}>
                                <TextField
                                    label="Gross"
                                    value={grossTotal}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <TextField
                                    label="Current Net"
                                    value={netTotal}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <TextField
                                    label="Previous Pending"
                                    value={previousPending}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={2.4}>
                                <TextField
                                    label="Previous Deposit"
                                    value={previousDeposit}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                            {/* <Grid item xs={12} md={2.4}>
                                <TextField
                                    label="Amount Due"
                                    value={adjustedNetTotal}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid> */}

                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="Collected"
                                    type="number"
                                    value={collectedAmount}
                                    onChange={(e) =>
                                        setCollectedAmount(e.target.value)
                                    }
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <TextField
                                    label={
                                        balance > 0
                                            ? "Pending"
                                            : balance < 0
                                                ? "Deposit"
                                                : "Status"
                                    }
                                    value={
                                        balance > 0
                                            ? balance
                                            : balance < 0
                                                ? Math.abs(balance)
                                                : "Settled"
                                    }
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>

                <Card sx={{ mt: 2 }}>

                    <CardContent>

                        <Typography variant="h6">
                            Payment Details
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2}>

                            <Grid item xs={12} md={4}>

                                <TextField
                                    select
                                    fullWidth
                                    label="Payment Method"
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                >

                                    {paymentMethods.map(method => (

                                        <MenuItem
                                            key={method}
                                            value={method}
                                        >

                                            {method.toUpperCase()}

                                        </MenuItem>

                                    ))}

                                </TextField>

                            </Grid>

                            <Grid item xs={12} md={4}>

                                <TextField
                                    type="date"
                                    label="Payment Date"
                                    value={paymentDate}
                                    onChange={(e) =>
                                        setPaymentDate(e.target.value)
                                    }
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    fullWidth
                                />

                            </Grid>

                            <Grid item xs={12}>

                                <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    label="Remarks"
                                    value={remarks}
                                    onChange={(e) =>
                                        setRemarks(e.target.value)
                                    }
                                />
                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>

                <Card sx={{ mt: 2 }}>
                    <CardContent>

                        <Stack
                            direction="row"
                            justifyContent="flex-end"
                        >

                            <Button
                                variant="contained"
                                size="large"
                                onClick={saveLedger}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Fee"}
                            </Button>

                        </Stack>

                    </CardContent>
                </Card>

                <Dialog
                    open={authOpen}
                    onClose={() => setAuthOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >

                    <DialogTitle>
                        Authentication Required
                    </DialogTitle>

                    <DialogContent>

                        <Stack spacing={2} mt={1}>

                            <TextField
                                label="Username"
                                value={authData.username}
                                onChange={(e) =>
                                    setAuthData(prev => ({
                                        ...prev,
                                        username: e.target.value
                                    }))
                                }
                                fullWidth
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={authData.password}
                                onChange={(e) =>
                                    setAuthData(prev => ({
                                        ...prev,
                                        password: e.target.value
                                    }))
                                }
                                fullWidth
                            />

                            <TextField
                                label="Reason"
                                multiline
                                rows={3}
                                value={authData.reason}
                                onChange={(e) =>
                                    setAuthData(prev => ({
                                        ...prev,
                                        reason: e.target.value
                                    }))
                                }
                                fullWidth
                            />

                        </Stack>

                    </DialogContent>

                    <DialogActions>

                        <Button
                            onClick={() => {

                                setAuthOpen(false);

                                setPendingPayload(null);

                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={authenticateAndSave}
                        >
                            Authenticate & Save
                        </Button>

                    </DialogActions>

                </Dialog>

                <Dialog
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >

                    <DialogTitle>

                        Edit Receipt

                    </DialogTitle>

                    <DialogContent>
                        <Card variant="outlined">

                            <CardContent>

                                <TableContainer component={Paper} sx={{ mt: 2 }}>

                                    <Table>

                                        <TableHead>

                                            <TableRow>

                                                <TableCell>Month</TableCell>

                                                <TableCell>Tuition</TableCell>

                                                <TableCell>Activity</TableCell>

                                                <TableCell>Total</TableCell>

                                            </TableRow>

                                        </TableHead>

                                        <TableBody>

                                            {academicMonths.map((month) => (

                                                <TableRow key={month}>

                                                    <TableCell>

                                                        <Checkbox

                                                            checked={
                                                                editReceipt?.months?.[month]?.checked || false
                                                            }

                                                            onChange={(e) =>

                                                                setEditReceipt(prev => ({

                                                                    ...prev,

                                                                    months: {

                                                                        ...prev.months,

                                                                        [month]: {

                                                                            ...prev.months[month],

                                                                            checked: e.target.checked

                                                                        }

                                                                    }

                                                                }))

                                                            }

                                                        />

                                                        {month}

                                                    </TableCell>

                                                    <TableCell>

                                                        <TextField

                                                            size="small"

                                                            type="number"

                                                            value={
                                                                editReceipt?.months?.[month]?.tuition || 0
                                                            }

                                                            onChange={(e) =>
                                                                updateEditMonth(
                                                                    month,
                                                                    "tuition",
                                                                    e.target.value
                                                                )
                                                            }

                                                        />

                                                    </TableCell>

                                                    <TableCell>

                                                        <TextField

                                                            size="small"

                                                            type="number"

                                                            value={
                                                                editReceipt?.months?.[month]?.activity || 0
                                                            }

                                                            onChange={(e) =>
                                                                updateEditMonth(
                                                                    month,
                                                                    "activity",
                                                                    e.target.value
                                                                )
                                                            }

                                                        />

                                                    </TableCell>

                                                    <TableCell>

                                                        {Number(
                                                            editReceipt?.months?.[month]?.tuition || 0
                                                        ) +

                                                            Number(
                                                                editReceipt?.months?.[month]?.activity || 0
                                                            )}

                                                    </TableCell>

                                                </TableRow>

                                            ))}

                                        </TableBody>

                                    </Table>

                                </TableContainer>
                            </CardContent>

                        </Card>

                        <Card sx={{ mt: 2 }}>

                            <CardContent>

                                <Typography variant="h6">
                                    One Time Fees
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>

                                    {[
                                        { key: "admission_fee", label: "Admission Fee" },
                                        { key: "annual_fee", label: "Annual Fee" },
                                        { key: "exam_fee", label: "Exam Fee" },
                                        { key: "commodities_fee", label: "Commodity Fee" },
                                        { key: "transport_fee", label: "Transport Fee" },
                                        { key: "other_fee", label: "Other Fee" }
                                    ].map(item => (

                                        <Grid item xs={12} md={4} key={item.key}>

                                            <TextField

                                                fullWidth

                                                type="number"

                                                label={item.label}

                                                value={editReceipt?.[item.key] || 0}

                                                onChange={(e) =>

                                                    updateEditField(
                                                        item.key,
                                                        Number(e.target.value)
                                                    )

                                                }

                                            />

                                        </Grid>

                                    ))}

                                </Grid>

                            </CardContent>

                        </Card>

                        <Card sx={{ mt: 2 }}>

                            <CardContent>

                                <Typography variant="h6">
                                    Discounts
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>

                                    <Grid item xs={12} md={4}>

                                        <TextField

                                            fullWidth

                                            label="Late Fee"

                                            value={editReceipt?.late_fee || 0}

                                            InputProps={{
                                                readOnly: true
                                            }}

                                        />

                                    </Grid>

                                    <Grid item xs={12} md={4}>

                                        <TextField

                                            fullWidth

                                            type="number"

                                            label="Sibling Discount"

                                            value={editReceipt?.sibling_discount_amount || 0}

                                            onChange={(e) =>

                                                updateEditField(
                                                    "sibling_discount_amount",
                                                    Number(e.target.value)
                                                )

                                            }

                                        />

                                    </Grid>

                                    <Grid item xs={12} md={4}>

                                        <TextField

                                            fullWidth

                                            type="number"

                                            label="Special Discount"

                                            value={editReceipt?.special_discount || 0}

                                            onChange={(e) =>

                                                updateEditField(
                                                    "special_discount",
                                                    Number(e.target.value)
                                                )

                                            }

                                        />

                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                        <Card sx={{ mt: 2 }}>

                            <CardContent>

                                <Typography variant="h6">
                                    Totals
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>

                                    <Grid item xs={12} md={3}>

                                        <TextField

                                            fullWidth

                                            label="Gross"

                                            value={editTotals.gross}

                                            InputProps={{
                                                readOnly: true
                                            }}

                                        />

                                    </Grid>

                                    <Grid item xs={12} md={3}>

                                        <TextField

                                            fullWidth

                                            label="Net"

                                            value={editTotals.net}

                                            InputProps={{
                                                readOnly: true
                                            }}

                                        />

                                    </Grid>

                                    <Grid item xs={12} md={3}>

                                        <TextField

                                            fullWidth

                                            label="Collected"

                                            type="number"

                                            value={editReceipt?.amount || 0}

                                            onChange={(e) =>

                                                updateEditField(
                                                    "amount",
                                                    Number(e.target.value)
                                                )

                                            }

                                        />

                                    </Grid>

                                    <Grid item xs={12} md={3}>

                                        <TextField

                                            fullWidth

                                            label={
                                                editTotals.balance > 0
                                                    ? "Pending"
                                                    : editTotals.balance < 0
                                                        ? "Deposit"
                                                        : "Status"
                                            }
                                            value={
                                                editTotals.balance > 0
                                                    ? editTotals.balance
                                                    : editTotals.balance < 0
                                                        ? Math.abs(editTotals.balance)
                                                        : "Settled"
                                            }
                                            InputProps={{
                                                readOnly: true
                                            }}

                                        />

                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                        <Card sx={{ mt: 2 }}>

                            <CardContent>

                                <Typography variant="h6">
                                    Payment Details
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>

                                    <Grid item xs={12} md={4}>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Payment Method"
                                            value={editReceipt?.payment_method || "cash"}
                                            onChange={(e) =>
                                                updateEditField(
                                                    "payment_method",
                                                    e.target.value
                                                )
                                            }
                                        >

                                            {paymentMethods.map(method => (

                                                <MenuItem
                                                    key={method}
                                                    value={method}
                                                >

                                                    {method.toUpperCase()}

                                                </MenuItem>

                                            ))}

                                        </TextField>

                                    </Grid>

                                    <Grid item xs={12} md={4}>

                                        <TextField
                                            type="date"
                                            fullWidth
                                            label="Payment Date"
                                            value={editReceipt?.payment_date || ""}
                                            onChange={(e) =>
                                                updateEditField(
                                                    "payment_date",
                                                    e.target.value
                                                )
                                            }
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />

                                    </Grid>

                                    <Grid item xs={12}>

                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Remarks"
                                            value={editReceipt?.remarks || ""}
                                            onChange={(e) =>
                                                updateEditField(
                                                    "remarks",
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </Grid>

                                </Grid>

                            </CardContent>

                        </Card>

                    </DialogContent>

                    <DialogActions>

                        <Button
                            onClick={() => setEditOpen(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="contained"
                            onClick={saveEditedFee}
                        >
                            Save
                        </Button>

                    </DialogActions>

                </Dialog>

            </Box >
        </Layout>
    );
}