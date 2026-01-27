import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    // 🔐 Authenticated user
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
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },
    email:{
      type:String,
      required:true
    },

    phone: {
      type: String,
      required: true,
    },

    // 👥 Participant type
    participantType: {
      type: String,
      enum: ["college", "school"],
      required: true,
    },

    // 🎓 College name (ONLY for college students)
    college: {
      type: String,
      trim: true,
      required: function () {
        return this.participantType === "college";
      },
      default: null,
    },

    // 🏫 School name (ONLY for school students)
    school: {
      type: String,
      trim: true,
      required: function () {
        return this.participantType === "school";
      },
      default: null,
    },

    // 🧑‍🎓 Department (ONLY for college students)
    participantDepartment: {
      type: String,
      trim: true,
      required: function () {
        return this.participantType === "college";
      },
      default: null,
    },

    // 📚 Semester (ONLY for college students)
    semester: {
      type: String,
      required: function () {
        return this.participantType === "college";
      },
      default: null,
    },

    // 🏫 Class (ONLY for school students)
    schoolClass: {
      type: String,
      required: function () {
        return this.participantType === "school";
      },
      default: null,
    },

    // 👥 Team members (optional)
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

    // ✅ Participation status
    isParticipated: {
      type: Boolean,
      default: false,
    },

    participatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ❌ Prevent duplicate registration for same event
RegistrationSchema.index(
  { userId: 1, eventId: 1 },
  { unique: true }
);

const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);

export default Registration;
