const { number, boolean } = require("@hapi/joi")
const mongoose = require("mongoose")

const challengesSchema = new mongoose.Schema({

    numberOfBooks: {
        type: Number,
        default: 0,
        required: true,
    },
    numberOfSummaries: {
        type: Number,
        default: 0,
    },

    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },

    finished: {
        type: Boolean,
        default: false,
    },

    books: [String]

}, { timestamps: true })

const challenges = mongoose.model("challanges", challengesSchema)
module.exports = challenges;