const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));

app.listen(process.env.PORT, () =>
  console.log(
    `Server started on port ${process.env.PORT}. See http://localhost:${process.env.PORT}/`
  )
);
