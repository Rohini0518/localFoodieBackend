const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const productRouter = require("./routes/product/productRoute");
const cartRouter = require("./routes/cart/cartRoute");
const app = express();
app.use(express.json());
const port = process.env.PORT || 4000;
app.use(cors({
  origin: 'https://localfoodies.netlify.app', 
  credentials: true
}));
app.listen(port, "localhost", () => {
  console.log(`server is running in ${port}`);
});

mongoose
  .connect(
    "mongodb+srv://rohinipolina489:Rohini123@cluster0.f6v9ty4.mongodb.net/localFoodies?retryWrites=true&w=majority&appName=Cluster0"
  )
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
