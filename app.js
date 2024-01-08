require("dotenv").config();
require("express-async-errors");

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

// routers
const authRouter = require("./routes/auth");

app.use("/api/v1/auth", authRouter);

app.use(express.static(path.resolve(__dirname, "./client/build")));

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Application started on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
