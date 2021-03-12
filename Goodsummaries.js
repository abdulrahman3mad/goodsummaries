
const express = require("express");
const app = express();
const usersauth = require("./routes/authRoutes");
const booksRoutes = require("./routes/summaryroutes");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const method_override = require("method-override");
const auth = require("./middelware/auth");
const challengesRoute = require('./routes/challengeRoute');
const profileRoute = require("./routes/profileRoutes")
const compression = require("compression");
app.set("view engine", "ejs");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
const mongoDB =
  "mongodb+srv://books:Abdo3mad012..@cluster0.ialwd.mongodb.net/booksummries?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB, { useUnifiedTopology: true })

app.listen(3000, () => {
  console.log("has connected");
})

app.use(cookieParser());
app.use(method_override("_method"));
app.use(express.static("public"));
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.json({ limit: "50mb", extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use("/", usersauth);
app.use("/", auth, booksRoutes);
app.use("/challenges", auth, challengesRoute);
app.use("/profilePage", auth, profileRoute);

