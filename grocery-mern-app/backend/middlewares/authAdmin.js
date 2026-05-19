import jwt from "jsonwebtoken";
export const authAdmin = async (req, res, next) => {
  let adminToken = req.cookies.adminToken;
  if (!adminToken && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      adminToken = parts[1];
    }
  }
  if (!adminToken) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }
  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SELLER_EMAIL || "admin@gmail.com";
    if (decoded.email === adminEmail) {
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden", success: false });
    }
  } catch (error) {
    console.error("Error in authAdmin middleware:", error);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};
