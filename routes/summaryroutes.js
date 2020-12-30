const { Router } = require("express");
const booksroutes = Router();
const bookcontroller = require("../controllers/bookcontroller");

booksroutes.get("/", bookcontroller.getMainPage);
booksroutes.get("/search", bookcontroller.getMainPage);
booksroutes.get("/publish", bookcontroller.getPublishPage);
booksroutes.post("/book/add", bookcontroller.addBook);
booksroutes.get("/book/:id", bookcontroller.getBook);
booksroutes.post("/book/save/:id", bookcontroller.saveBook);
booksroutes.post("/book/unsave/:id", bookcontroller.unSaveBook);
booksroutes.get("/book/:id/edit", bookcontroller.editBook);
booksroutes.put("/book/:id", bookcontroller.updateBook);
booksroutes.post("/book/like/:id", bookcontroller.likeSummary);
booksroutes.post("/book/unlike/:id", bookcontroller.unlikeSummary);
booksroutes.delete("/book/:id", bookcontroller.deleteBook);



module.exports = booksroutes;