const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// ==========INTERVIEW REPORT SCHEMA=================
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question that can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day")
    })).describe("A day-wise preparation plan for the candidate"),
    title: z.string().describe("The title of the job for which the interview report is generated")
})

// ==========ANSWER EVALUATION SCHEMA=================
const answerEvaluationSchema = z.object({
    score: z.number().min(0).max(10).describe("Score of the candidate answer from 0 to 10"),
    strengths: z.array(z.string()).describe("Specific things the candidate did well in the answer"),
    improvements: z.array(z.string()).describe("Specific things the candidate should improve"),
    betterAnswer: z.string().describe("A clear and improved version of the candidate answer"),
    feedback: z.string().describe("Short overall feedback for the candidate")
})

// ==========GENERATE INTERVIEW REPORT=================
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text)
}

// ==========EVALUATE INTERVIEW ANSWER=================
async function evaluateInterviewAnswer({
    question,
    expectedAnswer,
    candidateAnswer,
    questionType
}) {

    const prompt = `You are an expert technical interviewer.

Evaluate the candidate's interview answer.

Question Type:
${questionType}

Interview Question:
${question}

Expected Answer / Important Points:
${expectedAnswer}

Candidate Answer:
${candidateAnswer}

Evaluate the answer based on:
1. Correctness
2. Relevance
3. Technical understanding
4. Completeness
5. Clarity

Important instructions:
- Give a fair score from 0 to 10.
- Do not give a high score just because the answer is long.
- Do not penalize simple English if the technical meaning is correct.
- Mention concrete strengths.
- Mention concrete improvements.
- Provide a better interview-ready answer.
- Keep the feedback useful for a student preparing for interviews.
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(answerEvaluationSchema),
        }
    })

    return JSON.parse(response.text)
}

// ==========GENERATE PDF FROM HTML=================
async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch()

    const page = await browser.newPage()

    await page.setContent(htmlContent, {
        waitUntil: "networkidle0"
    })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

// ==========GENERATE RESUME PDF=================
async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema = z.object({
        html: z.string().describe(
            "The HTML content of the resume which can be converted to PDF using Puppeteer"
        )
    })

    const prompt = `Generate resume for a candidate with the following details:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

The response should be a JSON object with a single field "html" which contains the HTML content of the resume.

The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience.

The content should sound human-written and professional.

The HTML content should be well-formatted and structured.

The content should be ATS friendly.

The resume should ideally be 1-2 pages long.

Focus on quality rather than quantity.
`

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = {
    generateInterviewReport,
    evaluateInterviewAnswer,
    generateResumePdf
}