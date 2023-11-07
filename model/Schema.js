const mongoose = require("mongoose");
const DB_URI = "mongodb://127.0.0.1:27017/mCart_DB";

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err.message);
  });

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Required Field"],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Required Field"],
    },
    email: {
      type: String,
      required: [true, "Required Field"],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const userModel = mongoose.model("Users", userSchema);

const productSchema = mongoose.Schema(
  {
    productId: {
      type: Number,
      unique: true,
      required: [true, "Required field"],
    },
    productName: {
      type: String,
      required: [true, "Required field"],
    },
    productCode: {
      type: String,
      required: [true, "Required field"],
    },
    description: {
      type: String,
      required: [true, "Required field"],
    },
    price: {
      type: Number,
      required: [true, "Required field"],
    },
    rating: {
      type: String,
      required: [true, "Required field"],
    },
    manufacturer: {
      type: String,
      required: [true, "Required field"],
    },
    osType: {
      type: String,
      required: [true, "Required field"],
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

const productModel = mongoose.model("Products", productSchema);

const cartSchema = mongoose.Schema({
  cartID: {
    type: Number,
    unique: true,
    required: [true, "Cart ID is Required"],
  },
  username: {
    type: String,
    required: [true, "Required Field"],
  },
  productsInCart: [{ productId: Number, productName: String, quantity: Number }],
  statusOfCart: {
    type: String,
    required: [true, "Required Field"],
  },
});

const CartModel = mongoose.model("Carts", cartSchema);

const orderSchems = mongoose.Schema({
  orderID: {
    type: Number,
    unique: true,
    required: [true, "Required Field"],
  },
  cartID: {
    type: Number,
    unique: true,
    required: [true, "Required Field"],
  },
});
const orderModel = mongoose.model("Order", orderSchems);

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 },
});

const CounterModel = mongoose.model('Counter', counterSchema);

module.exports = {
  userModel, productModel,  CartModel, orderModel, CounterModel
};
