import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import "../style/practice.scss";

// ==========PRACTICE PAGE=================
const Practice = () => {
    const navigate = useNavigate();

    const { reports, loading } = useInterview();

    const [selectedPlan, setSelectedPlan] = useState("");

    // ==========PRACTICE OPTIONS=================
    const practiceOptions = [
        {
            icon: "⚡",
            title: "Technical Practice",
            description:
                "Practice technical questions based on your selected interview plan and target role.",
            count: "Technical Questions",
            type: "technical"
        },
        {
            icon: "◉",
            title: "Behavioral Practice",
            description:
                "Prepare strong answers for HR and behavioral interview questions.",
            count: "Behavioral Questions",
            type: "behavioral"
        },
        {
            icon: "✦",
            title: "Random Question",
            description:
                "Challenge yourself with a random technical or behavioral question.",
            count: "Quick Practice",
            type: "random"
        }
    ];

    // ==========START PRACTICE=================
    const handlePractice = (type) => {
        if (!selectedPlan) {
            return;
        }

        navigate(
            `/practice/${selectedPlan}?type=${type}`
        );
    };

    // ==========GET PLAN TITLE=================
    const getPlanTitle = (report) => {
        return (
            report?.title ||
            report?.jobTitle ||
            "Interview Preparation Plan"
        );
    };

    // ==========LOADING=================
    if (loading) {
        return (
            <main className="practice-loading">
                <div className="practice-spinner"></div>

                <p>
                    Loading your practice workspace...
                </p>
            </main>
        );
    }

    return (
        <div className="practice-page">

            {/* ==========PAGE HEADER================= */}
            <section className="practice-header">

                <div>
                    <span className="practice-eyebrow">
                        INTERVIEW PREPARATION
                    </span>

                    <h1>
                        Practice Mode
                    </h1>

                    <p>
                        Select an interview plan and start practicing
                        questions generated specifically for that role.
                    </p>
                </div>

                <button
                    type="button"
                    className="practice-back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back to Workspace
                </button>

            </section>

            {/* ==========NO INTERVIEW PLAN================= */}
            {!reports || reports.length === 0 ? (

                <section className="practice-empty">

                    <div className="practice-empty__icon">
                        ✦
                    </div>

                    <h2>
                        Create an Interview Plan First
                    </h2>

                    <p>
                        Your practice questions are generated from your
                        interview plans. Create a plan to start practicing.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Create Interview Plan →
                    </button>

                </section>

            ) : (

                <>
                    {/* ==========SELECT INTERVIEW PLAN================= */}
                    <section className="practice-plan-selector">

                        <div className="practice-section-heading">

                            <div>
                                <span>
                                    SELECT YOUR PLAN
                                </span>

                                <h2>
                                    Which interview are you preparing for?
                                </h2>
                            </div>

                        </div>

                        <div className="plan-selector-list">

                            {reports.map((report) => (

                                <button
                                    type="button"
                                    key={report._id}
                                    className={`plan-selector-card ${
                                        selectedPlan === report._id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedPlan(report._id)
                                    }
                                >

                                    <div className="plan-selector-icon">
                                        💼
                                    </div>

                                    <div className="plan-selector-content">

                                        <strong>
                                            {getPlanTitle(report)}
                                        </strong>

                                        <span>
                                            Match Score:{" "}
                                            {report.matchScore ?? 0}%
                                        </span>

                                    </div>

                                    <div className="plan-selector-check">
                                        {selectedPlan === report._id
                                            ? "✓"
                                            : ""}
                                    </div>

                                </button>

                            ))}

                        </div>

                    </section>

                    {/* ==========PRACTICE HERO================= */}
                    <section className="practice-hero">

                        <div className="practice-hero__content">

                            <span>
                                READY TO PRACTICE?
                            </span>

                            <h2>
                                Turn preparation into confidence.
                            </h2>

                            <p>
                                Choose a practice mode and start testing
                                your interview readiness.
                            </p>

                            {!selectedPlan && (
                                <small className="practice-select-message">
                                    Select an interview plan below to continue.
                                </small>
                            )}

                        </div>

                        <div className="practice-hero__visual">

                            <div className="practice-glow"></div>

                            <div className="practice-ai-card">
                                <span>✦</span>
                                <strong>AI</strong>
                                <small>PRACTICE</small>
                            </div>

                        </div>

                    </section>

                    {/* ==========PRACTICE OPTIONS================= */}
                    <section className="practice-options">

                        <div className="practice-section-heading">

                            <div>
                                <span>
                                    CHOOSE YOUR MODE
                                </span>

                                <h2>
                                    What do you want to practice?
                                </h2>
                            </div>

                        </div>

                        <div className="practice-grid">

                            {practiceOptions.map((option) => (

                                <article
                                    className={`practice-card ${
                                        !selectedPlan
                                            ? "practice-card--disabled"
                                            : ""
                                    }`}
                                    key={option.title}
                                >

                                    <div className="practice-card__top">

                                        <div className="practice-card__icon">
                                            {option.icon}
                                        </div>

                                        <span className="practice-card__badge">
                                            AI
                                        </span>

                                    </div>

                                    <h3>
                                        {option.title}
                                    </h3>

                                    <p>
                                        {option.description}
                                    </p>

                                    <div className="practice-card__bottom">

                                        <span>
                                            {option.count}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={!selectedPlan}
                                            onClick={() =>
                                                handlePractice(option.type)
                                            }
                                        >
                                            {option.type === "technical"
                                                ? "Start Technical Practice"
                                                : option.type === "behavioral"
                                                    ? "Start Behavioral Practice"
                                                    : "Start Random Practice"}

                                            <span>
                                                →
                                            </span>
                                        </button>

                                    </div>

                                </article>

                            ))}

                        </div>

                    </section>

                    {/* ==========PRACTICE TIP================= */}
                    <section className="practice-tips">

                        <div className="practice-tips__icon">
                            💡
                        </div>

                        <div>

                            <span>
                                PRACTICE TIP
                            </span>

                            <h3>
                                Don't just read the answer — explain it yourself.
                            </h3>

                            <p>
                                Try answering each question out loud before
                                checking your preparation material.
                            </p>

                        </div>

                    </section>

                    {/* ==========PRACTICE FOOTER================= */}
                    <footer className="practice-footer">

                        <span>
                            Interview AI • Practice Mode
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/plans")}
                        >
                            View My Plans →
                        </button>

                    </footer>
                </>
            )}

        </div>
    );
};

export default Practice;