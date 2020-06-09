const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../db");
const validate = require("../middleware/validate");
const generateJWT = require("../utils/generateJWT");
const authorize = require("../middleware/authorize");

// @route  POST auth/register
// @desc   Register user and return JWT token
// @access Public
router.post("/register", validate, async (req, res) => {
  // 1. destructure the req.body (name, email, password)
  const { email, name, password } = req.body;

  try {
    // 2. check if user exists (if user exists then throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res
        .status(401)
        .json("There is already an account with that email");
    }

    // 3. bcrypt the user password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // 4. enter the new user inside our database
    let newUser = await pool.query(
      "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING user_id",
      [name, email, bcryptPassword]
    );

    // 5. generate our jwt token
    const jwtToken = generateJWT(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route  POST auth/login
// @desc   Login user and return JWT token
// @access Public
router.post("/login", validate, async (req, res) => {
  // 1. destructure the req.body
  const { email, password } = req.body;

  try {
    // 2. check if user doesn't exist (if not then we throw error)
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("There is no account with that email");
    }

    // 3. check if incoming password is same as database pasword
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Password is incorrect");
    }

    // 4. give the jwt auth_token
    const jwtToken = generateJWT(user.rows[0].user_id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET auth/verify
// @desc    Get verification from token
// @access  Public
router.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
