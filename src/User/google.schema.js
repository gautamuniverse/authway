import mongoose from "mongoose";

//Schema for google users
const GoogleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: [true, "Email is required"], unique: true },
  googleId: {type: String, required: true, unique: true}
});

const GoogleModel = mongoose.model("GoogleUser", GoogleSchema);

export default GoogleModel;
  