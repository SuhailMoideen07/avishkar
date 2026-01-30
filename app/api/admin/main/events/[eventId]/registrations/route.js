import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import mongoose from "mongoose";
import { mainAdminAuth } from "@/lib/middleware/mainAdminAuth";

export async function GET(req, context) {
  try {
    // 🔐 Main admin authentication
    mainAdminAuth(req);

    await connectDB();

    // ✅ IMPORTANT FIX (await params)
    const { params } = context;
    const { eventId } = await params;

    console.log("RAW eventId:", eventId);
    console.log(
      "Is valid ObjectId:",
      mongoose.Types.ObjectId.isValid(eventId)
    );

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return Response.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    // 🎯 Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return Response.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // 👥 Fetch registrations
    const registrations = await Registration.find({ eventId })
      .populate("eventId", "title department")
      .sort({ createdAt: -1 });

    return Response.json(
      {
        event: {
          id: event._id,
          title: event.title,
          department: event.department,
        },
        totalRegistrations: registrations.length,
        registrations,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}