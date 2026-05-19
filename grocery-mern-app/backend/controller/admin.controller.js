import jwt from "jsonwebtoken";
// admin login :/api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.ADMIN_PASSWORD &&
      email === process.env.ADMIN_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ message: "Login successful", success: true, token });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error("Error in adminLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check admin auth  : /api/admin/is-auth
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// logout admin: /api/admin/logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
