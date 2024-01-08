const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

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
