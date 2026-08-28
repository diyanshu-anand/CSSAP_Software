{/* SCHOLASTICS */}
                                <div className="remarks-line">
                                    <b>Scholastics :</b>

                                    {isPDF ? (
                                        <span className="remarks-text">
                                            {scholasticRemark || "-"}
                                        </span>
                                    ) : (
                                        <select
                                            className="remarks-dropdown-inline"
                                            value={scholasticRemark}
                                            onChange={(e) => setScholasticRemark(e.target.value)}
                                            disabled={isLocked}
                                        >
                                            <option value="">Select</option>
                                            <option value="Excellent performance">Excellent performance</option>
                                            <option value="Very good performance">Very good performance</option>
                                            <option value="Good performance">Good performance</option>
                                            <option value="Needs improvement">Needs improvement</option>
                                        </select>
                                    )}
                                </div>

                                {/* CO-SCHOLASTICS */}
                                <div className="remarks-line">
                                    <b>Co-Scholastics :</b>

                                    {isPDF ? (
                                        <span className="remarks-text">
                                            {coRemark
                                                ? `Your ward is ${coRemark}`
                                                : "-"}
                                        </span>
                                    ) : (
                                        <>
                                            <span style={{ marginLeft: "5px" }}>Your ward is</span>

                                            <select
                                                className="remarks-dropdown-inline"
                                                value={coRemark}
                                                onChange={(e) => setCoRemark(e.target.value)}
                                                disabled={isLocked}
                                            >
                                                <option value="">Select</option>
                                                <option value="excellent">excellent</option>
                                                <option value="very good">very good</option>
                                                <option value="good">good</option>
                                                <option value="average">average</option>
                                            </select>
                                        </>
                                    )}
                                </div>