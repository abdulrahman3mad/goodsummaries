
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}


const express = require("express");
const app = express(); //make an instance from the object express 
const usersauth = require("./routes/authRoutes");
const booksRoutes = require("./routes/summaryroutes");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const { urlencoded, query } = require("express");
const method_override = require("method-override");
const auth = require("./middelware/auth");
const challengesRoute = require('./routes/challengeRoute');
const profileRoute = require("./routes/profileRoutes")
const compression = require("compression");
app.set("view engine", "ejs");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const mongoDB =
  "mongodb+srv://books:Abdo3mad012..@cluster0.ialwd.mongodb.net/booksummries?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("has connected");
    })
  })
  .catch((req, res) => {
  });

app.use(cookieParser());
app.use(method_override("_method"));
app.use(express.static("public"));
app.use(compression());
app.use(bodyparser.json());  //to be able to get the data from the form as in json format
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json({ limit: "50mb", extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use("/Auth", usersauth);
app.use("/Goodsummaries/", auth, booksRoutes);
app.use("/Goodsummaries/challenges", auth, challengesRoute);
app.use("/Goodsummaries/profilePage", auth, profileRoute);

