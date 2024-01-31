import mongoose from "mongoose";

const connectionUrl = process.env.DB_URL;

const connectionUsingMongoose = async () => {
  try {
    await mongoose.connect(connectionUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB using Mongoose");
  } catch (err) {
    console.log("Error connecting to DB");
    console.log(err);
  }
};

export default connectionUsingMongoose;