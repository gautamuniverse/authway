//Note: we also handle the google authenticated session cookie here

import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    //Check if the authentication using google
    if (req.user) {
      //If the authentication is using google then the req will contain the user object as we configured in the passport-congig.js
      next();
    } else {
      //Get the token from the user's cookie
      const token = req.cookies.jwt;

      //If no token found then send unauthorized code along with redirection to the homepage
      if (!token) return res.status(401).redirect("/");
      else {
        //Verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next(); //call the next middleware in the pipeline
      }
    }
  } catch (err) {
    console.log(err);
    if (err instanceof jwt.TokenExpiredError) {
      // Token is expired
      console.error("Token is expired");
    } else {
      return res.status(401).send("Invalid Token");
    }
  }
};

export default jwtAuth;
