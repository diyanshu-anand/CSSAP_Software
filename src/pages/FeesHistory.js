import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Autocomplete,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Divider,
    Stack,
    Button
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";
import API_BASE from "../config";

export default function FeeHistory() {

    const API = API_BASE;
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const loadStudents = async () => {

            try {

                const res = await axios.get(
                    `${API}/getStudents.php`
                );

                if (res.data.status) {
                    setStudents(res.data.data);
                }

            } catch (err) {

                console.error(
                    "Unable to load students:",
                    err
                );

            }

        };

        loadStudents();

    }, [API]);


    const loadStudentHistory = async (student) => {

        setSelectedStudent(student);
        setFees([]);

        if (!student) {
            return;
        }

        try {

            setLoading(true);

            const res = await axios.get(
                `${API}/getFees.php`
            );

            if (!res.data.status) {
                return;
            }

            const allFees = res.data.data || [];

            const studentFees = allFees.filter(
                fee =>
                    fee.student_uuid === student.uuid
            );


            /*
             * =========================================================
             * DUPLICATE TRANSACTION CLEANUP
             * =========================================================
             *
             * Same logic as PrincipalFeesLedger.
             *
             * Duplicate key:
             *
             * student_uuid
             * + month
             * + payment_date
             * + amount
             *
             * Race-condition transactions can therefore create:
             *
             * Transaction A -> Receipt 1001
             * Transaction B -> Receipt 1002
             *
             * even though they represent the same payment.
             *
             * We DO NOT delete anything from the database.
             * We only hide the duplicate transaction from this page.
             */


            const duplicateTracker = {};

            const duplicateTransactionIds = new Set();


            studentFees.forEach((fee) => {

                /*
                 * -----------------------------------------------------
                 * GET TRANSACTION ID
                 * -----------------------------------------------------
                 *
                 * Prefer transaction_uuid.
                 * Fall back to uuid because this page currently uses
                 * fee.uuid as the React row key.
                 */

                const transactionId =
                    fee.transaction_uuid ||
                    fee.uuid;


                /*
                 * -----------------------------------------------------
                 * PARSE MONTHS
                 * -----------------------------------------------------
                 */

                let months = [];


                if (Array.isArray(fee.selected_months)) {

                    months = fee.selected_months;

                } else if (
                    typeof fee.selected_months === "string" &&
                    fee.selected_months.trim() !== ""
                ) {

                    try {

                        months =
                            JSON.parse(
                                fee.selected_months
                            );


                        /*
                         * Handle double encoded JSON
                         *
                         * Example:
                         * "\"[\\\"April\\\",\\\"May\\\"]\""
                         */

                        if (typeof months === "string") {

                            months =
                                JSON.parse(months);

                        }

                    } catch {

                        /*
                         * Handle old comma-separated format
                         */

                        months =
                            fee.selected_months
                                .split(",")
                                .map(m => m.trim())
                                .filter(Boolean);

                    }

                }


                /*
                 * Old single-month records
                 */

                if (
                    !Array.isArray(months) &&
                    fee.month
                ) {

                    months = [fee.month];

                }


                /*
                 * Final safety
                 */

                if (!Array.isArray(months)) {

                    months = [];

                }


                /*
                 * If there is no month information at all,
                 * still check the transaction using a special key.
                 */

                if (months.length === 0) {

                    months = ["__NO_MONTH__"];

                }


                const amount =
                    Number(
                        fee.amount || 0
                    );


                /*
                 * -----------------------------------------------------
                 * CHECK EACH MONTH
                 * -----------------------------------------------------
                 */

                months.forEach((month) => {

                    const duplicateKey =
                        `${fee.student_uuid}__${month}__${fee.payment_date}__${amount}`;


                    /*
                     * FIRST TRANSACTION
                     */

                    if (!duplicateTracker[duplicateKey]) {

                        duplicateTracker[duplicateKey] = {

                            student:
                                fee.name,

                            student_uuid:
                                fee.student_uuid,

                            month,

                            payment_date:
                                fee.payment_date,

                            amount,

                            transaction_uuids: [
                                transactionId
                            ],

                            kept_transaction_uuid:
                                transactionId

                        };

                        return;

                    }


                    /*
                     * SAME PAYMENT FOUND AGAIN
                     */

                    const tracker =
                        duplicateTracker[duplicateKey];


                    /*
                     * Same transaction UUID appearing again
                     * is NOT a duplicate transaction.
                     */

                    if (
                        tracker.transaction_uuids.includes(
                            transactionId
                        )
                    ) {

                        return;

                    }


                    /*
                     * DIFFERENT TRANSACTION UUID
                     *
                     * This is the race-condition duplicate.
                     */

                    tracker.transaction_uuids.push(
                        transactionId
                    );


                    /*
                     * Keep the first transaction.
                     * Hide this later transaction.
                     */

                    duplicateTransactionIds.add(
                        transactionId
                    );


                    console.warn(
                        "[FEE HISTORY DUPLICATE DETECTED]",
                        {

                            student:
                                fee.name,

                            student_uuid:
                                fee.student_uuid,

                            month,

                            payment_date:
                                fee.payment_date,

                            amount,

                            kept_transaction_uuid:
                                tracker.kept_transaction_uuid,

                            duplicate_transaction_uuid:
                                transactionId,

                            receipt_number:
                                fee.receipt_number,

                            all_matching_transaction_uuids:
                                tracker.transaction_uuids

                        }
                    );

                });

            });


            /*
             * =========================================================
             * REMOVE DUPLICATES FROM DISPLAY
             * =========================================================
             */

            const cleanedFees =
                studentFees.filter((fee) => {

                    const transactionId =
                        fee.transaction_uuid ||
                        fee.uuid;


                    return !duplicateTransactionIds.has(
                        transactionId
                    );

                });


            /*
             * =========================================================
             * DUPLICATE REPORT
             * =========================================================
             */

            const duplicateGroups =
                Object.values(duplicateTracker)
                    .filter(
                        group =>
                            group.transaction_uuids.length > 1
                    );


            if (duplicateGroups.length > 0) {

                console.group(
                    `%c[FEE HISTORY CLEANUP] ${duplicateGroups.length} duplicate payment groups detected`,
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
                    "%c[FEE HISTORY CLEANUP] No duplicate payment records detected.",
                    "color: #16A34A; font-weight: bold;"
                );

            }


            /*
             * IMPORTANT:
             *
             * setFees receives the CLEANED list,
             * not the raw database list.
             */

            setFees(cleanedFees);

        } catch (err) {

            console.error(
                "Unable to load fee history:",
                err
            );

        } finally {

            setLoading(false);

        }

    };



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
                        Student Fee History
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() =>
                            navigate("/feesnewentry")
                        }
                    >
                        Back to Fee Ledger
                    </Button>

                </Stack>


                <Card>

                    <CardContent>

                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Select Student
                        </Typography>

                        <Autocomplete
                            options={students}
                            value={selectedStudent}
                            getOptionLabel={(option) =>
                                `${option.name} (${option.class}-${option.section})`
                            }
                            onChange={(event, value) =>
                                loadStudentHistory(value)
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Student"
                                    fullWidth
                                />
                            )}
                        />

                    </CardContent>

                </Card>


                {selectedStudent && (

                    <Card sx={{ mt: 2 }}>

                        <CardContent>

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Student Details
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1}>

                                <Typography>
                                    <strong>Name:</strong>{" "}
                                    {selectedStudent.name}
                                </Typography>

                                <Typography>
                                    <strong>Class:</strong>{" "}
                                    {selectedStudent.class}
                                </Typography>

                                <Typography>
                                    <strong>Section:</strong>{" "}
                                    {selectedStudent.section}
                                </Typography>

                                <Typography>
                                    <strong>Admission No:</strong>{" "}
                                    {selectedStudent.admission_no}
                                </Typography>

                            </Stack>

                        </CardContent>

                    </Card>

                )}


                {selectedStudent && (

                    <Card sx={{ mt: 2 }}>

                        <CardContent>

                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Payment History
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <TableContainer
                                component={Paper}
                            >

                                <Table>

                                    <TableHead>
                                        <TableRow>

                                            <TableCell>Date</TableCell>
                                            <TableCell>Receipt</TableCell>
                                            <TableCell>Months</TableCell>
                                            <TableCell>Tuition</TableCell>
                                            <TableCell>Activity</TableCell>
                                            <TableCell>Transaction Total</TableCell>
                                            <TableCell>Collected</TableCell>
                                            <TableCell>Balance</TableCell>
                                            <TableCell>Payment Method</TableCell>
                                            <TableCell>Remarks</TableCell>

                                        </TableRow>
                                    </TableHead>


                                    <TableBody>

                                        {loading ? (

                                            <TableRow>

                                                <TableCell
                                                    colSpan={10}
                                                    align="center"
                                                >
                                                    Loading...
                                                </TableCell>

                                            </TableRow>

                                        ) : fees.length === 0 ? (

                                            <TableRow>

                                                <TableCell
                                                    colSpan={10}
                                                    align="center"
                                                >
                                                    No payment history found.
                                                </TableCell>

                                            </TableRow>

                                        ) : (

                                            fees.map((fee) => {

                                                let months = [];

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
                                                            .map(m => m.trim())
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
                                                            feeBreakdown =
                                                                JSON.parse(feeBreakdown);
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


                                                // =========================================================
                                                // BALANCE
                                                // =========================================================

                                                const balance =
                                                    Number(
                                                        fee.balance || 0
                                                    );


                                                return (

                                                    <TableRow
                                                        key={fee.uuid}
                                                    >

                                                        <TableCell>
                                                            {fee.payment_date}
                                                        </TableCell>

                                                        <TableCell>
                                                            {fee.receipt_number || "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {months.length
                                                                ? months.join(", ")
                                                                : "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            ₹{tuitionTotal}
                                                        </TableCell>

                                                        <TableCell>
                                                            ₹{activityTotal}
                                                        </TableCell>

                                                        <TableCell>
                                                            ₹{Number(
                                                                fee.transaction_total ||
                                                                monthlyTotal
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            ₹{Number(
                                                                fee.amount || 0
                                                            )}
                                                        </TableCell>

                                                        <TableCell>

                                                            {balance > 0 ? (

                                                                <Chip
                                                                    size="small"
                                                                    color="warning"
                                                                    label={`Pending ₹${balance}`}
                                                                />

                                                            ) : balance < 0 ? (

                                                                <Chip
                                                                    size="small"
                                                                    color="info"
                                                                    label={`Deposit ₹${Math.abs(balance)}`}
                                                                />

                                                            ) : (

                                                                <Chip
                                                                    size="small"
                                                                    color="success"
                                                                    label="Settled"
                                                                />

                                                            )}

                                                        </TableCell>

                                                        <TableCell>
                                                            {fee.payment_method?.toUpperCase() || "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {fee.remarks || "-"}
                                                        </TableCell>

                                                    </TableRow>

                                                );

                                            })
                                        )}

                                    </TableBody>

                                </Table>

                            </TableContainer>

                        </CardContent>

                    </Card>

                )}

            </Box>

        </Layout>

    );

}