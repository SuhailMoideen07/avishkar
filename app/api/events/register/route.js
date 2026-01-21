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
      phone,
      college,
      participantDepartment,
      participantType, // college | school
      semester,
      schoolClass,
      teamMembers = [],
      paymentScreenshot, // base64 image
    } = await req.json();

    /* =====================
       ✅ VALIDATION
       ===================== */
    if (
      !eventId ||
      !name ||
      !age ||
      !phone ||
      !college ||
      !participantDepartment ||
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
      phone,
      college,
      participantType,
      participantDepartment,
      semester: participantType === "college" ? semester : null,
      schoolClass: participantType === "school" ? schoolClass : null,
      teamMembers: event.type === "team" ? teamMembers : [],
      paymentScreenshot: uploadResult.secure_url, // ✅ URL stored
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
       📦 FETCH REGISTRATIONS
       ===================== */
    const registrations = await Registration.find({ userId: user._id })
      .populate({
        path: "eventId",
        select: `
          title
          description
          imageUrl
          eventDate
          startTime
          endTime
          eventCategory
          department
          type
          teamSize
        `,
      })
      .sort({ createdAt: -1 });

    /* =====================
       🎯 FORMAT RESPONSE
       ===================== */
    const dashboardData = registrations.map((reg) => ({
      registrationId: reg._id,
      uniqueCode: reg.uniqueCode, // ✅ REQUIRED
      registeredAt: reg.createdAt,

      event: {
        id: reg.eventId?._id,
        title: reg.eventId?.title,
        description: reg.eventId?.description,
        imageUrl: reg.eventId?.imageUrl,
        eventDate: reg.eventId?.eventDate,
        startTime: reg.eventId?.startTime,
        endTime: reg.eventId?.endTime,
        eventCategory: reg.eventId?.eventCategory,
        department: reg.eventId?.department,
        type: reg.eventId?.type,
        teamSize: reg.eventId?.teamSize,
      },

      participant: {
        name: reg.name,
        college: reg.college,
        participantDepartment: reg.participantDepartment,
        participantType: reg.participantType,
        semester: reg.semester,
        schoolClass: reg.schoolClass,
      },
    }));

    return Response.json(
      {
        count: dashboardData.length,
        registrations: dashboardData,
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
