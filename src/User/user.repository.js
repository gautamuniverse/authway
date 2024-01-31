import AppplicationError from "../errorHandler/errorHandler.js";
import UserModel from "./user.schema.js";
import nodemailer from 'nodemailer';

export default class UserRepository {
  async signup(data) {
    try {
      const newUser = new UserModel(data);
      await newUser.save();
      return { success: true, msg: newUser };
    } catch (err) {
      console.log(err);
      throw new AppplicationError(
        "Something went wrong with the database",
        500
      );
    }
  }

  async findByEmail(email) {
    try {
      const findUser = await UserModel.findOne({ email });
      if (findUser) return { success: true, msg: findUser };
      else return { success: false, msg: "User not found!" };
    } catch (err) {
      console.log(err);
      throw new AppplicationError(
        "Something went wrong with the database",
        500
      );
    }
  }

  async updateUser(query, data) {
    try {
      const updateUser = await UserModel.updateOne(query, data);
      if (updateUser.modifiedCount > 0)
        return { success: true, msg: "User Details Updated Successfully!" };
      else {
        return {
          success: false,
          msg: "User not found or something went wrong with the server!",
        };
      }
    } catch (err) {
      console.log(err);
      throw new AppplicationError(
        "Something went wrong with the database",
        500
      );
    }
  }

  //Function to generate an otp for the forgot password and save the otp in the user's otps array
  async sendOtp(email, name) {
    try {
        //Create a new Otp for the current user
        // Generate a random 4-digit number
        const otp = Math.floor(1000 + Math.random() * 9000);
  
        //Push this otp inside the collection for the current user
        const newOtp = await UserModel.findOneAndUpdate(
          { email},
          {
           otp:{
                otp: otp,
                expire: new Date(new Date().getTime() + 5 * 60000)  //5 minutes ahead of current time(otp will expire in 5minutes)
           }
          },
          { upsert: true }
        );
  
        //Check modified count
        if (newOtp && newOtp.modifiedCount === 0)
          return { success: false, msg: "Something went wrong with the datbase" };
        else {
          //send otp via email to the user
  
          //create transporter
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "nodejsgautam@gmail.com",
              pass: "srqf hqxb iiee nvag",
            },
          });
  
          //create mail options
          const mailOptions = {
            from: "nodejsgautam@gmail.com",
            to: email,
            cc: "gautamthapameriid@gmail.com",
            subject: "AuthWay OTP For Password Reset",
            text: `Hi dear, your OTP for resetting password is : ${otp}`,
          };
  
          //send the email
          const sendEmail = await transporter.sendMail(mailOptions);
  
          return {
            success: true,
            msg: `OTP was successfully sent on the email: ${email}`,
          };
        }
      } catch (error) {
        console.log(error);
        throw new AppplicationError(
            "Something went wrong with the database",
            500
          );
    }
  }
}
