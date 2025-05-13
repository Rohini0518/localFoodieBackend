const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const port = process.env.PORT || 4000;

app.listen(port, "localhost", () => {
  console.log(`server is running in ${port}`);
});

mongoose
  .connect("mongodb://127.0.0.1/localFoodies")
  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.log("error occured", err);
  });

app.get("/", (req, res) => {
  res.send("backend is running ");
});
