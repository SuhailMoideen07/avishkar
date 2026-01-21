import jwt from "jsonwebtoken";

export function mainAdminAuth(req) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.MAIN_ADMIN_JWT_SECRET);

  if (decoded.role !== "main-admin") {
    throw new Error("Forbidden");
  }

  return decoded;
}
