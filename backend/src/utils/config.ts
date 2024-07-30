import dotenv from "dotenv";
dotenv.config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: "1h",
  bcryptSaltRounds: 10,
};
