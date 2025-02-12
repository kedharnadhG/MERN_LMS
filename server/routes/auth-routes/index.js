import express from "express";
import {
  registerUser,
  loginUser,
} from "../../controllers/auth-controller/index.js";
import { authenticate } from "../../middleware/auth-middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check-auth", authenticate, (req, res) => {
  const user = req.user;
  return res.status(200).json({
    success: true,
    message: "Authenticated successfully",
    data: {
      user,
    },
  });
});

export default router;
