import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/],
  },
  password: { type: String, required: true },
  tokens: [
    {
      type: String,
      ref: "User",
      timestamps: true,
    },
  ],
  otp:
    {
      otp: { type: Number, max: [4] },
      expire: { type: Date },
    }
});



const UserModel = mongoose.model("User", UserSchema);
export default UserModel;

