const User = require("../models/User");
const PaymentAccount = require("../models/PaymentAccount");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const signToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

exports.signUp = catchAsync(async (req, res, next) => {
  let newUser;
  try {
    newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: "user",
    });
  } catch (error) {
    console.log("ERROR", error);
  }
  const token = signToken(newUser);

  PaymentAccount.create({
    user: newUser._id,
    balance: 100_000_000,
    type: "user",
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  const token = signToken(user);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Check token in header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // Verify token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // Grant access to protected route
  req.user = await User.findById(decoded.id);
  next();
});

// Check roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const payment = await PaymentAccount.findOne({ user: req.user._id });

  if (!payment) {
    return next(new AppError("No payment account found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
      balance: payment.balance,
    },
  });
});
