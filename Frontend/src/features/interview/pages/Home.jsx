import React, { useRef, useState } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";

const Home = () => {
    const { loading, generateReport, reports } = useInterview();

    // ==========STATE MANAGEMENT=================
    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
    const [showCreatePlan, setShowCreatePlan] = useState(false);

    // ==========REF=================
    const resumeInputRef = useRef(null);

    // ==========NAVIGATION=================
    const navigate = useNavigate();

    // ==========HANDLE RESUME FILE=================
    const handleFileChange = (e) => {
        setError("");
        const file = e.target.files?.[0];

        if (!file) {
            setSelectedFile(null);
            return;
        }

        // ==========FILE TYPE VALIDATION=================
        if (file.type !== "application/pdf") {
            setError("Please upload a PDF resume.");
            e.target.value = "";
            setSelectedFile(null);
            return;
        }

        // ==========FILE SIZE VALIDATION=================
        if (file.size > 3 * 1024 * 1024) {
            setError("Resume file must be smaller than 3MB.");
            e.target.value = "";
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    // ==========GENERATE INTERVIEW REPORT=================
    const handleGenerateReport = async () => {
        setError("");

        const trimmedJobDescription = jobDescription.trim();
        const trimmedSelfDescription = selfDescription.trim();

        // ==========JOB DESCRIPTION VALIDATION=================
        if (!trimmedJobDescription) {
            setError("Please enter the target job description.");
            return;
        }

        // ==========JOB DESCRIPTION LENGTH VALIDATION=================
        if (trimmedJobDescription.length < 30) {
            setError("Please provide a more detailed job description.");
            return;
        }

        // ==========RESUME OR SELF DESCRIPTION VALIDATION=================
        if (!selectedFile && !trimmedSelfDescription) {
            setError("Please upload your resume or provide a self-description.");
            return;
        }

        // ==========API CALL=================
        try {
            const data = await generateReport({
                jobDescription: trimmedJobDescription,
                selfDescription: trimmedSelfDescription,
                resumeFile: selectedFile,
            });

            // ==========RESPONSE VALIDATION=================
            if (!data?._id) {
                setError("Interview plan could not be generated. Please try again.");
                return;
            }

            // ==========NAVIGATE TO REPORT=================
            navigate(`/interview/${data._id}`);
        } catch (error) {
            console.error("Generate report error:", error);

            // ==========API ERROR MESSAGE=================
            const message =
                error?.response?.data?.message ||
                "Something went wrong while generating your interview plan.";

            setError(message);
        }
    };

    // ==========DASHBOARD STATISTICS=================
    const totalInterviews = reports?.length || 0;

    const averageMatchScore =
        totalInterviews > 0
            ? Math.round(
                reports.reduce(
                    (total, report) => total + (report.matchScore || 0),
                    0
                ) / totalInterviews
            )
            : 0;

    const totalTechnicalQuestions = (reports || []).reduce(
        (total, report) =>
            total + (report.technicalQuestions?.length || 0),
        0
    );

    const totalBehavioralQuestions = (reports || []).reduce(
        (total, report) =>
            total + (report.behavioralQuestions?.length || 0),
        0
    );

    // ==========LATEST REPORT=================
    const latestReport = reports?.length
        ? reports[0]
        : null;

    // ==========LOADING SCREEN=================
    if (loading) {
        return (
            <main className="loading-screen">
                <div className="loading-content">
                    <div className="loading-spinner"></div>

                    <h1>Creating Your Interview Plan...</h1>

                    <p>
                        Our AI is analyzing your profile and the target role.
                        This may take a few seconds.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <div className="workspace">

            {/* ==========SIDEBAR================= */}
            <aside className="workspace-sidebar">

                {/* ==========BRAND================= */}
                <div className="workspace-brand">
                    <div className="brand-icon">
                        ✦
                    </div>

                    <div>
                        <h2>Interview AI</h2>
                        <span>Career Workspace</span>
                    </div>
                </div>

                {/* ==========SIDEBAR NAVIGATION================= */}
                <nav className="workspace-nav">

                    <button
                        type="button"
                        className="workspace-nav__item workspace-nav__item--active"
                    >
                        <span>⌂</span>
                        Home
                    </button>

                    <button
                        type="button"
                        className="workspace-nav__item"
                        onClick={() => navigate("/plans")}
                    >
                        <span>▣</span>
                        My Plans
                    </button>

                    <button
                        type="button"
                        className="workspace-nav__item"
                        onClick={() => navigate("/practice")}
                    >
                        <span>◎</span>
                        Practice
                    </button>

                    <button
                        type="button"
                        className="workspace-nav__item"
                        onClick={() => navigate("/progress")}
                    >
                        <span>◈</span>
                        Progress
                    </button>

                    {/* ==========PROFILE BUTTON================= */}
                    <button
                        type="button"
                        className="workspace-nav__item"
                        onClick={() => navigate("/profile")}
                    >
                        <span>◉</span>
                        Profile
                    </button>

                    <button
                        type="button"
                        className="workspace-nav__item"
                        onClick={() => navigate("/settings")}
                    >
                        <span>⚙</span>
                        Settings
                    </button>
                </nav>

                {/* ==========SIDEBAR BOTTOM CARD================= */}
                <div className="workspace-sidebar__bottom">

                    <div className="sidebar-help-icon">
                        ?
                    </div>

                    <div>
                        <h4>Need interview help?</h4>
                        <p>
                            Create a personalized plan with AI.
                        </p>
                    </div>
                </div>
            </aside>

            {/* ==========MAIN WORKSPACE================= */}
            <main className="workspace-main">

                {/* ==========TOP BAR================= */}
                <header className="workspace-topbar">

                    <div className="workspace-breadcrumb">
                        Workspace / Home
                    </div>

                    <div className="workspace-user">

                        <button
                            type="button"
                            className="notification-btn"
                            onClick={() =>
                                setError("No new notifications.")
                            }
                        >
                            ♧
                        </button>

                        <button
                            type="button"
                            className="workspace-nav__item"
                            onClick={() => navigate("/profile")}
                        >
                            <span>◉</span>
                            Profile
                        </button>
                    </div>
                </header>

                {/* ==========WORKSPACE CONTENT================= */}
                <div className="workspace-content">

                    {/* ==========WELCOME HERO================= */}
                    <section className="workspace-hero">

                        <div className="workspace-hero__content">

                            <span className="workspace-eyebrow">
                                AI CAREER COACH
                            </span>

                            <h1>
                                Welcome back 👋
                            </h1>

                            <p>
                                Build confidence, sharpen your skills,
                                and get interview-ready with your
                                personalized AI preparation workspace.
                            </p>

                            <button
                                type="button"
                                className="hero-action"
                                onClick={() => setShowCreatePlan(true)}
                            >
                                <span>✦</span>
                                Create Interview Plan
                            </button>
                        </div>

                        <div className="workspace-hero__visual">

                            <div className="hero-orbit hero-orbit--one"></div>
                            <div className="hero-orbit hero-orbit--two"></div>

                            <div className="hero-ai-card">
                                <span>✦</span>
                                <strong>AI</strong>
                                <small>READY</small>
                            </div>
                        </div>
                    </section>

                    {/* ==========STATS================= */}
                    <section className="workspace-stats">

                        <div className="workspace-stat">
                            <span className="workspace-stat__icon">
                                ◫
                            </span>

                            <div>
                                <p>Interview Plans</p>
                                <h3>{totalInterviews}</h3>
                            </div>
                        </div>

                        <div className="workspace-stat">
                            <span className="workspace-stat__icon">
                                ◉
                            </span>

                            <div>
                                <p>Average Match</p>
                                <h3>{averageMatchScore}%</h3>
                            </div>
                        </div>

                        <div className="workspace-stat">
                            <span className="workspace-stat__icon">
                                ◈
                            </span>

                            <div>
                                <p>Technical Questions</p>
                                <h3>{totalTechnicalQuestions}</h3>
                            </div>
                        </div>

                        <div className="workspace-stat">
                            <span className="workspace-stat__icon">
                                ◎
                            </span>

                            <div>
                                <p>Behavioral Questions</p>
                                <h3>{totalBehavioralQuestions}</h3>
                            </div>
                        </div>
                    </section>

                    {/* ==========PREPARATION JOURNEY================= */}
                    <section className="preparation-journey">

                        <div className="section-heading">

                            <div>
                                <span className="section-eyebrow">
                                    YOUR ROADMAP
                                </span>

                                <h2>
                                    Preparation Journey
                                </h2>

                                <p>
                                    Follow your personalized path from
                                    preparation to interview confidence.
                                </p>
                            </div>
                        </div>

                        <div className="journey-track">

                            <div className="journey-step journey-step--completed">

                                <div className="journey-step__number">
                                    ✓
                                </div>

                                <div className="journey-step__content">
                                    <span>01</span>
                                    <h3>Create Plan</h3>
                                    <p>
                                        Analyze your role and profile.
                                    </p>
                                </div>
                            </div>

                            <div className="journey-line journey-line--completed"></div>

                            <div className="journey-step journey-step--active">

                                <div className="journey-step__number">
                                    02
                                </div>

                                <div className="journey-step__content">
                                    <span>02</span>
                                    <h3>Learn</h3>
                                    <p>
                                        Review technical and behavioral
                                        questions.
                                    </p>
                                </div>
                            </div>

                            <div className="journey-line"></div>

                            <div className="journey-step">

                                <div className="journey-step__number">
                                    03
                                </div>

                                <div className="journey-step__content">
                                    <span>03</span>
                                    <h3>Practice</h3>
                                    <p>
                                        Practice your answers confidently.
                                    </p>
                                </div>
                            </div>

                            <div className="journey-line"></div>

                            <div className="journey-step">

                                <div className="journey-step__number">
                                    04
                                </div>

                                <div className="journey-step__content">
                                    <span>04</span>
                                    <h3>Review</h3>
                                    <p>
                                        Identify gaps and improve.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ==========RECENT INTERVIEW PLAN================= */}
                    <section className="recent-plans">

                        <div className="section-heading section-heading--row">

                            <div>
                                <span className="section-eyebrow">
                                    YOUR WORK
                                </span>

                                <h2>
                                    Recent Interview Plans
                                </h2>
                            </div>

                            {reports?.length > 0 && (
                                <button
                                    type="button"
                                    className="view-all-btn"
                                    onClick={() => navigate("/plans")}
                                >
                                    View all →
                                </button>
                            )}
                        </div>

                        {latestReport ? (
                            <div
                                className="recent-plan-card"
                                onClick={() =>
                                    navigate(
                                        `/interview/${latestReport._id}`
                                    )
                                }
                            >

                                <div className="recent-plan-card__icon">
                                    💼
                                </div>

                                <div className="recent-plan-card__content">

                                    <span className="recent-plan-card__label">
                                        LATEST INTERVIEW PLAN
                                    </span>

                                    <h3>
                                        {latestReport.title ||
                                            "Untitled Position"}
                                    </h3>

                                    <p>
                                        Generated on{" "}
                                        {new Date(
                                            latestReport.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="recent-plan-card__score">

                                    <span>
                                        Match Score
                                    </span>

                                    <strong>
                                        {latestReport.matchScore ?? 0}%
                                    </strong>
                                </div>

                                <div className="recent-plan-card__arrow">
                                    →
                                </div>
                            </div>
                        ) : (
                            <div className="empty-plans">

                                <div className="empty-plans__icon">
                                    ✦
                                </div>

                                <h3>
                                    Your interview journey starts here
                                </h3>

                                <p>
                                    Create your first personalized
                                    interview plan and start preparing.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCreatePlan(true)
                                    }
                                >
                                    Create Your First Plan →
                                </button>
                            </div>
                        )}
                    </section>

                    {/* ==========CREATE INTERVIEW CTA================= */}
                    <section className="workspace-cta">

                        <div>
                            <span>
                                READY TO PREPARE?
                            </span>

                            <h2>
                                Turn your next interview into an opportunity.
                            </h2>

                            <p>
                                Get an AI-powered preparation strategy
                                tailored to your target role.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowCreatePlan(true)}
                        >
                            ✦ Start Preparing
                        </button>
                    </section>

                    {/* ==========PAGE FOOTER================= */}
                    <footer className="workspace-footer">
                        <span>
                            Interview AI • AI-Powered Career Preparation
                        </span>

                        <div>
                            <a href="#privacy">
                                Privacy
                            </a>

                            <a href="#terms">
                                Terms
                            </a>

                            <a href="#help">
                                Help
                            </a>
                        </div>
                    </footer>
                </div>
            </main>

            {/* ==========CREATE INTERVIEW MODAL================= */}
            {showCreatePlan && (
                <div
                    className="plan-modal-overlay"
                    onClick={() => setShowCreatePlan(false)}
                >
                    <div
                        className="plan-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="plan-modal__header">

                            <div>
                                <span className="section-eyebrow">
                                    AI INTERVIEW COACH
                                </span>

                                <h2>
                                    Create Your Interview Plan
                                </h2>

                                <p>
                                    Give us the role and your profile.
                                    We'll build your personalized strategy.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={() =>
                                    setShowCreatePlan(false)
                                }
                            >
                                ×
                            </button>
                        </div>

                        {/* ==========ERROR MESSAGE================= */}
                        {error && (
                            <div className="error-box">
                                <span>⚠️</span>

                                <p>{error}</p>

                                <button
                                    type="button"
                                    onClick={() => setError("")}
                                >
                                    ×
                                </button>
                            </div>
                        )}

                        {/* ==========JOB DESCRIPTION================= */}
                        <div className="form-section">

                            <label>
                                Target Job Description
                                <span>Required</span>
                            </label>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => {
                                    setJobDescription(e.target.value);
                                    setError("");
                                }}
                                placeholder={`Paste the full job description here...
Example:
Frontend Developer with experience in React,
JavaScript, HTML, CSS, REST APIs and Git...`}
                                maxLength={5000}
                            />

                            <div className="form-counter">
                                {jobDescription.length} / 5000
                            </div>
                        </div>

                        {/* ==========RESUME UPLOAD================= */}
                        <div className="form-section">

                            <label>
                                Upload Resume
                                <span>Best Results</span>
                            </label>

                            <label
                                className={`resume-dropzone ${selectedFile
                                        ? "resume-dropzone--selected"
                                        : ""
                                    }`}
                                htmlFor="workspace-resume"
                            >
                                <span className="resume-dropzone__icon">
                                    📄
                                </span>

                                {selectedFile ? (
                                    <>
                                        <strong>
                                            {selectedFile.name}
                                        </strong>

                                        <small>
                                            {(
                                                selectedFile.size /
                                                (1024 * 1024)
                                            ).toFixed(2)}{" "}
                                            MB • PDF
                                        </small>
                                    </>
                                ) : (
                                    <>
                                        <strong>
                                            Click to upload resume
                                        </strong>

                                        <small>
                                            PDF only • Maximum 3MB
                                        </small>
                                    </>
                                )}

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    id="workspace-resume"
                                    name="resume"
                                    accept=".pdf,application/pdf"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* ==========OR DIVIDER================= */}
                        <div className="modal-or">
                            <span>OR</span>
                        </div>

                        {/* ==========SELF DESCRIPTION================= */}
                        <div className="form-section">

                            <label>
                                Quick Self-Description
                            </label>

                            <textarea
                                value={selfDescription}
                                onChange={(e) => {
                                    setSelfDescription(e.target.value);
                                    setError("");
                                }}
                                placeholder="Briefly describe your experience, skills, projects and technologies you know..."
                                maxLength={2000}
                            />

                            <div className="form-counter">
                                {selfDescription.length} / 2000
                            </div>
                        </div>

                        {/* ==========MODAL ACTION================= */}
                        <div className="plan-modal__footer">

                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() =>
                                    setShowCreatePlan(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="generate-btn"
                                onClick={handleGenerateReport}
                                disabled={loading}
                            >
                                ✦ Generate Interview Strategy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;