import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";
import Registration from "@/lib/models/Registration";
import QRCode from "qrcode";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server"; // enable later

export async function POST(req) {
  try {
    await connectDB();

    /* =====================================================
       🔐 AUTHENTICATION (TEMP MODE)
       ===================================================== */
    // TEMP: Using header for Postman testing
    // const userId = req.headers.get("x-user-id");

    // FINAL (Clerk):
    const { userId: clerkUserId } = auth();

    if (!userId) {
      return Response.json(
        { message: "Unauthorized: user not found" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }

    /* =====================================================
       📥 REQUEST BODY
       ===================================================== */
    const {
      eventId,
      name,
      age,
      phone,
      college,
      participantDepartment,
      participantType, // college | school
      semester,
      schoolClass,
      teamMembers = [],
      paymentScreenshot,
    } = await req.json();

    /* =====================================================
       ✅ BASIC VALIDATION
       ===================================================== */
    if (
      !eventId ||
      !name ||
      !age ||
      !phone ||
      !college ||
      !participantDepartment||
      !participantType ||
      !paymentScreenshot
    ) {
      return Response.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["college", "school"].includes(participantType)) {
      return Response.json(
        { message: "Invalid participant type" },
        { status: 400 }
      );
    }

    if (participantType === "college" && !semester) {
      return Response.json(
        { message: "Semester is required for college students" },
        { status: 400 }
      );
    }

    if (participantType === "school" && !schoolClass) {
      return Response.json(
        { message: "Class is required for school students" },
        { status: 400 }
      );
    }

    /* =====================================================
       🎯 EVENT VALIDATION
       ===================================================== */
    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return Response.json(
        { message: "Event not available" },
        { status: 404 }
      );
    }

    if (event.type === "team") {
      if (teamMembers.length !== event.teamSize) {
        return Response.json(
          { message: `Team size must be ${event.teamSize}` },
          { status: 400 }
        );
      }
    }

    /* =====================================================
       ❌ DUPLICATE REGISTRATION CHECK
       ===================================================== */
    const alreadyRegistered = await Registration.findOne({
      userId,
      eventId,
    });

    if (alreadyRegistered) {
      return Response.json(
        { message: "You already registered for this event" },
        { status: 409 }
      );
    }

    /* =====================================================
       🆔 UNIQUE CODE + QR GENERATION
       ===================================================== */
    const uniqueCode = crypto.randomUUID();
    const qrCode = await QRCode.toDataURL(uniqueCode);

    /* =====================================================
       📝 SAVE REGISTRATION
       ===================================================== */
    const registration = await Registration.create({
      userId,
      eventId,
      name,
      age,
      phone,
      college,
      participantType,
      participantDepartment,
      semester: participantType === "college" ? semester : null,
      schoolClass: participantType === "school" ? schoolClass : null,
      teamMembers: event.type === "team" ? teamMembers : [],
      paymentScreenshot,
      uniqueCode,
      qrCode,
    });

    /* =====================================================
       ✅ RESPONSE
       ===================================================== */
    return Response.json(
      {
        message: "Event registered successfully",
        registration,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return Response.json(
        { message: "Unauthorized: user not found" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { message: "User does not exist" },
        { status: 404 }
      );
    }

    const registrations = await Registration.find({ userId })
      .populate({
        path: "eventId",
        select: "title description type teamSize eventCategory departmentId",
      })
      .sort({ createdAt: -1 });

    return Response.json(
      {
        count: registrations.length,
        registrations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Registrations Error:", error);
    return Response.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}