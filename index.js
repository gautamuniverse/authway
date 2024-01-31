import cookieParser from "cookie-parser";
import "./env.variabls.js";
import serverplicationError from "./src/errorHandler/errorHandler.js";
import express from "express";
import UserRouter from "./src/User/user.router.js";
import connectionUsingMongoose from "./src/config/mongoose.db.js";
import passport from "passport";
import "./src/config/passport-config.js"; //including the passport config so that the google strategy gets associated with the passport instance
import path from "path";
import session from "express-session";
import jwtAuth from "./src/middlewares/jwt.middleware.js";

const server = express();

// Session cookies for google authentication
server.use(
  session({
    name: 'googleSession', // Specify the name of the session cookie
    secret: process.env.cookieKey,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 60 minutes
  })
);

// passport initialization
server.use(passport.initialize());
server.use(passport.session());

// parse the JSON data received from req.body
server.use(express.json());

// Add the cookie parser for storing multiple cookies and parse them into key value pairs
server.use(cookieParser());

//Make the public folder available to the client
server.use(express.static(path.resolve("public")));

//Make the pags available for rendering
server.use(express.static(path.resolve(path.join("src", "pages"))));

// handle and parse URL-encoded bodies of incoming requests
server.use(express.urlencoded({ extended: true }));


//Homepage
server.get("/", (req, res, next) => {
  res.sendFile(path.resolve(path.join("src", "pages", "homepage.html")));
});

// Success log-in page
server.get("/login-success", jwtAuth, (req, res, next) => {
  res.sendFile(path.resolve(path.join("src", "pages", "postLogin.html")));
});

//User Routes
server.use("/api", UserRouter);

//serverlication level error handler
server.use((err, req, res, next) => {
  //Developer defined errors using the throw keyword
  if (err instanceof serverplicationError) {
    res.status(err.code).send(err.message);
  }
  //All other serverlication level errors, not handled by the developer
  else {
    console.log(err);
    res
      .status(500)
      .send("Something went wrong at server end, please try again later!");
  }
});

server.use((req, res, next) => {
  res.send("Hello from server");
});

server.listen(3767, () => {
  console.log("Server is listening on 3767");
  connectionUsingMongoose();
});
