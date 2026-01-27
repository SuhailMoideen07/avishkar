import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import Event from "@/lib/models/Event";
import Registration from "@/lib/models/Registration";
import cloudinary from "@/lib/cloudinary";
import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";

/* =====================================================
   REGISTER FOR EVENT
   ===================================================== */
export async function POST(req) {
  try {
    await connectDB();

    /* =====================
       🔐 AUTH (CLERK)
       ===================== */
    const { userId } = auth();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return Response.json({ message: "User does not exist" }, { status: 404 });
    }

    /* =====================
       📥 REQUEST BODY
       ===================== */
    const {
      eventId,
      name,
      age,
      email,
      phone,
      participantType, // college | school

      // college fields
      college,
      participantDepartment,
      semester,

      // school fields
      school,
      schoolClass,

      teamMembers = [],
      paymentScreenshot, // base64 image
    } = await req.json();

    /* =====================
       ✅ BASIC VALIDATION
       ===================== */
    if (
      !eventId ||
      !name ||
      !age ||
      !email ||
      !phone ||
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

    /* =====================
       🎓 COLLEGE VALIDATION
       ===================== */
    if (participantType === "college") {
      if (!college || !participantDepartment || !semester) {
        return Response.json(
          {
            message:
              "College, department and semester are required for college students",
          },
          { status: 400 }
        );
      }
    }

    /* =====================
       🏫 SCHOOL VALIDATION
       ===================== */
    if (participantType === "school") {
      if (!school || !schoolClass) {
        return Response.json(
          {
            message: "School name and class are required for school students",
          },
          { status: 400 }
        );
      }
    }

    /* =====================
       🎯 EVENT CHECK
       ===================== */
    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return Response.json(
        { message: "Event not available" },
        { status: 404 }
      );
    }

    if (event.type === "team" && teamMembers.length !== event.teamSize) {
      return Response.json(
        { message: `Team size must be ${event.teamSize}` },
        { status: 400 }
      );
    }

    /* =====================
       ❌ DUPLICATE CHECK
       ===================== */
    const alreadyRegistered = await Registration.findOne({
      userId: user._id,
      eventId,
    });

    if (alreadyRegistered) {
      return Response.json(
        { message: "You already registered for this event" },
        { status: 409 }
      );
    }

    /* =====================
       🖼️ UPLOAD PAYMENT IMAGE
       ===================== */
    const uploadResult = await cloudinary.uploader.upload(
      paymentScreenshot,
      {
        folder: "payment_screenshots",
        resource_type: "image",
      }
    );

    /* =====================
       🆔 UNIQUE CODE
       ===================== */
    const uniqueCode = crypto.randomUUID();

    /* =====================
       📝 SAVE REGISTRATION
       ===================== */
    const registration = await Registration.create({
      userId: user._id,
      eventId,
      name,
      age,
      email,
      phone,
      participantType,

      // college fields
      college: participantType === "college" ? college : null,
      participantDepartment:
        participantType === "college" ? participantDepartment : null,
      semester: participantType === "college" ? semester : null,

      // school fields
      school: participantType === "school" ? school : null,
      schoolClass: participantType === "school" ? schoolClass : null,

      teamMembers: event.type === "team" ? teamMembers : [],
      paymentScreenshot: uploadResult.secure_url,
      uniqueCode,
    });

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

/* =====================================================
   GET USER REGISTRATIONS
   ===================================================== */
export async function GET() {
  try {
    await connectDB();

    const { userId } = auth();

    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ clerkUserId: userId });
    if (!user) {
      return Response.json({ message: "User does not exist" }, { status: 404 });
    }

    const registrations = await Registration.find({ userId: user._id })
      .populate({
        path: "eventId",
        select: `
          title
          description
          imageUrl
          startTime
          endTime
          eventCategory
          department
          type
          teamSize
        `,
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
