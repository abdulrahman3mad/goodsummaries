const challenges = require("../models/challenges")
const books = require("../models/books")




const getChallenge = async (req, res) => {
    const user = req.user

    if (!user) {
        res.render(`Auth/login`, { errorMakingUser: `` })
    }
    else {
        try {
            let challenge = await challenges.findOne({ userName: user.name, finished: false })
            let previousChallenges = await challenges.find({ userName: user.name })
            let book = await books.find({ _id: challenge.books })

            console.log(challenge.numberOfBooks);
            console.log(challenge.numberOfSummaries);

            res.render("challengesPackage/challenges", { challenge: challenge, user: user, books: book, previousChallenges: previousChallenges })
        } catch {
            res.render("challengesPackage/challenges", { user: user, challenge: null })
        }
    }
}

function getCurrentDate() {

    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth()
    let year = date.getFullYear()

    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    let currentDate = year + "-" + month + "-" + day
    return currentDate
}

const addChallenge = async (req, res) => {


    try {
        const user = req.user
        let currentDate = getCurrentDate()

        const challenge = new challenges({
            challengeName: req.body.challengeName,
            numberOfBooks: req.body.numberOfBooks,
            endDate: req.body.endDate,
            userName: user.name
        })

        if (req.body.startDate) {
            challenge.startDate = req.body.startDate
        }
        else {
            challenge.startDate = currentDate;
        }
        await challenge.save()
        res.redirect("/Goodsummaries/challenges")
    } catch {
        res.render(`errorPage`, { errorMessage: "something went wrong, try to reload the page again" })
    }

}

const deleteChallenge = async (req, res) => {
    try {
        const id = req.params.id
        await challenges.deleteOne({ _id: id })
        res.redirect("/Goodsummaries/challenges")
    } catch {
        res.render(`errorPage`, { errorMessage: "something went wrong, try to reload the page again" })
    }
}

const editChallenge = async (req, res) => {
    try {
        const id = req.params.id;
        let challenge = await challenges.findOne({ _id: id })
        challenge.numberOfBooks = req.body.numberOfBooks
        await challenge.save()
        res.redirect("/Goodsummaries/challenges")
    } catch {
        res.render(`errorPage`, { errorMessage: "something went wrong, try to reload the page again" })
    }
}

module.exports = {
    getChallenge,
    addChallenge,
    deleteChallenge,
    editChallenge
}