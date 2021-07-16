
const express = require("express");
const app = express();
const usersauth = require("./routes/authRoutes");
const booksRoutes = require("./routes/summaryroutes");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const method_override = require("method-override");
const auth = require("./middelware/auth");
const challengesRoute = require('./routes/challengeRoute');
const profileRoute = require("./routes/profileRoutes")
const dotenv = require("dotenv").config();
app.set("view engine", "ejs");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(process.env.mongoDB, { useUnifiedTopology: true })

app.listen(process.env.PORT, () => {
  console.log("has connected");
})

app.use(cookieParser());
app.use(method_override("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use("/", usersauth);
app.use("/", auth, booksRoutes);
app.use("/challenges", auth, challengesRoute);
app.use("/profilePage", auth, profileRoute);

