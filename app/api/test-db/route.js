import { connectDB } from "@/lib/db";
import User from "@/lib/models/User"; // ✅ FIXED PATH


export async function GET() {
  try {
    console.log("🔌 Testing DB connection...");

    await connectDB();
    console.log("✅ DB connected");

    const user = await User.create({
      clerkId: "test_user_123",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
    });

    console.log("✅ Test user inserted:", user._id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "DB connected and write successful",
        userId: user._id,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ DB TEST FAILED", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      { status: 500 }
    );
  }
}
