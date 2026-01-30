import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find({
      eventCategory: "common",
      isActive: true,
    })
      .select("_id title imageUrl type teamSize amount startTime")
      .sort({ startTime: 1 })
      .lean();

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("PUBLIC MAIN EVENTS FETCH ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch main events" },
      { status: 500 }
    );
  }
}
