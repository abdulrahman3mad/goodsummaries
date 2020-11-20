
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}


const express = require("express");
const app = express(); //make an instance from the object express 
const usersauth = require("./routes/authRoutes");
const booksroutes = require("./routes/summaryroutes");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const { urlencoded, query } = require("express");
const method_override = require("method-override");
const auth = require("./middelware/auth");
app.set("view engine", "ejs");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const mongoDB =
  "mongodb+srv://books:Abdo3mad012..@cluster0.ialwd.mongodb.net/booksummries?retryWrites=true&w=majority";

mongoose
  .connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port);
  })
  .catch((res) => {
    res.render("Errorpage", { errorMessage: "Something went wrong, We'll do our best to solve this problem soon" })
  });

app.use(cookieParser());
app.use(method_override("_method"));
app.use(express.static("public"));
app.use(bodyparser.json());  //to be able to get the data from the form as in json format
app.use(express.urlencoded());
app.use(bodyparser.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use("/", usersauth);
app.use("/", auth, booksroutes);

