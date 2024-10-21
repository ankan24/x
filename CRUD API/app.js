const express = require("express");
const app = express();
const mongoose = require("mongoose");
const model = require("./model/model.js");

app.use(express.urlencoded());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world");
});

app.post("/api/products", async (req, res)=> {
  // console.log(req.body);
  // res.send(req.body);
  try {
    const product = await Product.cerate(req.body);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findById({ id });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).send(err);
  }
});

// update
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findByIdAndUpdate({ id }, req.body);
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    const updateProduct = await Product.findById(id);
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(400).send(err);
  }
});

// delete
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.findByIdAndDelete({ id });
    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://demouser:123@cluster0.ap4zayq.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("Not Connected to Database");
  });

app.listen(7070, () => console.log("Server started"));
