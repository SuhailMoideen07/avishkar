import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import { adminAuth } from "@/lib/middleware/adminAuth";

export async function GET(req) {
  try {
    await connectDB();

    const admin = adminAuth(req);
    const { department } = admin;

    const events = await Event.find({ department }).select("_id");

    const eventIds = events.map(e => e._id);

    const registrations = await Registration.find({
      eventId: { $in: eventIds },
    })
      .populate("eventId", "title department")
      .sort({ createdAt: -1 });

    return Response.json({
      department,
      count: registrations.length,
      registrations,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}