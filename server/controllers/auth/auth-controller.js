const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Register user
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with the same email! Please try again.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "Registration successful!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    // Set the cookie and return the response
    res
      .cookie("token", token, { httpOnly: true, secure: true })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging in.",
    });
  }
};

// Logout user
const logoutUser = (req, res) => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "An error occurred while logging out.",
    });
  }
};

// Middleware to check for valid authentication token
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access! No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access! Invalid token.",
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
