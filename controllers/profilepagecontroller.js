const books = require("../models/books")
const users = require("../models/users")


const getProfilePage = async (req, res) => {

    if (!req.user) {
        res.redirect("/login");
    }
    let followed = false;

    let currentUser = false;
    if (req.user.name == req.params.name) currentUser = true

    try {
        const name = req.params.name;
        let user = await users.findOne({ name: name });
        let savedBooks = await books.find({ _id: user.savedBooks })
        let book = await books.find({ _id: user.publishedBooks })
        if (req.user.following.indexOf(name) !== -1) {
            followed = true;
        }
        res.render("profilePage/profilePage", { user: user, currentUser: currentUser, books: book, errorMakingUser: "", savedBooks: savedBooks, followed: followed })
    } catch {
        res.render(`errorPage`, { errorMessage: "something went wrong, try to reload the page again" })
    }

}


const editProfilePage = async (req, res) => {
    const user = req.user;
    res.render("profilePage/editProfilePage", { user: user, title: "Edit a book", errorMakingUser: "" });
}


const changeData = async (req, res) => {

    let userexist = await users.findOne({ name: req.body.name })
    const user = req.user;

    if (userexist && (req.body.name != user.name)) {
        res.render("profilePage/profilePage/editProfilePage", { user: user, errorMakingUser: "\"name\" is already exist" })
    }

    try {
        await users.updateOne({ name: user.name }, { name: req.body.name })
        res.redirect(`/profilePage/${req.body.name}`);
    }
    catch {
        res.render("errorPage", { errorMessage: "something went wrong, try to reload the page again" })
    }

};

const followOption = async (req, res) => {
    const user = req.user;
    const followingUserName = req.params.name;

    user.following.push(followingUserName);
    await user.save();
    res.redirect(`/Goodsummaries/profilePage/${followingUserName}`);
}

const unfollowOption = async (req, res) => {
    const user = req.user;
    const followingUserName = req.params.name;

    let followingUserNumber = user.following.indexOf(followingUserName);
    user.following.splice(followingUserNumber, 1);

    await user.save()
    res.redirect(`/Goodsummaries/profilePage/${followingUserName}`)
}


module.exports = {
    editProfilePage,
    changeData,
    getProfilePage,
    followOption,
    unfollowOption
}