const challenges = require("../models/challenges")
const books = require("../models/books")


const getChallenge = async (req, res) => {
    const user = req.user
    try {
        let challenge = await challenges.findOne({ userName: user.name })
        let book = await books.find({ _id: challenge.books })
        res.render("challenges", { challenge: challenge, user: user, books: book })

    } catch {
        res.render("challenges", { user: user, challenge: null })

    }


}

const addChallenge = (req, res) => {

    const user = req.user

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

    challenge.save().then(() => {
        res.redirect("/Goodsummaries/challenges")
    })
}

const deleteChallenge = (req, res) => {
    const id = req.params.id

    challenges.deleteOne({ _id: id }).then(() => {
        res.redirect("/Goodsummaries/challenges")
    })
}

const editChallenge = async (req, res) => {
    const id = req.params.id;

    let challenge = await challenges.findOne({ _id: id })

    challenge.numberOfBooks = req.body.numberOfBooks
    challenge.save().then(() => {
        res.redirect("/Goodsummaries/challenges")
    })
}

module.exports = {
    getChallenge,
    addChallenge,
    deleteChallenge,
    editChallenge
}