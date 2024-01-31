import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GoogleModel from "../User/google.schema.js";
import AppplicationError from "../errorHandler/errorHandler.js";

//Serializing is used for session management, after the user is authenticated we will take the user object and extract some unique identifier and stuff that into the cookie for subsequent authentication requests.
passport.serializeUser((user, done) => {
  done(null, user._id); //Here we are storing only the user id from mongoDB in the cookie
});

passport.deserializeUser(async (id, done) => {
  const findUser = await GoogleModel.findById(id);
  if (findUser) done(null, findUser); //pass the user to the next stage/middleware
});

passport.use(
  new GoogleStrategy.Strategy(
    {
      // Options for the google strategy
      callbackURL: "http://localhost:3767/api/google/redirect",
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Pasport callback function
      try {
        //Check if the user already exists
        const findUser = await GoogleModel.findOne({
          email: profile._json.email,
        });
        if (findUser) {
          //User already exists
          done(null, findUser); //call the next middleware that is serializeUser(for session management)
        } else {
          //Create a new user
          const newUser = await new GoogleModel({
            name: profile.displayName,
            email: profile._json.email,
            googleId: profile.id,
          }).save();

          done(null, newUser); //call the next middleware that is the serializeUse(for session management)
        }
      } catch (err) {
        console.log(err);
        throw new AppplicationError(err);
      }
    }
  )
);
