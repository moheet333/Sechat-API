require("dotenv").config();
require("express-async-errors");

const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(express.static(path.resolve(__dirname, "./client/build/")));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// routers
const authRouter = require("./routes/auth");
const notFoundMiddleware = require("./middleware/not-found");

app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundMiddleware);

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
