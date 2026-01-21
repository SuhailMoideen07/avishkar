import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    eventCategory: { type: String, enum: ["department", "common"], required: true },
    department: { type: String, default: null }, // store department name directly
    type: { type: String, enum: ["single", "team"], required: true },
    teamSize: { type: Number, default: 1 },
    paymentUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    registrationDeadline: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
