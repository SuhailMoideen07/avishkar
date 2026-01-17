import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    // department event OR common event
    eventCategory: {
      type: String,
      enum: ["department", "common"],
      required: true,
    },

    // Only for department events
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // single / team
    type: {
      type: String,
      enum: ["single", "team"],
      required: true,
    },

    // only for team events
    teamSize: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Event", EventSchema);
const Event=mongoose.model("Event",EventSchema)
export default Event
