const { Router } = require("express");
const booksroutes = Router();
const bookcontroller = require("../controllers/bookcontroller");

booksroutes.get("/home", bookcontroller.getMainPage);
booksroutes.get("/profilePage/:name", bookcontroller.getProfilePage)
booksroutes.get("/search", bookcontroller.getBooksBySearch);
booksroutes.get("/publish", bookcontroller.getPublishPage);
booksroutes.post("/home", bookcontroller.addBook);
booksroutes.post("/profilePage/:name", bookcontroller.changeData);
booksroutes.get("/editProfilePage", bookcontroller.editProfilePage);
booksroutes.get("/book/:id", bookcontroller.getBook);
booksroutes.post("/book/save/:id", bookcontroller.saveBook);
booksroutes.get("/book/:id/edit", bookcontroller.editBook);
booksroutes.put("/book/:id", bookcontroller.updateBook);
booksroutes.delete("/book/:id", bookcontroller.deleteBook);

module.exports = booksroutes;