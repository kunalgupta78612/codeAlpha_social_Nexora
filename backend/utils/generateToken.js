// ============================================================
// Nexora — JWT Token Generator Utility
// ============================================================

import jwt from "jsonwebtoken";

/**
 * Generates a signed JWT token for a user
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export default generateToken;