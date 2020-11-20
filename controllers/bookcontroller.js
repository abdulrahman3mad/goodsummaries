const books = require("../models/books");
const users = require("../models/users");
const acceptedfiles = ["image/jpeg", "image/png"];


const getMainPage = (req, res) => {
    try {
        const user = req.user;

        users.findById(user._id).then(user => {
            books.find({ Whosaveit: user._id }).then(savedBooks => {
                books.find().then(allBooks => {
                    return res.render("Home/home", { books: allBooks, title: "Goodsummaries-Home", savedBooks: savedBooks, user: user })
                }).catch(() => {
                    res.render("errorPage", { errroMessage: "can't get Home page, try to reload the page" });
                });
            }).catch(() => {
                res.render("errorPage", { errroMessage: "can't get Home page, try to reload the page" });
            })
        }).catch(() => {
            res.render("errorPage", { errorMessage: "can't get Home page, try to reload the page" })
        })
    }

    catch {
        books.find().then(allBooks => {
            res.render("Home/home", { books: allBooks, title: "Goodsummaries-Home" })
        }).catch(() => {
            res.render("errorPage", { title: "Error", errroMessage: "can't get Home page, try to reload the page" });
        });
    }
}


const getPublishPage = async (req, res) => {
    try {
        res.render("Book/publish", { title: "Publish" });
    }
    catch (err) {
        res.render("errorPage", { title: "Error", errroMessage: "can't get this page, try to reload the page" });
    }
}

const editProfilePage = async (req, res) => {
    const user = req.user;
    res.render("profilepage/editProfilePage", { user: user, title: "Edit a book", errorMessage: "there is an error. try to reload the page", errorMakingUser: "" });
}


const getBooksBySearch = async (req, res) => {
    let searchrules = {};

    if (req.query.Category !== "All") {
        searchrules.Category = req.query.Category;
    }

    if (req.query.Title != null && req.query.Title !== "") {
        searchrules.Title = new RegExp(req.query.Title, "i");
    }


    if (!req.user) {
        books.find(searchrules)
            .then(result => {
                res.render("Home/home", {
                    title: "Goodsummries-Home",
                    books: result,
                })
            }).catch(() => {
                res.render("Home/home");
            });
    }

    else {
        const user = req.user;
        books.find({ Whosaveit: user.name }).then(savedBooks => {
            books.find(searchrules)
                .then(result => {
                    res.render("Home/home", {
                        title: "Goodsummries-Home",
                        books: result,
                        savedBooks: savedBooks,
                        user: user,
                    })
                }).catch((err) => {
                    res.render("Home/home");
                });
        }).catch(() => {
            res.render("errorPage", { errorMessage: "Something went wrong. Try to reload the paga" })
        })
    }

}


const addBook = async (req, res) => {

    const user = req.user;
    const book = new books({
        Title: req.body.Title,
        Summary: req.body.Summary,
        Summarywriter: user._id,
        Category: req.body.Category,
        Summaryperson: user.name
    })

    if (req.body.cover == null) {
        return res.render("errorPage", { errroMessage: "something went wrong. try to reload the page" })
    }

    bookSave(book, req.body.cover);


    book.save().then(() => {
        res.redirect("/home");
    }).catch((err) => {
        res.render("errorPage", { errroMessage: "Can't publish this book, try to reload the page", Title: "Error" });
    });
}

function bookSave(book, coverEncoded) {
    const cover = JSON.parse(coverEncoded);
    if (cover != null && acceptedfiles.includes(cover.type)) {
        book.Coverimage = new Buffer.from(cover.data, "base64");
        book.Coverimagetype = cover.type;
    }
}

const getBook = async (req, res) => {

    if (!req.user) {
        return res.redirect("/login");
    }
    const user = req.user;


    let owner = false;
    let savedCheck = false;
    //let liked = false;
    const id = req.params.id;
    const book = await books.findById(id);

    if (book.Summarywriter == user._id) {
        owner = true
    }
    if (book.Whosaveit.indexOf(user._id) !== -1) {
        savedCheck = true;
    }

    try {
        return res.render("Book/book", { book: book, user: user, owner: owner, saved: savedCheck })
    } catch {
        return res.render("errorPage", { errorMessage: "can't get this page, try to reload the page", Title: "Error" });
    }

}

const saveBook = async (req, res) => {

    const id = req.params.id
    const user = req.user;

    let book = await books.findById(id)
    book.Whosaveit.push(user._id)

    book.save().then(() => {
        res.redirect(`/book/${book._id}`)
    }).catch(() => {
        res.render("/errorPage", { errorMessage: "Something went wrong, please try to reload the page again", Title: "Error" })
    })


}


const editBook = async (req, res) => {

    const id = req.params.id;
    const user = req.user;

    books.findById(id).then(result => {
        res.render("Book/editBook", { book: result, user: user })
    }).catch((err) => {
        res.render("errorPage", { errroMessage: "Something went wrong, please try to reload the page again", Title: "Error" });
    });

}

const updateBook = async (req, res) => {

    const id = req.params.id;
    book = await books.findById(id)
    book.Title = req.body.Title;
    book.Summary = req.body.Summary;
    book.Category = req.body.Category;

    book.save().then(() => {
        res.redirect(`/book/${book._id}`);
    }).catch(() => {
        res.redirect(`/book/${book._id}`);
    })
}


const deleteBook = async (req, res) => {
    const id = req.params.id;

    book = await books.deleteOne({ _id: id }).then(() => {
        res.redirect("/home");
    }).catch(() => {
        res.redirect(`/book/${book._id}`);
    })
}

const getProfilePage = async (req, res) => {

    if (!req.user) {
        res.redirect("/login");
    }
    let currentUser = false;
    if (req.user.name == req.params.name) currentUser = true

    const name = req.params.name;
    let user = await users.findOne({ name: name });

    books.find({ Summarywriter: user._id }).then(books => {
        res.render("profilePage/profilePage", { user: user, currentUser: currentUser, books: books, errorMakingUser: "" })
    }).catch(() => {
        res.render("errorPage", { errroMessage: "can't get profile page, try to reload the page" })
    })
}



const changeData = async (req, res) => {

    let userexist = await users.findOne({ name: req.body.name })
    const user = req.user;



    if (userexist && (req.body.name != user.name)) {
        return res.render("profilePage/editProfilePage", { user: user, errorMakingUser: "\"name\" is already exist" })
    }

    try {
        await users.updateOne({ name: user.name }, { name: req.body.name })
        await books.updateOne({ Summarywriter: user._id })
        res.redirect(`/ profilePage / ${req.body.name}`);
    }
    catch {
        res.render("errorPage", { errorMessage: "something went wrong, try to reload the page again" })
    }

}

const likeSummary = async (req, res) => {
    let user = req.user;
    const id = req.params.id;

    let book = await books.findById(id);


    if (user.booksLiked.indexOf(id) !== -1) {
        let bookIndex = user.booksLiked.indexOf(id.toString());
        user.booksLiked.splice(bookIndex, 1);
        if (book.NumberOfLikes > 0) {
            book.NumberOfLikes--;
        }
    }
    else {
        user.booksLiked.push(id);
        let book = await books.findById(id);
        book.NumberOfLikes++;
    }
    console.log(book.NumberOfLikes);

    user.save().then(() => {
        book.save().then(() => {
            res.redirect(`/ ${book._id}`)
        }).catch(() => {
            console.log("abdo")
            res.render("errorPage", { errorMessage: "Something went wrong, try to reload the page" })
        })
    }).catch(() => {
        console.log("emad")
        res.render("errorPage", { errorMessage: "Something went wrong, try to reload the page" })
    })
}



module.exports = {
    addBook,
    getBook,
    getBooksBySearch,
    editBook,
    deleteBook,
    getMainPage,
    updateBook,
    getPublishPage,
    editProfilePage,
    changeData,
    getProfilePage,
    saveBook,
    // likeSummary,
}


