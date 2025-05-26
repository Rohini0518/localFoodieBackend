const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRouter = require("./routes/product/productRoute");
const cartRouter = require("./routes/cart/cartRoute");
require("dotenv").config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 4000;
app.use(cors({
  origin: 'https://localfoodies.netlify.app', 
  credentials: true
}));
;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mongodb atlas is connected");
  })
  .catch((err) => {
    console.log("error occured", err);
  });

app.get("/", (req, res) => {
  res.send("backend is running ");
});

app.use("/products", productRouter);
app.use("/cart", cartRouter);
