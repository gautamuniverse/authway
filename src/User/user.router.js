import express from "express";
import jwtAuth from "../middlewares/jwt.middleware.js";
import UserController from "./user.controller.js";
import passport from 'passport';

const UserRouter = express.Router();
const userController = new UserController();

//Route to SignIn
UserRouter.post("/signin", (req, res, next) =>
  userController.signin(req, res, next)
);

//Route to signup
UserRouter.post("/signup", (req, res, next) =>
  userController.signup(req, res, next)
);

//Signout functionality is handled on the client side. We remove the user's cookie when they opt for signing out.

//Route to handle forgot password
UserRouter.post("/forgot-password", (req, res, next) =>
  userController.forgotPassword(req, res, next)
);

//Route to validate the OTP
UserRouter.post("/validate-otp", (req, res, next) =>
  userController.validateOTP(req, res, next)
);

//Route to validate the password for the reset-password form (JWT middleware protected, required logged in user)
UserRouter.post("/reset-password", jwtAuth, (req, res, next) =>
  userController.resetPasswordForm(req, res, next)
);

//Route to reset the password (Request coming from the reset password form)
UserRouter.post("/reset-password/change-pass", jwtAuth, (req, res, next) =>
  userController.changePass(req, res, next)
);

//Route to handle the google login using passport
UserRouter.get('/google', 
passport.authenticate('google', { scope: ['profile', 'email']})
);


//Handle the google login success redirect url
UserRouter.get('/google/redirect', passport.authenticate('google'), (req, res, next) => {
    res.redirect('/login-success')
}) 

//Route to handle the logout using passport (google)
UserRouter.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.clearCookie("jwt");
        // Redirect to the home page after successful logout
        res.redirect('/');
    });

})
export default UserRouter;
