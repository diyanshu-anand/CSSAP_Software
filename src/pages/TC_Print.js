import React from "react";
import Logo from "../assets/ABM_Logo.jpg";
import "./Transfer_Certificate.css";

function TCPrint({ tc }) {

  if (!tc) return null;

  return (
    <div className="tc-container">
      <div className="tc-box">

        {/* HEADER */}
        <div className="tc-header">
          <div className="tc-logo">
            <img src={Logo} alt="logo" />
          </div>

          <div className="tc-school">
            <h1>ABM PUBLIC SCHOOL</h1>
            <p>Rajaswa Colony, Main Road, Sarkanda</p>
            <p>Bilaspur (C.G.) - 495001</p>
          </div>
        </div>

        {/* TITLE */}
        <div className="tc-title">
          <h2>TRANSFER CERTIFICATE</h2>
        </div>

        {/* META */}
        <div className="tc-meta">
          <span><b>S. No:</b> {tc.tc_number || "________"}</span>
          <span><b>UDISE:</b> 22070320910</span>
        </div>

        {/* CONTENT */}
        <div className="tc-content">

          <div className="tc-line">
            This is to certify that <b>{tc.name || "________"}</b>
          </div>

          <div className="tc-line">
            Son/Daughter of <b>{tc.father_name || "________"}</b>
          </div>

          <p>
            Was a student of this school.
          </p>

          <div className="tc-line">
            Class at leaving: <b>{tc.class_at_leaving || "________"}</b>
          </div>

          <div className="tc-line">
            Medium of instruction: <b>{tc.medium || "________"}</b>
          </div>

          <div className="tc-line column">
            Subjects studied:
            <div className="pdf-text">
              {tc.subjects || "________"}
            </div>
          </div>

          <div className="tc-line">
            Conduct: <b>{tc.conduct || "Good"}</b>
          </div>

          <div className="tc-line">
            Category: <b>{tc.category || "________"}</b>
          </div>

          <div className="tc-line">
            Application Date: <b>{tc.date_of_application || "________"}</b>
          </div>

          <div className="tc-line">
            Result: <b>{tc.failed === "yes" ? "Not Passed" : "Passed"}</b>
          </div>

        </div>

        {/* FOOTER */}
        <div className="tc-footer">
          <div className="signature-row">
            <div className="sign-box">Class Teacher</div>
            <div className="sign-box">Office Clerk</div>
            <div className="sign-box">Principal</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TCPrint;