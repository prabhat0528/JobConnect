const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.js");
const cors = require("cors");
const session = require("express-session");
const jobPostingRouter = require("./routes/jobPosting.js");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const app = express();


app.use(cors({
  origin: "https://jobconnect-hub.onrender.com",
  credentials: true
}));


const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true, 
    sameSite: 'none'
  },
};


// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(session(sessionOptions));

app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


app.use("/api/user", userRouter);
app.use("/api/jobPosting",jobPostingRouter);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to the database");
}).catch((err) => {
  console.error("Database connection error:", err);
});

// Default Route
app.get("/", (req, res) => {
  res.send("This is root");
});

// Start Server
app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
