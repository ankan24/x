const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a valid name"],
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model('Product',Schema);

module.exports = Product;
