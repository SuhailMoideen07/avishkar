import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    // 🔑 Clerk user ID (PRIMARY)
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true, // allows null emails
    },
  },
  { timestamps: true }
);const User=mongoose.model("User",UserSchema)
export default User;