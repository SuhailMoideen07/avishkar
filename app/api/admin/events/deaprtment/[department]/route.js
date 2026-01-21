import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// GET /api/admin/events/department/:department
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { department } = params;

    if (!department) {
      return NextResponse.json({ message: "Department is required" }, { status: 400 });
    }

    // Fetch events where department matches OR common events
    const events = await Event.find({
      $or: [
        { department: department }, 
        { eventCategory: "common" }
      ]
    }).sort({ startTime: 1 }); // sorted by start time

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Fetch Department Events Error:", error);
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
