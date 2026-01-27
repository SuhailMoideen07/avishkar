import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/middleware/adminAuth";

// GET /api/admin/department
export async function GET(req) {
  try {
    await connectDB();

    // 🔐 Get department from JWT
    const adminData = adminAuth(req);
    const department = adminData.department;

    if (!department) {
      return NextResponse.json(
        { message: "Department not found in token" },
        { status: 401 }
      );
    }

    // ✅ ONLY department-specific events
    const events = await Event.find({
      department,
      eventCategory: "department"
    }).sort({ startTime: 1 });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Fetch Department Events Error:", error);
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
