const books = require(`../models/books`);
const challenges = require(`../models/challenges`)


function searchRules(req, res) {
    let searchRules = {Category:"Fantsy"}
    if (req.query.Category !== `All` && req.query.Category !== `` && req.query.Category !== undefined) { searchRules.Category = req.query.Category }
    if (req.query.Title != null && req.query.Title !== ``) { searchRules.Title = new RegExp(req.query.Title, "i") }
    if (req.query.Writer != null && req.query.Writer !== ``) { searchRules.Publisher = new RegExp(req.query.Writer, "i") }
    return searchRules
}


const getMainPage = async (req, res) => {

    try {
        const user = req.user
        const searchrules = searchRules(req, res)
        const allBooks = await books.find(searchrules, { WhoLoveIt: 0, Summary: 0, Category: 0 }).limit(2)

        if (user) {
            let savedBooks = await books.findOne({ _id: user.savedBooks }, { WhoLoveIt: 0, Summary: 0, Category: 0 })
            let challenge = await challenges.findOne({ userName: user.name, finished: false }, { books: 0, startDate: 0, endDate: 0 })

            if (challenge) {
                res.render(`Home/home`, { books: allBooks, title: `Goodsummaries-Home`, savedBooks: savedBooks, challenge: challenge, user: user })
            } else {
                res.render(`Home/home`, { books: allBooks, title: `Goodsummaries-Home`, user: user, savedBooks: savedBooks, challenge: challenge })
            }

        } else {
            res.render(`Home/home`, { books: allBooks, title: `Goodsummaries-Home`, savedBooks: null })
        }
    } catch {
        res.render(`errorPage`, { errorMessage: "something went wrong, try to reload the page again" })
    }
}

module.exports = {
    getMainPage
}