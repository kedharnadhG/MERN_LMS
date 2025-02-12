import jwt from "jsonwebtoken";

const verifyToken = (token, secretKey) => {
  return jwt.verify(token, secretKey);
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const payload = verifyToken(token, process.env.JWT_SECRET);
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  req.user = payload;

  next();
};
