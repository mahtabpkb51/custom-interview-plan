import {
    getAllInterviewReports,
    generateInterviewReport,
    getInterviewReportById,
    generateResumePdf,
    evaluateInterviewAnswer
} from "../services/interview.api"

import { useContext, useEffect } from "react"
import { InterviewContext } from "../interview.context"
import { useParams } from "react-router"

export const useInterview = () => {
    const context = useContext(InterviewContext)
    const { interviewId } = useParams()

    // ==========CONTEXT VALIDATION=================
    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const {
        loading,
        setLoading,
        report,
        setReport,
        reports,
        setReports
    } = context

    // ==========GENERATE INTERVIEW REPORT=================
    const generateReport = async ({
        jobDescription,
        selfDescription,
        resumeFile
    }) => {
        setLoading(true)

        try {
            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            setReport(response.interviewReport)

            return response.interviewReport
        } catch (error) {
            console.error("Generate interview report error:", error)

            // ==========API ERROR MESSAGE=================
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to generate interview report."

            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    // ==========GET INTERVIEW REPORT BY ID=================
    const getReportById = async (interviewId) => {
        setLoading(true)

        try {
            const response = await getInterviewReportById(interviewId)

            setReport(response.interviewReport)

            return response.interviewReport
        } catch (error) {
            console.error("Get interview report error:", error)

            // ==========API ERROR MESSAGE=================
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to get interview report."

            throw new Error(message)
        } finally {
            setLoading(false)
        }
    }

    // ==========GET ALL INTERVIEW REPORTS=================
    const getReports = async () => {
        setLoading(true)

        try {
            const response = await getAllInterviewReports()

            setReports(response.interviewReports)

            return response.interviewReports
        } catch (error) {
            console.error("Get interview reports error:", error)

            // ==========API ERROR MESSAGE=================
            console.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to get interview reports."
            )

            return []
        } finally {
            setLoading(false)
        }
    }

    // ==========GENERATE RESUME PDF=================
    const getResumePdf = async (interviewReportId) => {
        try {
            const response = await generateResumePdf({
                interviewReportId
            })

            // ==========CREATE PDF BLOB=================
            const blob = new Blob([response], {
                type: "application/pdf"
            })

            // ==========CREATE DOWNLOAD URL=================
            const url = window.URL.createObjectURL(blob)

            // ==========CREATE DOWNLOAD LINK=================
            const link = document.createElement("a")

            link.href = url
            link.download = `resume_${interviewReportId}.pdf`

            document.body.appendChild(link)
            link.click()
            link.remove()

            // ==========RELEASE BLOB URL=================
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Generate resume PDF error:", error)

            // ==========SHOW PDF ERROR=================
            alert(
                error?.response?.data?.message ||
                "Failed to generate resume PDF. Please try again."
            )
        }
    }

    // ==========EVALUATE INTERVIEW ANSWER=================
    // ==========EVALUATE INTERVIEW ANSWER=================
const evaluateAnswer = async ({
    interviewReportId,
    question,
    expectedAnswer,
    candidateAnswer,
    questionType
}) => {
    try {
        const response = await evaluateInterviewAnswer({
            interviewReportId,
            question,
            expectedAnswer,
            candidateAnswer,
            questionType
        })

        return response.evaluation
    } catch (error) {
        console.error("Evaluate interview answer error:", error)

        // ==========API ERROR MESSAGE=================
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to evaluate interview answer."

        throw new Error(message)
    }
}

    // ==========LOAD REPORT DATA=================
    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
    }, [interviewId])

    // ==========RETURN INTERVIEW FUNCTIONS=================
    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf,
        evaluateAnswer
    }
}