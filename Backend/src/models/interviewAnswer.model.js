const mongoose = require("mongoose")

// ==========INTERVIEW ANSWER SCHEMA=================
const interviewAnswerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        interviewReport: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InterviewReport",
            required: true
        },

        question: {
            type: String,
            required: true
        },

        questionType: {
            type: String,
            enum: ["technical", "behavioral", "random"],
            required: true
        },

        expectedAnswer: {
            type: String,
            default: ""
        },

        candidateAnswer: {
            type: String,
            required: true
        },

        score: {
            type: Number,
            min: 0,
            max: 10,
            required: true
        },

        strengths: {
            type: [String],
            default: []
        },

        improvements: {
            type: [String],
            default: []
        },

        betterAnswer: {
            type: String,
            default: ""
        },

        feedback: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model(
    "InterviewAnswer",
    interviewAnswerSchema
)
