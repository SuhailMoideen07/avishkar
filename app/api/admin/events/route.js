// File: /app/api/admin/events/route.js
import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import Registration from "@/lib/models/Registration";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
//import { adminAuth } from "@/lib/adminAuth"; // Use middleware
import { adminAuth } from "@/lib/middleware/adminAuth";


/* =====================================================
   ➕ ADD EVENT (ADMIN)
   METHOD: POST
   ===================================================== */
export async function POST(req) {
  try {
    await connectDB();
    const admin = adminAuth(req); // ✅ middleware

    const {
      title, description, eventCategory, departmentId,
      type, teamSize, paymentUrl,
      eventDate, startTime, endTime, registrationDeadline
    } = await req.json();

    if (!title || !eventCategory || !type || !paymentUrl || !eventDate || !startTime || !endTime || !registrationDeadline) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const event = await Event.create({
      title,
      description,
      eventCategory,
      departmentId: eventCategory === "department" ? departmentId : null,
      type,
      teamSize: type === "team" ? teamSize || 1 : 1,
      paymentUrl,
      eventDate: new Date(eventDate),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      registrationDeadline: new Date(registrationDeadline),
      isActive: true,
    });

    return NextResponse.json({ message: "Event added successfully", event }, { status: 201 });

  } catch (error) {
    console.error("Add Event Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}

/* =====================================================
   ✏️ UPDATE EVENT
   METHOD: PUT
   ===================================================== */
export async function PUT(req) {
  try {
    await connectDB();
    const admin = adminAuth(req);

    const { eventId, title, description, paymentUrl, eventDate, startTime, endTime, registrationDeadline, isActive, teamSize } = await req.json();

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: "Valid Event ID required" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) return NextResponse.json({ message: "Event not found" }, { status: 404 });

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (paymentUrl !== undefined) event.paymentUrl = paymentUrl;
    if (eventDate !== undefined) event.eventDate = new Date(eventDate);
    if (startTime !== undefined) event.startTime = new Date(startTime);
    if (endTime !== undefined) event.endTime = new Date(endTime);
    if (registrationDeadline !== undefined) event.registrationDeadline = new Date(registrationDeadline);
    if (isActive !== undefined) event.isActive = isActive;
    if (event.type === "team" && teamSize !== undefined) event.teamSize = teamSize;

    await event.save();

    return NextResponse.json({ message: "Event updated successfully", event }, { status: 200 });

  } catch (error) {
    console.error("Update Event Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}

/* =====================================================
   ❌ DELETE EVENT
   METHOD: DELETE
   ===================================================== */
export async function DELETE(req) {
  try {
    await connectDB();
    const admin = adminAuth(req);

    const { eventId } = await req.json();
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: "Valid Event ID required" }, { status: 400 });
    }

    await Event.findByIdAndDelete(eventId);
    await Registration.deleteMany({ eventId });

    return NextResponse.json({ message: "Event and related registrations deleted" }, { status: 200 });

  } catch (error) {
    console.error("Delete Event Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}

/* =====================================================
   ✅ VERIFY QR / MARK PARTICIPATION
   METHOD: PATCH
   ===================================================== */
export async function PATCH(req) {
  try {
    await connectDB();
    const admin = adminAuth(req);

    const { uniqueCode } = await req.json();
    if (!uniqueCode) return NextResponse.json({ message: "QR code missing" }, { status: 400 });

    const registration = await Registration.findOne({ uniqueCode }).populate("eventId", "title");
    if (!registration) return NextResponse.json({ message: "Invalid QR code" }, { status: 404 });
    if (registration.isParticipated) return NextResponse.json({ message: "Already participated" }, { status: 409 });

    registration.isParticipated = true;
    registration.participatedAt = new Date();
    await registration.save();

    return NextResponse.json({
      message: "Participation verified",
      participant: {
        name: registration.name,
        event: registration.eventId ? registration.eventId.title : "Deleted Event",
        time: registration.participatedAt,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("QR Verify Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
