import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";

async function generateUnique4DigitCode() {
  let code;
  let exists = true;

  while (exists) {
    // Generate 4-digit code (1000–9999)
    code = Math.floor(1000 + Math.random() * 9000).toString();

    exists = await Registration.exists({ uniqueCode: code });
  }

  return code;
}

export async function POST(req) {
  try {
    await connectDB();

    // 🔐 Clerk authentication (MUST be awaited)
    const { userId } = await auth();
    console.log("AUTH USER ID:", userId);

    if (!userId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      eventId,
      name,
      age,
      email,
      phone,
      participantType,
      college,
      participantDepartment,
      semester,
      school,
      schoolClass,
      teamMembers = [],
      paymentScreenshot,
    } = body;

    // Basic validation
    if (
      !eventId ||
      !name ||
      !email ||
      !phone ||
      !participantType ||
      !paymentScreenshot
    ) {
      return Response.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    // Check event
    const event = await Event.findById(eventId);
    if (!event) {
      return Response.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // Prevent duplicate registration
    const exists = await Registration.findOne({ userId, eventId });
    if (exists) {
      return Response.json(
        { message: "Already registered" },
        { status: 409 }
      );
    }

    // Upload payment screenshot
    const upload = await cloudinary.uploader.upload(paymentScreenshot, {
      folder: "event_payments",
    });

    const uniqueCode = await generateUnique4DigitCode();

    // Save registration
    const registration = await Registration.create({
      userId,
      eventId,
      name,
      age,
      email,
      phone,
      participantType,
      college: participantType === "college" ? college : null,
      participantDepartment:
        participantType === "college" ? participantDepartment : null,
      semester: participantType === "college" ? semester : null,
      school: participantType === "school" ? school : null,
      schoolClass: participantType === "school" ? schoolClass : null,
      teamMembers,
      paymentScreenshot: upload.secure_url,
      uniqueCode,
    });

    return Response.json(
      { message: "Registered successfully", registration },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}