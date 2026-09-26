import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
import "../style/myPlans.scss";

// ==========MY PLANS PAGE=================
const MyPlans = () => {
    const navigate = useNavigate();

    const { reports, loading } = useInterview();

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // ==========FORMAT DATE=================
    const formatDate = (date) => {
        if (!date) return "Recently created";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    // ==========GET REPORT TITLE=================
    const getTitle = (report) => {
        return (
            report?.title ||
            report?.jobTitle ||
            report?.jobDescription?.slice(0, 45) ||
            "Interview Preparation Plan"
        );
    };

    // ==========GET MATCH SCORE=================
    const getMatchScore = (report) => {
        return report?.matchScore ?? 0;
    };

    // ==========GET QUESTION COUNT=================
    const getTechnicalCount = (report) => {
        return (
            report?.technicalQuestions?.length ??
            report?.technicalQuestionCount ??
            0
        );
    };

    const getBehavioralCount = (report) => {
        return (
            report?.behavioralQuestions?.length ??
            report?.behavioralQuestionCount ??
            0
        );
    };

    // ==========FILTER REPORTS=================
    const filteredReports = useMemo(() => {
        const data = reports || [];

        return data.filter((report) => {
            const title = getTitle(report).toLowerCase();
            const matchesSearch = title.includes(search.toLowerCase());

            let matchesFilter = true;

            if (filter === "high") {
                matchesFilter = getMatchScore(report) >= 80;
            }

            if (filter === "medium") {
                matchesFilter =
                    getMatchScore(report) >= 60 &&
                    getMatchScore(report) < 80;
            }

            if (filter === "low") {
                matchesFilter = getMatchScore(report) < 60;
            }

            return matchesSearch && matchesFilter;
        });
    }, [reports, search, filter]);

    // ==========OPEN INTERVIEW PLAN=================
    const handleViewPlan = (id) => {
        if (!id) return;

        navigate(`/interview/${id}`);
    };

    // ==========LOADING STATE=================
    if (loading) {
        return (
            <div className="my-plans-loading">
                <div className="plans-spinner"></div>
                <p>Loading your interview plans...</p>
            </div>
        );
    }

    return (
        <div className="my-plans-page">

            {/* ==========PAGE HEADER================= */}
            <section className="plans-header">
                <div>
                    <span className="plans-eyebrow">
                        INTERVIEW WORKSPACE
                    </span>

                    <h1>My Interview Plans</h1>

                    <p>
                        Manage your interview preparation plans and continue
                        practicing for your next opportunity.
                    </p>
                </div>

            </section>

            {/* ==========SEARCH AND FILTERS================= */}
            <section className="plans-toolbar">

                <div className="plans-search">
                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search interview plans..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="plans-filters">

                    <button
                        className={filter === "all" ? "active" : ""}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>

                    <button
                        className={filter === "high" ? "active" : ""}
                        onClick={() => setFilter("high")}
                    >
                        80%+
                    </button>

                    <button
                        className={filter === "medium" ? "active" : ""}
                        onClick={() => setFilter("medium")}
                    >
                        60–79%
                    </button>

                    <button
                        className={filter === "low" ? "active" : ""}
                        onClick={() => setFilter("low")}
                    >
                        Below 60%
                    </button>

                </div>
            </section>

            {/* ==========PLAN COUNT================= */}
            <div className="plans-count">
                <span>
                    {filteredReports.length}{" "}
                    {filteredReports.length === 1 ? "plan" : "plans"}
                </span>

                {search && (
                    <span className="search-result-text">
                        Results for "{search}"
                    </span>
                )}
            </div>

            {/* ==========EMPTY STATE================= */}
            {filteredReports.length === 0 ? (
                <section className="plans-empty">

                    <div className="empty-icon">
                        ✦
                    </div>

                    <h2>
                        {reports?.length === 0
                            ? "No interview plans yet"
                            : "No matching plans"}
                    </h2>

                    <p>
                        {reports?.length === 0
                            ? "Create your first AI-powered interview plan and start preparing."
                            : "Try changing your search or filter."}
                    </p>

                    {reports?.length === 0 && (
                        <button
                            className="empty-create-btn"
                            onClick={() => navigate("/")}
                        >
                            Create Interview Plan
                        </button>
                    )}

                </section>
            ) : (

                /* ==========PLANS GRID================= */
                <section className="plans-grid">

                    {filteredReports.map((report) => {

                        const id = report?._id;
                        const score = getMatchScore(report);
                        const technical = getTechnicalCount(report);
                        const behavioral = getBehavioralCount(report);

                        return (
                            <article
                                className="plan-card"
                                key={id}
                            >

                                {/* ==========CARD TOP================= */}
                                <div className="plan-card-top">

                                    <div className="plan-icon">
                                        ✦
                                    </div>

                                    <div className="plan-score">
                                        <strong>{score}%</strong>
                                        <span>Match</span>
                                    </div>

                                </div>

                                {/* ==========CARD CONTENT================= */}
                                <div className="plan-card-content">

                                    <h2>
                                        {getTitle(report)}
                                    </h2>

                                    <p className="plan-date">
                                        Created {formatDate(
                                            report?.createdAt ||
                                            report?.updatedAt
                                        )}
                                    </p>

                                    {/* ==========PLAN META================= */}
                                    <div className="plan-meta">

                                        <div>
                                            <span className="meta-number">
                                                {technical}
                                            </span>

                                            <span className="meta-label">
                                                Technical
                                            </span>
                                        </div>

                                        <div>
                                            <span className="meta-number">
                                                {behavioral}
                                            </span>

                                            <span className="meta-label">
                                                Behavioral
                                            </span>
                                        </div>

                                        <div>
                                            <span className="meta-number">
                                                {score}%
                                            </span>

                                            <span className="meta-label">
                                                Match
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                {/* ==========VIEW PLAN BUTTON================= */}
                                <button
                                    className="view-plan-btn"
                                    onClick={() => handleViewPlan(id)}
                                >
                                    View Interview Plan
                                    <span>→</span>
                                </button>

                            </article>
                        );
                    })}

                </section>
            )}

        </div>
    );
};

export default MyPlans;