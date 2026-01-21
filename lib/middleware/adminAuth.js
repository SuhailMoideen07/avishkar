import jwt from "jsonwebtoken";

export function adminAuth(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

  // Return decoded object, e.g., { role: 'admin', department: 'cse' }
  return decoded;
}
