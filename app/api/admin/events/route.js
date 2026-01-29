import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { adminAuth } from "@/lib/middleware/adminAuth";
import mongoose from "mongoose";

/* =====================================================
   CREATE DEPARTMENT EVENT (FILE UPLOAD)
   ===================================================== */
export async function POST(req) {
  try {
    await connectDB();

    const adminData = adminAuth(req);
    const departmentName = adminData.department;

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const eventCategory = formData.get("eventCategory"); // department
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
      !eventCategory ||
      !type ||
      !upiId ||
      amount === null ||
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

    // 🔥 Upload image FILE to Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "events" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    const event = await Event.create({
      title,
      description,
      eventCategory,
      department: eventCategory === "department" ? departmentName : null,
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
      { message: "Event added successfully", event },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Event Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   UPDATE DEPARTMENT EVENT (OPTIONAL FILE)
   ===================================================== */
export async function PUT(req) {
  try {
    await connectDB();

    const adminData = adminAuth(req);
    const departmentName = adminData.department;

    const formData = await req.formData();

    const eventId = formData.get("eventId");
    const image = formData.get("image");

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Valid Event ID required" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    const fields = [
      "title",
      "description",
      "eventCategory",
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

    if (event.eventCategory === "department") {
      event.department = departmentName;
    }

    const rules = formData.get("rules");
    if (rules) event.rules = JSON.parse(rules);

    if (image) {
      const buffer = Buffer.from(await image.arrayBuffer());

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "events" },
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
      { message: "Event updated successfully", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Event Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   DELETE EVENT
   ===================================================== */
export async function DELETE(req) {
  try {
    await connectDB();
    adminAuth(req);

    const { eventId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Valid Event ID required" },
        { status: 400 }
      );
    }

    await Event.findByIdAndDelete(eventId);

    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Event Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   GET EVENTS BY DEPARTMENT
   ===================================================== */
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { department } = params;

    if (!department) {
      return NextResponse.json(
        { message: "Department is required" },
        { status: 400 }
      );
    }

    const events = await Event.find({
      $or: [{ department }, { eventCategory: "common" }],
    }).sort({ startTime: 1 });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Fetch Department Events Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}
