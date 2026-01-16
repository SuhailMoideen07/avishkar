import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    // 🔐 Authenticated user (mock or Clerk later)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🎯 Event
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // 👤 Basic participant info
    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    college: {
      type: String,
      required: true,
    },

    // 👥 College or School
    participantType: {
      type: String,
      enum: ["college", "school"],
      required: true,
    },

    // 🎓 Only for college students
    semester: {
      type: String,
      default: null,
    },

    // 🏫 Only for school students
    schoolClass: {
      type: String,
      default: null,
    },

    // 👥 Team details
    teamMembers: {
      type: [String],
      default: [],
    },

    // 💳 Payment proof
    paymentScreenshot: {
      type: String,
      required: true,
    },

    // 🆔 Unique fest ID
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
    },

    // 📷 QR code
    qrCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ❌ Prevent duplicate registration
RegistrationSchema.index(
  { userId: 1, eventId: 1 },
  { unique: true }
);
const Registration=mongoose.model("Registration",RegistrationSchema)
export default Registration