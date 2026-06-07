import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
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
    if (
      decoded.role === "admin" &&
      decoded.email &&
      decoded.email === process.env.SELLER_EMAIL
    ) {
      req.admin = decoded;
      return next();
    }

    const user = await User.findById(decoded.id);

    if (user && user.role === "admin") {
      req.admin = user;
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden. Admin access required.", success: false });
    }
  } catch (error) {
    console.error("Error in authAdmin middleware:", error);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};
