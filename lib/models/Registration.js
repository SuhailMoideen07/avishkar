import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Clerk userId
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: String,
    age: Number,
    email: String,
    phone: String,
    participantType: {
      type: String,
      enum: ["college", "school"],
      required: true,
    },
    college: String,
    participantDepartment: String,
    semester: String,
    school: String,
    schoolClass: String,
    teamMembers: [String],
    paymentScreenshot: String,
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

RegistrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

export default mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);
