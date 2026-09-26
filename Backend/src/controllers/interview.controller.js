const pdfParse = require("pdf-parse")
const {
    generateInterviewReport,
    generateResumePdf,
    evaluateInterviewAnswer
} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")
const interviewAnswerModel = require("../models/interviewAnswer.model")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body

        // ==========JOB DESCRIPTION VALIDATION=================
        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Job description is required."
            })
        }

        // ==========RESUME AND SELF DESCRIPTION VALIDATION=================
        if (!req.file && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({
                message: "Please provide a resume or self description."
            })
        }

        // ==========RESUME CONTENT=================
        let resumeContent = ""

        if (req.file) {
            // ==========RESUME FILE TYPE VALIDATION=================
            if (req.file.mimetype !== "application/pdf") {
                return res.status(400).json({
                    message: "Only PDF resumes are supported."
                })
            }

            // ==========PARSE RESUME=================
            const parsedResume = await new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            ).getText()

            resumeContent = parsedResume.text || ""
        }

        // ==========GENERATE INTERVIEW REPORT WITH AI=================
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim()
        })

        // ==========SAVE INTERVIEW REPORT=================
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription: jobDescription.trim(),
            ...interViewReportByAi
        })

        // ==========SEND SUCCESS RESPONSE=================
        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Generate interview report error:", error)

        // ==========SEND ERROR RESPONSE=================
        res.status(500).json({
            message: error.message || "Failed to generate interview report."
        })
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    } catch (error) {
        console.error("Get interview report error:", error)

        res.status(500).json({
            message: error.message || "Failed to get interview report."
        })
    }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    } catch (error) {
        console.error("Get interview reports error:", error)

        res.status(500).json({
            message: error.message || "Failed to get interview reports."
        })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        // ==========FIND USER REPORT=================
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription } = interviewReport

        // ==========GENERATE RESUME PDF=================
        const pdfBuffer = await generateResumePdf({
            resume: resume || "",
            selfDescription: selfDescription || "",
            jobDescription: jobDescription || ""
        })

        // ==========SEND PDF RESPONSE=================
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume_${interviewReportId}.pdf"`,
            "Content-Length": pdfBuffer.length
        })

        res.status(200).send(pdfBuffer)
    } catch (error) {
        console.error("Generate resume PDF error:", error)

        // ==========PDF GENERATION ERROR=================
        res.status(500).json({
            message: error.message || "Failed to generate resume PDF."
        })
    }
}

/**
 * @description Controller to evaluate candidate answer using AI.
 */
// ==========EVALUATE INTERVIEW ANSWER CONTROLLER=================
async function evaluateInterviewAnswerController(req, res) {
    try {
        const {
            interviewReportId,
            question,
            expectedAnswer,
            candidateAnswer,
            questionType
        } = req.body

        // ==========INTERVIEW REPORT ID VALIDATION=================
        if (!interviewReportId) {
            return res.status(400).json({
                message: "Interview report ID is required."
            })
        }

        // ==========QUESTION VALIDATION=================
        if (!question || !question.trim()) {
            return res.status(400).json({
                message: "Question is required."
            })
        }

        // ==========CANDIDATE ANSWER VALIDATION=================
        if (!candidateAnswer || !candidateAnswer.trim()) {
            return res.status(400).json({
                message: "Candidate answer is required."
            })
        }

        // ==========FIND INTERVIEW REPORT=================
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        })

        // ==========INTERVIEW REPORT OWNERSHIP VALIDATION=================
        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        // ==========EVALUATE ANSWER WITH AI=================
        const evaluation = await evaluateInterviewAnswer({
            question: question.trim(),
            expectedAnswer: expectedAnswer || "",
            candidateAnswer: candidateAnswer.trim(),
            questionType: questionType || "technical"
        })

        // ==========SAVE ANSWER EVALUATION=================
        const interviewAnswer = await interviewAnswerModel.create({
            user: req.user.id,
            interviewReport: interviewReportId,
            question: question.trim(),
            questionType: questionType || "technical",
            expectedAnswer: expectedAnswer || "",
            candidateAnswer: candidateAnswer.trim(),
            score: evaluation.score,
            strengths: evaluation.strengths || [],
            improvements: evaluation.improvements || [],
            betterAnswer: evaluation.betterAnswer || "",
            feedback: evaluation.feedback || ""
        })

        // ==========SEND EVALUATION RESPONSE=================
        res.status(200).json({
            message: "Answer evaluated and saved successfully.",
            evaluation,
            interviewAnswer
        })
    } catch (error) {
        console.error("Evaluate interview answer error:", error)

        // ==========EVALUATION ERROR=================
        res.status(500).json({
            message: error.message || "Failed to evaluate interview answer."
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    evaluateInterviewAnswerController
}