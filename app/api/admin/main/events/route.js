import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { mainAdminAuth } from "@/lib/middleware/mainAdminAuth";
import mongoose from "mongoose";

/* =====================================================
   CREATE MAIN EVENT (FILE UPLOAD)
   ===================================================== */
export async function POST(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const type = formData.get("type");
    const teamSize = formData.get("teamSize");
    const upiId = formData.get("upiId");
    const amount = formData.get("amount");
    const rules = JSON.parse(formData.get("rules"));
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const registrationDeadline = formData.get("registrationDeadline");
    const image = formData.get("image");

    if (
      !title ||
      !type ||
      !upiId ||
      !amount ||
      !rules ||
      !image ||
      !startTime ||
      !endTime ||
      !registrationDeadline
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["single", "team"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid event type" },
        { status: 400 }
      );
    }

    if (type === "team" && (!teamSize || teamSize < 2)) {
      return NextResponse.json(
        { message: "Team size must be at least 2" },
        { status: 400 }
      );
    }

    // 🔥 Upload IMAGE FILE to Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "main_events" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    const event = await Event.create({
      title,
      description,
      eventCategory: "common",
      department: null,
      type,
      teamSize: type === "team" ? Number(teamSize) : 1,
      upiId,
      amount: Number(amount),
      rules,
      imageUrl: uploadResult.secure_url,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      registrationDeadline: new Date(registrationDeadline),
      isActive: true,
    });

    return NextResponse.json(
      { message: "Main event created successfully", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE MAIN EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   UPDATE MAIN EVENT (OPTIONAL FILE UPLOAD)
   ===================================================== */
export async function PUT(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const formData = await req.formData();

    const eventId = formData.get("eventId");
    const image = formData.get("image");

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid eventId" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event || event.eventCategory !== "common") {
      return NextResponse.json(
        { message: "Main event not found" },
        { status: 404 }
      );
    }

    // update normal fields
    const fields = [
      "title",
      "description",
      "type",
      "upiId",
      "amount",
      "startTime",
      "endTime",
      "registrationDeadline",
      "teamSize",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value !== null) event[field] = value;
    });

    const rules = formData.get("rules");
    if (rules) event.rules = JSON.parse(rules);

    // optional image update
    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "main_events" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(buffer);
      });

      event.imageUrl = uploadResult.secure_url;
    }

    await event.save();

    return NextResponse.json(
      { message: "Main event updated successfully", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE MAIN EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   DELETE MAIN EVENT
   ===================================================== */
export async function DELETE(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const { eventId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid eventId" },
        { status: 400 }
      );
    }

    await Event.findByIdAndDelete(eventId);

    return NextResponse.json(
      { message: "Main event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE MAIN EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   GET ALL MAIN EVENTS (ADMIN)
   ===================================================== */
export async function GET() {
  try {
    await connectDB();
    mainAdminAuth(req);

    const events = await Event.find({ eventCategory: "common" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("GET MAIN EVENTS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch main events" },
      { status: 500 }
    );
  }
}

/* =====================================================
   ENABLE / DISABLE MAIN EVENT
   ===================================================== */
export async function PATCH(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const { eventId, isActive } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid eventId" },
        { status: 400 }
      );
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, eventCategory: "common" },
      { isActive },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { message: "Main event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Event ${isActive ? "enabled" : "disabled"} successfully`,
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("TOGGLE MAIN EVENT STATUS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update event status" },
      { status: 500 }
    );
  }
}
