import { useState } from "react";
import axios from "axios";
import API_BASE from "../config";
import { useNavigate } from "react-router-dom";
// import { Container, Card, CardContent, Typography, TextField, Button } from "@mui/material";

import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";


import { useLoader } from "../context/LoaderContext";
import SchoolLogo from "../assets/ABM_Logo.jpg";   // your school logo
import MyLogo from "../assets/Gauranga_Creations.png";      // your logo (add this)
import ShaftShifters from "../assets/Shaft_Shifters.png"

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();

  const [forgotOpen, setForgotOpen] = useState(false);

  const [resetUsername, setResetUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [step, setStep] = useState(1);

  // SHIFTING TO SOFTWARE BASED INTEGRATION
  // const handleLogin = async () => {
  //   try {
  //     const res = await axios.post(`${API_BASE}/login.php`, {
  //       username,
  //       password
  //     });

  //     if (res.data.status) {
  //       localStorage.setItem("user", JSON.stringify(res.data));
  //       navigate("/dashboard");
  //     } else {
  //       alert(res.data.message);
  //     }
  //   } catch (err) {
  //     alert("Server error");
  //   }
  // };

  // SOFTWARE BASED TECHNOLOGY CONVERSION CODE:
  // const handleLogin = async () => {

  //   try {

  //     const res = await axios.post(`${API_BASE}/login.php`, {
  //       username,
  //       password
  //     });

  //     // ✅ ALWAYS PRINT FIRST
  //     console.log("LOGIN RESPONSE:", res.data);

  //     if (res.data.status === true) {

  //       const ipcRenderer = window?.require ? window.require('electron').ipcRenderer : null;

  //       // SAFE USER OBJECT (NO MORE UNDEFINED) (I NEED TO GET BETTER AT THIS)
  //       const userData = res.data.user || res.data.data || {
  //         username: username,
  //         loginTime: new Date().toISOString()
  //       };

  //       if (ipcRenderer) {
  //         await ipcRenderer.invoke('save-user', userData);
  //       }

  //       navigate('/dashboard');

  //     } else {
  //       alert(res.data.message || "Invalid credentials");
  //     }

  //   } catch (err) {
  //     console.error("LOGIN ERROR:", err);
  //     console.error("ERROR RESPONSE:", err?.response?.data);
  //     alert("Login failed");
  //   }

  // };


  // FORGOT PASSWORD FUNCTIONS
  const sendOtp = async () => {

    try {

      showLoader();

      const res = await axios.post(
        `${API_BASE}/forgotpassword.php`,
        {
          username: resetUsername
        }
      );

      console.log("SEND OTP RESPONSE:", res.data);

      if (res.data.status === true) {

        alert("OTP sent successfully");

        setStep(2);

      } else {

        alert(
          res.data.message ||
          "Failed to send OTP"
        );

      }

    } catch (err) {

      console.error(err);
      alert("Server error");

    } finally {

      hideLoader();

    }
  };

  const verifyOtp = async () => {

    try {

      showLoader();

      const res = await axios.post(
        `${API_BASE}/verifyOtp.php`,
        {
          username: resetUsername,
          otp
        }
      );

      console.log(
        "VERIFY OTP RESPONSE:",
        res.data
      );

      if (res.data.status === true) {

        alert("OTP verified");

        setStep(3);

      } else {

        alert(
          res.data.message ||
          "Invalid OTP"
        );

      }

    } catch (err) {

      console.error(err);

      alert("Server error");

    } finally {

      hideLoader();

    }
  };

  const resetPassword = async () => {

    try {

      showLoader();

      const res = await axios.post(
        `${API_BASE}/resetPassword.php`,
        {
          username: resetUsername,
          password: newPassword
        }
      );

      console.log(
        "RESET PASSWORD RESPONSE:",
        res.data
      );

      if (res.data.status === true) {

        alert("Password reset successful");

        setForgotOpen(false);

        setStep(1);
        setResetUsername("");
        setOtp("");
        setNewPassword("");

      } else {

        alert(
          res.data.message ||
          "Failed to reset password"
        );

      }

    } catch (err) {

      console.error(err);

      alert("Server error");

    } finally {

      hideLoader();

    }
  };

  // SORTED COMMONJS AND EJS MODULE CONFLICT ISSUES
  const handleLogin = async () => {

    showLoader();

    try {

      const res = await axios.post(`${API_BASE}/login.php`, {
        username,
        password
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.status === true) {

        let userData = {
          username: username,
          role: res.data.role,
          name: res.data.name
        };

        // Normalize role (important)
        userData.role = userData.role?.toLowerCase();

        localStorage.setItem("user", JSON.stringify(userData));

        if (window?.require) {
          const { ipcRenderer } = window.require('electron');
          await ipcRenderer.invoke('save-user', userData);
        }

        if (userData.role === "principal") {
          navigate("/principal-dashboard");
        } else if (userData.role === "teacher") {
          navigate("/teacher-dashboard");
        } else if (userData.role === "accountant") {
          navigate("/accountant-dashboard");
        } else {
          navigate("/dashboard"); // fallback
        }

      } else {
        alert(res.data.message || "Invalid credentials");
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err);
      alert("Login failed");
    } finally {
      hideLoader();
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6, #93c5fd)",
        fontFamily: "sans-serif"
      }}
    >
      <Container maxWidth="sm">

        <Card
          style={{
            borderRadius: "20px",
            padding: "25px",
            backdropFilter: "blur(10px)",
            background: "rgba(255,255,255,0.95)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}
        >
          <CardContent style={{ textAlign: "center" }}>

            {/*  SCHOOL LOGO */}
            <img
              src={SchoolLogo}
              alt="School Logo"
              style={{
                width: "80px",
                marginBottom: "10px"
              }}
            />

            {/*  SCHOOL NAME */}
            <Typography
              variant="h5"
              style={{ fontWeight: "bold", color: "#1E3A8A" }}
            >
              A.B.M Public School
            </Typography>

            <Typography
              variant="body2"
              style={{ marginBottom: "20px", color: "#555" }}
            >
              School Management System
            </Typography>

            {/* INPUTS */}
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              variant="outlined"
              onChange={e => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              variant="outlined"
              onChange={e => setPassword(e.target.value)}
            />

            {/* BUTTON */}
            <Button
              fullWidth
              variant="contained"
              style={{
                marginTop: 20,
                padding: "12px",
                borderRadius: "10px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #1E3A8A, #2563eb)"
              }}
              onClick={handleLogin}
            >
              Login
            </Button>

            {/* FORGOT PASSWORD CONTENT */}
            <Typography
              sx={{
                mt: 2,
                cursor: "pointer",
                color: "#2563EB",
                fontWeight: "bold"
              }}
              onClick={() => {

                setForgotOpen(true);

                setStep(1);

                setResetUsername("");
                setOtp("");
                setNewPassword("");

              }}
            >
              Forgot Password?
            </Typography>

          </CardContent>
        </Card>

        <Dialog
          open={forgotOpen}
          onClose={() => setForgotOpen(false)}
          maxWidth="sm"
          fullWidth
        >

          <DialogTitle>
            Reset Password
          </DialogTitle>

          <DialogContent>

            {step === 1 && (

              <>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  value={resetUsername}
                  onChange={(e) =>
                    setResetUsername(e.target.value)
                  }
                />
              </>

            )}

            {step === 2 && (

              <>
                <Typography sx={{ mb: 2 }}>
                  OTP sent to school email
                </Typography>

                <TextField
                  fullWidth
                  label="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                />
              </>

            )}

            {step === 3 && (

              <>
                <TextField
                  fullWidth
                  type="password"
                  margin="normal"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                />
              </>

            )}

          </DialogContent>

          <DialogActions>

            <Button
              onClick={() =>
                setForgotOpen(false)
              }
            >
              Cancel
            </Button>

            {step === 1 && (
              <Button
                variant="contained"
                onClick={sendOtp}
              >
                Send OTP
              </Button>
            )}

            {step === 2 && (
              <Button
                variant="contained"
                onClick={verifyOtp}
              >
                Verify OTP
              </Button>
            )}

            {step === 3 && (
              <Button
                variant="contained"
                onClick={resetPassword}
              >
                Reset Password
              </Button>
            )}

          </DialogActions>

        </Dialog>

        {/*  FOOTER BRANDING */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#fff"
          }}
        >
          <Typography variant="body2">
            Crafted by
          </Typography>

          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "5px" }}>
            <img src={MyLogo} alt="logo" style={{ width: "60px" }} />
            <img src={ShaftShifters} alt="logo" style={{ width: "60px" }} />
          </div>
        </div>

      </Container>
    </div>
  );
}

export default Login;