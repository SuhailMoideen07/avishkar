import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import { mainAdminAuth } from "@/lib/middleware/mainAdminAuth";

export async function GET(req) {
  try {
    await connectDB();

    // 🔐 Authenticate main admin
    let admin;
    try {
      admin = mainAdminAuth(req);
    } catch {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const summary = await Registration.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $group: {
          _id: "$eventId",
          title: { $first: "$event.title" },
          department: { $first: "$event.department" },
          totalRegistrations: { $sum: 1 },
        },
      },
      { $sort: { totalRegistrations: -1 } },
    ]);

    return Response.json({ summary }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}