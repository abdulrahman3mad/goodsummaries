const challenges = require("../models/challenges")
const books = require("../models/books")
const users = require("../models/users")




const getChallenge = async (req, res) => {
    const user = req.user
    let currentUser = false;

    if (!user) {
        res.render(`Auth/login`, { errorMakingUser: `` })
    }
    else {
        if (user.name == req.params.name) {
            currentUser = true;
        }
        try {
            let challenge = await challenges.findOne({ userName: user.name, finished: false })
            let previousChallenges = await challenges.find({ userName: user.name })
            let book = await books.find({ _id: challenge.books })



            res.render("challengesPackage/challenges", { challenge: challenge, user: user, books: book, previousChallenges: previousChallenges, currentUser: currentUser })
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

        const challenge = new challenges({
            numberOfBooks: req.body.numberOfBooks,
            userName: user.name
        })

        user.followers.forEach(async follower => {
            let userFollower = await users.findOne({ name: follower });
            userFollower.status.push({
                userName: user.name,
                statusMessage: `intend to summarize ${req.body.numberOfBooks} in 2021 :)`,
                statusLink: `challenges/${user.name}`,
                seen: false
            })
            await userFollower.save()
        })
        await challenge.save()
        res.redirect(`/Goodsummaries/challenges/${req.user.name}`)

    } catch {
        console.log("hello")
        res.render(`errorPage`, { errorMessage: "something went wrong, try to reload the page again" })
    }

}

const deleteChallenge = async (req, res) => {
    try {
        const id = req.params.id
        await challenges.deleteOne({ _id: id })
        res.redirect(`/Goodsummaries/challenges/${req.user.name}`)
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
        res.redirect(`/Goodsummaries/challenges/${req.user.name}`)

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