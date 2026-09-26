import React, { useMemo } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import "../style/progress.scss";

// ==========PROGRESS PAGE=================
const Progress = () => {
    const navigate = useNavigate();
    const { reports, loading } = useInterview();

    // ==========SAFE REPORTS=================
    const safeReports = Array.isArray(reports) ? reports : [];

    // ==========PROGRESS DATA=================
    const progressData = useMemo(() => {
        if (!safeReports.length) {
            return {
                totalPlans: 0,
                averageScore: 0,
                bestScore: 0,
                totalQuestions: 0,
                completedPlans: 0
            };
        }

        const scores = safeReports
            .map((report) => Number(report.matchScore || 0))
            .filter((score) => score > 0);

        const totalQuestions = safeReports.reduce((total, report) => {
            const technical = Array.isArray(report.technicalQuestions)
                ? report.technicalQuestions.length
                : 0;

            const behavioral = Array.isArray(report.behavioralQuestions)
                ? report.behavioralQuestions.length
                : 0;

            return total + technical + behavioral;
        }, 0);

        const averageScore = scores.length
            ? Math.round(
                  scores.reduce((sum, score) => sum + score, 0) /
                      scores.length
              )
            : 0;

        const bestScore = scores.length ? Math.max(...scores) : 0;

        return {
            totalPlans: safeReports.length,
            averageScore,
            bestScore,
            totalQuestions,
            completedPlans: safeReports.filter(
                (report) => Number(report.matchScore || 0) >= 80
            ).length
        };
    }, [safeReports]);

    // ==========SCORE LEVEL=================
    const getScoreLevel = (score) => {
        if (score >= 80) return "Strong";
        if (score >= 60) return "Good";
        if (score > 0) return "Needs Work";
        return "Not Started";
    };

    // ==========RECENT REPORTS=================
    const recentReports = safeReports.slice(0, 5);

    // ==========LOADING=================
    if (loading) {
        return (
            <div className="progress-loading">
                <div className="progress-spinner"></div>
                <p>Loading your progress...</p>
            </div>
        );
    }

    return (
        <div className="progress-page">

            {/* ==========HEADER================= */}
            <div className="progress-header">
                <div>
                    <span className="progress-eyebrow">YOUR PERFORMANCE</span>
                    <h1>Progress</h1>
                    <p>
                        Track your interview preparation and see how your
                        performance is improving.
                    </p>
                </div>

                <button
                    type="button"
                    className="progress-back-button"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>
            </div>

            {/* ==========SUMMARY CARDS================= */}
            <div className="progress-summary-grid">

                <div className="progress-summary-card">
                    <div className="progress-summary-icon">◎</div>
                    <div>
                        <span>Total Plans</span>
                        <strong>{progressData.totalPlans}</strong>
                    </div>
                </div>

                <div className="progress-summary-card">
                    <div className="progress-summary-icon">↗</div>
                    <div>
                        <span>Average Score</span>
                        <strong>{progressData.averageScore}%</strong>
                    </div>
                </div>

                <div className="progress-summary-card">
                    <div className="progress-summary-icon">★</div>
                    <div>
                        <span>Best Score</span>
                        <strong>{progressData.bestScore}%</strong>
                    </div>
                </div>

                <div className="progress-summary-card">
                    <div className="progress-summary-icon">✓</div>
                    <div>
                        <span>Strong Plans</span>
                        <strong>{progressData.completedPlans}</strong>
                    </div>
                </div>

            </div>

            {/* ==========MAIN GRID================= */}
            <div className="progress-main-grid">

                {/* ==========PERFORMANCE OVERVIEW================= */}
                <section className="progress-card performance-card">
                    <div className="progress-card-header">
                        <div>
                            <span className="progress-card-label">
                                OVERVIEW
                            </span>
                            <h2>Performance Overview</h2>
                        </div>
                    </div>

                    {safeReports.length === 0 ? (
                        <div className="progress-empty">
                            <div className="progress-empty-icon">✦</div>
                            <h3>No progress yet</h3>
                            <p>
                                Create your first interview plan to start
                                tracking your preparation.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                            >
                                Create Interview Plan
                            </button>
                        </div>
                    ) : (
                        <div className="performance-content">

                            <div className="performance-score">
                                <div
                                    className="score-circle"
                                    style={{
                                        "--score": `${progressData.averageScore}%`
                                    }}
                                >
                                    <strong>
                                        {progressData.averageScore}%
                                    </strong>
                                    <span>Average</span>
                                </div>

                                <div className="performance-info">
                                    <h3>
                                        {getScoreLevel(
                                            progressData.averageScore
                                        )}
                                    </h3>
                                    <p>
                                        Your average interview-plan match
                                        score is based on your generated
                                        preparation plans.
                                    </p>
                                </div>
                            </div>

                            <div className="progress-metrics">

                                <div className="progress-metric">
                                    <div className="metric-top">
                                        <span>Best Match Score</span>
                                        <strong>
                                            {progressData.bestScore}%
                                        </strong>
                                    </div>

                                    <div className="metric-bar">
                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    progressData.bestScore,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="progress-metric">
                                    <div className="metric-top">
                                        <span>Average Performance</span>
                                        <strong>
                                            {progressData.averageScore}%
                                        </strong>
                                    </div>

                                    <div className="metric-bar">
                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    progressData.averageScore,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </section>

                {/* ==========PREPARATION STATS================= */}
                <section className="progress-card preparation-card">
                    <div className="progress-card-header">
                        <div>
                            <span className="progress-card-label">
                                PREPARATION
                            </span>
                            <h2>Activity</h2>
                        </div>
                    </div>

                    <div className="activity-list">

                        <div className="activity-item">
                            <div className="activity-icon">◈</div>
                            <div>
                                <strong>{progressData.totalPlans}</strong>
                                <span>Interview Plans</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">?</div>
                            <div>
                                <strong>
                                    {progressData.totalQuestions}
                                </strong>
                                <span>Practice Questions</span>
                            </div>
                        </div>

                        <div className="activity-item">
                            <div className="activity-icon">✓</div>
                            <div>
                                <strong>
                                    {progressData.completedPlans}
                                </strong>
                                <span>Strong Matches</span>
                            </div>
                        </div>

                    </div>
                </section>

            </div>

            {/* ==========RECENT PERFORMANCE================= */}
            <section className="progress-card recent-progress-card">
                <div className="progress-card-header">
                    <div>
                        <span className="progress-card-label">
                            RECENT ACTIVITY
                        </span>
                        <h2>Recent Interview Plans</h2>
                    </div>

                    {safeReports.length > 0 && (
                        <button
                            type="button"
                            className="view-all-button"
                            onClick={() => navigate("/plans")}
                        >
                            View All →
                        </button>
                    )}
                </div>

                {recentReports.length === 0 ? (
                    <div className="recent-empty">
                        <p>No interview plans available yet.</p>
                    </div>
                ) : (
                    <div className="recent-list">
                        {recentReports.map((report, index) => {
                            const score = Number(
                                report.matchScore || 0
                            );

                            const title =
                                report.title ||
                                report.jobTitle ||
                                "Interview Preparation Plan";

                            return (
                                <div
                                    className="recent-item"
                                    key={report._id || index}
                                >
                                    <div className="recent-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    <div className="recent-details">
                                        <h3>{title}</h3>

                                        <span>
                                            {report.createdAt
                                                ? new Date(
                                                      report.createdAt
                                                  ).toLocaleDateString(
                                                      "en-IN",
                                                      {
                                                          day: "2-digit",
                                                          month: "short",
                                                          year: "numeric"
                                                      }
                                                  )
                                                : "Recently created"}
                                        </span>
                                    </div>

                                    <div className="recent-score">
                                        <strong>{score}%</strong>
                                        <span>
                                            {getScoreLevel(score)}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/interview/${report._id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ==========PRACTICE CTA================= */}
            <section className="progress-cta">
                <div>
                    <span>KEEP GOING</span>
                    <h2>Ready for your next practice session?</h2>
                    <p>
                        Choose an interview plan and practice technical or
                        behavioral questions with AI evaluation.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/practice")}
                >
                    Start Practice →
                </button>
            </section>

        </div>
    );
};

export default Progress;