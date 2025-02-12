import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  //checking if already exists
  try {
    const userExists = await User.findOne({
      $or: [{ userName }, { userEmail }],
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User Name or Email already exists",
      });
    }

    //hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      userEmail,
      password: hashPassword,
      role,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error registering user",
    });
  }
};

export const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;
  try {
    //check user exists
    const checkUser = await User.findOne({ userEmail });

    if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "120m",
      }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error logging in user",
    });
  }
};
