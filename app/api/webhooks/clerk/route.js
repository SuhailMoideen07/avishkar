import { Webhook } from "svix";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return new Response("Server misconfigured", { status: 500 });
  }

  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
    return new Response("Bad Request", { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  console.log("✅ Clerk webhook received:", type);

  await connectDB();

  try {
    if (type === "user.created") {
      const email =
        data.email_addresses?.find(
          (e) => e.id === data.primary_email_address_id
        )?.email_address || null;

      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          clerkId: data.id,
          email,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          imageUrl: data.image_url || "",
        },
        { upsert: true, new: true }
      );

      console.log("✅ User synced to DB:", data.id);
    }

    if (type === "user.updated") {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          imageUrl: data.image_url || "",
        }
      );

      console.log("✅ User updated:", data.id);
    }

    return new Response("OK", { status: 200 });
  } catch (dbError) {
    console.error("❌ DB error:", dbError);
    return new Response("Database error", { status: 500 });
  }
}
