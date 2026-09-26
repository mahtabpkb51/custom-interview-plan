import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router"
import "../style/practiceSession.scss"
import { useInterview } from "../hooks/useInterview"

const PracticeSession = () => {
    const navigate = useNavigate()
    const { interviewId } = useParams()
    const [searchParams] = useSearchParams()

    const {
        report,
        loading,
        evaluateAnswer
    } = useInterview()

    const [questionType, setQuestionType] = useState(
        searchParams.get("type") || "technical"
    )

    const [currentIndex, setCurrentIndex] = useState(0)
    const [answer, setAnswer] = useState("")
    const [showGuidance, setShowGuidance] = useState(false)

    // ==========ANSWER EVALUATION STATE=================
    const [evaluation, setEvaluation] = useState(null)
    const [evaluating, setEvaluating] = useState(false)
    const [evaluationError, setEvaluationError] = useState("")

    // ==========GET QUESTIONS=================
    const questions = useMemo(() => {
        if (!report) {
            return []
        }

        if (questionType === "technical") {
            return report.technicalQuestions || []
        }

        if (questionType === "behavioral") {
            return report.behavioralQuestions || []
        }

        const technicalQuestions = report.technicalQuestions || []
        const behavioralQuestions = report.behavioralQuestions || []

        return [
            ...technicalQuestions,
            ...behavioralQuestions
        ]
    }, [report, questionType])

    // ==========CURRENT QUESTION=================
    const currentQuestion = questions[currentIndex]

    // ==========QUESTION TYPE CHANGE=================
    const handleQuestionTypeChange = (type) => {
        setQuestionType(type)
        setCurrentIndex(0)
        setAnswer("")
        setShowGuidance(false)
        setEvaluation(null)
        setEvaluationError("")
    }

    // ==========SUBMIT ANSWER FOR AI EVALUATION=================
const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
        setEvaluationError("Please write your answer first.")
        return
    }

    setEvaluating(true)
    setEvaluationError(null)

    try {
        const result = await evaluateAnswer({
            interviewReportId: interviewId,
            question: currentQuestion.question,
            expectedAnswer: currentQuestion.answer,
            candidateAnswer: answer,
            questionType
        })

        setEvaluation(result)
    } catch (error) {
        console.error("Answer evaluation error:", error)

        setEvaluationError(
            error?.message ||
            "Failed to evaluate your answer. Please try again."
        )
    } finally {
        setEvaluating(false)
    }
}

    // ==========NEXT QUESTION=================
    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((previous) => previous + 1)
            setAnswer("")
            setShowGuidance(false)
            setEvaluation(null)
            setEvaluationError("")
        }
    }

    // ==========PREVIOUS QUESTION=================
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((previous) => previous - 1)
            setAnswer("")
            setShowGuidance(false)
            setEvaluation(null)
            setEvaluationError("")
        }
    }

    // ==========BACK TO PRACTICE=================
    const handleBack = () => {
        navigate("/practice", {
            replace: true
        })
    }

    // ==========UPDATE URL=================
    useEffect(() => {
        const typeFromUrl = searchParams.get("type")

        if (
            typeFromUrl === "technical" ||
            typeFromUrl === "behavioral" ||
            typeFromUrl === "random"
        ) {
            setQuestionType(typeFromUrl)
        }
    }, [searchParams])

    // ==========LOADING STATE=================
    if (loading) {
        return (
            <div className="practice-session-page">
                <div className="practice-session-loading">
                    <div className="practice-loading-spinner"></div>
                    <h2>Loading Practice Session...</h2>
                    <p>Preparing your interview questions.</p>
                </div>
            </div>
        )
    }

    // ==========NO REPORT STATE=================
    if (!report) {
        return (
            <div className="practice-session-page">
                <div className="practice-session-empty">
                    <h2>Practice session not found</h2>
                    <p>
                        We could not find the interview plan for this session.
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                    >
                        ← Back to Practice
                    </button>
                </div>
            </div>
        )
    }

    // ==========NO QUESTIONS STATE=================
    if (!questions.length) {
        return (
            <div className="practice-session-page">
                <div className="practice-session-empty">
                    <h2>No questions available</h2>
                    <p>
                        There are no questions available for this practice mode.
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                    >
                        ← Back to Practice
                    </button>
                </div>
            </div>
        )
    }

    const progress = ((currentIndex + 1) / questions.length) * 100

    return (
        <div className="practice-session-page">

            {/* ==========HEADER================= */}
            <header className="practice-session-header">

                <button
                    type="button"
                    className="practice-session-back"
                    onClick={handleBack}
                >
                    ← Back
                </button>

                <div className="practice-session-heading">
                    <span>AI Practice Session</span>
                    <h1>Interview Practice</h1>
                </div>

                <div className="practice-session-count">
                    {currentIndex + 1} / {questions.length}
                </div>

            </header>

            {/* ==========MAIN CONTENT================= */}
            <main className="practice-session-content">

                {/* ==========QUESTION TYPE TABS================= */}
                <div className="practice-session-tabs">

                    <button
                        type="button"
                        className={
                            questionType === "technical"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            handleQuestionTypeChange("technical")
                        }
                    >
                        Technical
                    </button>

                    <button
                        type="button"
                        className={
                            questionType === "behavioral"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            handleQuestionTypeChange("behavioral")
                        }
                    >
                        Behavioral
                    </button>

                    <button
                        type="button"
                        className={
                            questionType === "random"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            handleQuestionTypeChange("random")
                        }
                    >
                        Random
                    </button>

                </div>

                {/* ==========PROGRESS================= */}
                <div className="practice-progress-section">

                    <div className="practice-progress-info">
                        <span>Progress</span>
                        <span>
                            {currentIndex + 1} of {questions.length}
                        </span>
                    </div>

                    <div className="practice-progress-bar">
                        <div
                            className="practice-progress-fill"
                            style={{
                                width: `${progress}%`
                            }}
                        />
                    </div>

                </div>

                {/* ==========QUESTION CARD================= */}
                <section className="practice-question-card">

                    <div className="practice-question-label">
                        Question {currentIndex + 1}
                    </div>

                    <h2>
                        {currentQuestion.question}
                    </h2>

                    {/* ==========ANSWER INPUT================= */}
                    <div className="practice-answer-section">

                        <label htmlFor="candidate-answer">
                            Your Answer
                        </label>

                        <textarea
                            id="candidate-answer"
                            value={answer}
                            onChange={(event) =>
                                setAnswer(event.target.value)
                            }
                            placeholder="Type your answer here..."
                            rows={8}
                            disabled={evaluating}
                        />

                        <div className="practice-answer-actions">

                            <span>
                                {answer.trim().length} characters
                            </span>

                            <button
                                type="button"
                                className="practice-submit-button"
                                onClick={handleSubmitAnswer}
                                disabled={
                                    evaluating ||
                                    !answer.trim()
                                }
                            >
                                {evaluating
                                    ? "AI Evaluating..."
                                    : "Submit Answer"}
                            </button>

                        </div>

                    </div>

                    {/* ==========EVALUATION ERROR================= */}
                    {evaluationError && (
                        <div className="practice-evaluation-error">
                            {evaluationError}
                        </div>
                    )}

                    {/* ==========AI EVALUATION================= */}
                    {evaluation && (
                        <div className="practice-evaluation-panel">

                            <div className="evaluation-header">
                                <div>
                                    <span>AI Evaluation</span>
                                    <h3>Your Answer Feedback</h3>
                                </div>

                                <div className="evaluation-score">
                                    <strong>
                                        {evaluation.score}
                                    </strong>
                                    <span>/10</span>
                                </div>
                            </div>

                            {/* ==========FEEDBACK================= */}
                            <div className="evaluation-feedback">
                                <h4>Overall Feedback</h4>
                                <p>
                                    {evaluation.feedback}
                                </p>
                            </div>

                            {/* ==========STRENGTHS================= */}
                            <div className="evaluation-section">
                                <h4>✓ What You Did Well</h4>

                                <ul>
                                    {evaluation.strengths?.map(
                                        (strength, index) => (
                                            <li key={index}>
                                                {strength}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* ==========IMPROVEMENTS================= */}
                            <div className="evaluation-section">
                                <h4>↗ What You Can Improve</h4>

                                <ul>
                                    {evaluation.improvements?.map(
                                        (improvement, index) => (
                                            <li key={index}>
                                                {improvement}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            {/* ==========BETTER ANSWER================= */}
                            <div className="evaluation-better-answer">
                                <h4>Better Answer</h4>

                                <p>
                                    {evaluation.betterAnswer}
                                </p>
                            </div>

                        </div>
                    )}

                    {/* ==========PREPARATION GUIDANCE================= */}
                    <div className="practice-guidance-section">

                        <button
                            type="button"
                            className="practice-guidance-button"
                            onClick={() =>
                                setShowGuidance(!showGuidance)
                            }
                        >
                            {showGuidance
                                ? "Hide Preparation Guidance"
                                : "Show Preparation Guidance"}
                        </button>

                        {showGuidance && (
                            <div className="practice-guidance-content">
                                <h4>What interviewer expects</h4>

                                <p>
                                    {currentQuestion.intention}
                                </p>

                                <h4>Expected Answer Approach</h4>

                                <p>
                                    {currentQuestion.answer}
                                </p>
                            </div>
                        )}

                    </div>

                </section>

                {/* ==========QUESTION NAVIGATION================= */}
                <div className="practice-question-navigation">

                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        ← Previous
                    </button>

                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={
                            currentIndex === questions.length - 1
                        }
                    >
                        Next →
                    </button>

                </div>

            </main>

        </div>
    )
}

export default PracticeSession