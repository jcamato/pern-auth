const jwt = require("jsonwebtoken");
require("dotenv").config();

function generateJWT(user_id) {
  const payload = {
    user: {
      id: user_id,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = generateJWT;
