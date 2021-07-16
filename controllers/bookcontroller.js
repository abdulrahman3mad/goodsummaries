const books = require(`../models/books`);
const users = require(`../models/users`);
const challenges = require(`../models/challenges`)
const acceptedfiles = [`image/jpeg`, `image/png`];


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



const getPublishPage = async (req, res) => {
    const user = req.user;
    if (!user) {
        res.render(`Auth/login`, { errorMakingUser: `` })
    }
    else {
        const challenge = await challenges.find({ userName: user.name })

        try {
            res.render(`PublishFolder/publish`, { title: `Publish`, challenges: challenge });
        }
        catch (err) {
            res.render(`errorPage`, { title: `Error`, errroMessage: `can't get this page, try to reload the page` });
        }
    }

}


const addBook = async (req, res) => {
    try {
        let user = req.user;
        if (req.body.cover == null) res.render(`errorPage`, { errroMessage: `something went wrong.try to reload the page` })

        let book = new books({
            Title: req.body.Title,
            Summary: req.body.Summary,
            Category: req.body.Category,
            Publisher: user.name
        });
        bookSave(book, req.body.cover);
        await book.save();

        user.followers.forEach(async (follower) => {
            let userFollower = await users.findOne({ name: follower })
            userFollower.status.push({ userName: user.name, statusMessage: `Published a summary called ${req.body.Title}`, statusLink: `book/${book._id}`, seen: false })
            userFollower.save();
        })

        user.publishedBooks.push(book._id)
        await user.save()


        if (req.body.challengeCheck) {
            try {
                let challenge = await challenges.findOne({ userName: user.name, finished: false })
                challenge.books.push(book._id);
                challenge.numberOfSummaries++;
                if (challenge.numberOfBooks == challenge.numberOfSummaries) {
                    challenge.finished = true;
                }
                await challenge.save();
                res.redirect(`/`);

            } catch {
                res.redirect(`/`);
            }
        }
    } catch (error) {
        res.render(`errorPage`, { errroMessage: `something went wrong. try to reload the page` })
    }
}

function bookSave(book, coverEncoded) {
    const cover = JSON.parse(coverEncoded);
    if (cover != null && acceptedfiles.includes(cover.type)) {
        book.Coverimage = new Buffer.from(cover.data, `base64`);
        book.Coverimagetype = cover.type;
    }
}

const getBook = async (req, res) => {

    if (!req.user) {
        return res.redirect(`/login`);
    }
    try {
        const user = req.user;
        const id = req.params.id;

        let owner = false;
        let savedCheck = false;
        let liked = false;

        let book = await books.findById(id)
        if (req.originalUrl.includes("status"))

            //check if he has already liked it
            if (book.WhoLoveIt.indexOf(user._id) !== -1) liked = true
        //check if he is the owner of the book
        if (user.publishedBooks.indexOf(id) !== -1) owner = true
        //check if he saved the book before
        if (user.savedBooks.indexOf(book._id) !== -1) savedCheck = true
        res.render(`Book/book`, { book: book, user: user, owner: owner, saved: savedCheck, liked: liked })
    }
    catch {
        res.render(`errorPage`, { errorMessage: `can't get this page, try to reload the page`, Title: `Error` });
    }

}

const saveBook = async (req, res) => {

    const id = req.params.id
    const user = req.user;


    let book = await books.findById(id)
    user.savedBooks.push(book._id)
    await user.save()
    if (req.originalUrl.includes("book")) res.redirect(`/book/${id}`)
    else res.redirect(`/`)
}

const unSaveBook = async (req, res) => {
    let bookNumber = user.savedBooks.indexOf(req.params.id)
    req.user.savedBooks.splice(bookNumber, 1)
    await req.user.save()
    if (req.originalUrl.includes("book")) res.redirect(`/book/${id}`)
    else res.redirect(`/`)
}


const editBook = async (req, res) => {
    try {
        let book = await books.findById(req.params.id)
        res.render(`Book/editBook`, { book: book, user: req.user })
    }
    catch {
        res.render(`errorPage`, { errroMessage: `Something went wrong, please try to reload the page again`, Title: `Error` });
    }
}

const updateBook = async (req, res) => {

    try {
        const id = req.params.id;
        book = await books.findById(id)
        book.Title = req.body.Title;
        book.Summary = req.body.Summary;
        book.Category = req.body.Category;
        await book.save()
        res.redirect(`/book/${id}`);
    }
    catch {
        res.redirect(`/book/${id}`);
    }

}


const deleteBook = async (req, res) => {
    try {
        const id = req.params.id;
        const user = req.user;
        const bookIndex = user.publishedBooks.indexOf(id)
        user.publishedBooks.splice(bookIndex, 1)
        await books.deleteOne({ _id: id })
        await user.save()
        res.redirect(`/`);
    } catch {
        res.redirect(`errorPage`, { errroMessage: `can't get profile page, try to reload the page` });
    }
}


const likeSummary = async (req, res) => {

    try {
        const id = req.params.id;
        const user = req.user;
        await books.findById(id)
        book.WhoLoveIt.push(user._id)
        await book.save()
        res.redirect(`/Goodsummaries/book/${book._id}`);
    } catch {
        res.render(`errorPage`, { errorMessage: `something went wrong, try to reload the page again` })
    }
}

const unlikeSummary = async (req, res) => {

    try {
        const id = req.params.id;
        const user = req.user;
        let book = await books.findById(id)
        const userIndex = book.WhoLoveIt.indexOf(user._id)
        book.WhoLoveIt.splice(userIndex, 1)
        await book.save()
        res.redirect(`/Goodsummaries/book/${book._id}`)
    } catch {
        res.redirect(`/Goodsummaries/book/${book._id}`)

    }
}




module.exports = {
    addBook,
    getBook,
    editBook,
    deleteBook,
    getMainPage,
    updateBook,
    getPublishPage,
    saveBook,
    unSaveBook,
    likeSummary,
    unlikeSummary
}


