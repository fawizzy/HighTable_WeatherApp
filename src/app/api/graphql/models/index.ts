import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  // Define user fields here matching the GraphQL schema
  username: { type: String, required: [true, "username is required"] },
  email: {
    type: String,
    required: [true, "email is required"],
  },
  hashed_password: {
    type: String,
    required: [true, "hashed password required"],
  },
  location: {
    type: String,
  },
});

export default mongoose.models.UserModel ||
  mongoose.model("UserModel", userSchema);
