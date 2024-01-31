import bcrypt, { hash } from "bcrypt";
import UserRepository from "./user.repository.js";
import UserModel from "./user.schema.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signup(req, res, next) {
    try {
      let { name, email, password } = req.body;

      //Check if already registerd
      const findUser = await this.userRepository.findByEmail(email);
      if (findUser.success)
        return res
          .status(404)
          .send({ success: false, msg: "You are already registered!" });
          
      //Hash the user password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);

      password = hashedPassword;

      const result = await this.userRepository.signup({
        name,
        email,
        password,
      });
      if (result.success)
        return res
          .status(201)
          .send({ success: true, msg: "Registration successfull!" });
      else {
        return res.status(404).send({
          success: false,
          msg: "Something went wrong with the database",
        });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async signin(req, res, next) {
    try {
      const { email, password } = req.body;
      //Get the user details from the db
      const user = await this.userRepository.findByEmail(email);
      if (!user.success) {
        return res.status(401).send({ success: false, msg: "User not found" });
      } else {
        //Verify the passwords
        const passFromDB = user.msg.password;
        //Compare using bcrypt (enter raw password first, and hashed pass in 2nd argument)
        const comparePass = await bcrypt.compare(password, passFromDB);
        //If passwords match
        if (comparePass) {
          //Check if already signed in
          if (req.cookies.jwt) {
            const now = new Date().getTime() / 1000;
            const payload = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
            const expires = payload.exp;
            // Compare expiration date to current timestamp
            if (expires && expires > now) {
              // Cookie not expired
              return res
                .status(200)
                .send({ success: true, msg: "You are already logged in." });
            }
          }

          //create token
          const token = jwt.sign(
            {
              userId: user.msg._id,
              email: email,
            },
            process.env.JWT_SECRET,
            { expiresIn: 60 * 60 } // Token expires in 1 hour
          );

          //attach token to the user's response so that the user will send the token with subsequent requests
          const options = {
            maxAge: 60 * 60 * 1000, //cookie will expire in 1 hour
          };

          res.cookie("jwt", token, options); //Cookie name is jwt

          //Also store the token in the user's document in DB
          await this.userRepository.updateUser(
            { email },
            {
              $push: {
                tokens: token,
              },
            }
          );

          return res.status(200).send({
            success: true,
            msg: "You have successfully logged in!",
          });
        } else {
          return res.status(401).send({
            success: false,
            msg: "Invalid password, please try again!",
          });
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      //Validation (already done in frontend but for double verification)
      if (!email) return res.status(404).send("Email is required!");

      //Check if the user is registered
      const findUser = await this.userRepository.findByEmail(email);
      if (!findUser.success)
        return res
          .status(401)
          .send({ success: false, msg: "User not registered!" });

      //Generate an otp and save in the user's otps array
      const result = await this.userRepository.sendOtp(email, findUser.name);

      if (result.success) return res.status(200).send(result);
      else return res.status(400).send(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async validateOTP(req, res, next) {
    try {
      //Get the otp
      const { otp, email } = req.body;

      //Validate the otp
      const findUser = await this.userRepository.findByEmail(email);

      if (findUser.success) {
        //Check if the otp matches and is not expired
        if (findUser.msg.otp.otp != otp) {
          return res
            .status(401)
            .send({ success: false, msg: "OTP doesn't match, please retry!" });
        } else {
          //Check if the otp is expired
          const expiry = findUser.msg.otp.expire;
          if (new Date(expiry).getTime() < new Date().getTime())
            return res.status(401).send({
              success: false,
              msg: "OTP expired, please resend an OTP!",
            });
          else {
            //crate and send user a new password
            const createPassword =
              "random" + Math.floor(1000 + Math.random() * 9000);
            const password = await bcrypt.hash(createPassword, 12);
            //Update the current passwor for the user in the document
            await this.userRepository.updateUser(
              { email },
              {
                password: password,
              }
            );

            return res.status(200).send({ success: true, msg: createPassword });
          }
        }
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async resetPasswordForm(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(404).send({
          success: false,
          msg: "Please enter both email and password!",
        });

      //Get the user details from the database
      const user = await this.userRepository.findByEmail(email);

      if (user.success) {
        //User found, validate the password
        const validatePassword = await bcrypt.compare(
          password,
          user.msg.password
        );
        if (validatePassword) {
          return res
            .status(200)
            .send({ success: true, msg: "Password is valid!" });
        } else {
          return res
            .status(401)
            .send({ success: false, msg: "Password is invalid" });
        }
      } else {
        return res.status(401).send(user);
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async changePass(req, res, next) {
    try {
      //Get the new password
      const { password } = req.body;

      //Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      //get the payload from the existing cookie
      const payload = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      const email = payload.email;
      //Update the user's password
      const result = await this.userRepository.updateUser(
        { email },
        { password: hashedPassword }
      );

      //create new token
      const token = jwt.sign(
        {
          userId: req.userId,
          email: payload.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 } // Token expires in 1 hour
      );

      //attach token to the user's response so that the user will send the token with subsequent requests
      const options = {
        maxAge: 60 * 60 * 1000, //cookie will expire in 1 hour
      };
      if (result.success) {
        res.cookie("jwt", token, options); //Cookie name is jwt
        return res.status(200).send(result);
      } else return res.status(404).send(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}
