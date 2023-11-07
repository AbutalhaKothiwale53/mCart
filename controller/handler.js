const mongoose = require("mongoose");
const Schema = require("../model/Schema");

exports.signup = async (req, res) => {
  try {
    const { username, password, phoneNumber, email } = req.body;

    const newUser = new Schema.userModel({
      username,
      password,
      phoneNumber,
      email,
    });
    const validationError = newUser.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: validationError.message,
      });
    }
    const existingUser = await Schema.userModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Minimum 5 characters should be there in password" });
    }

    if (phoneNumber.toString().length !== 10) {
      return res
        .status(400)
        .json({ message: "Phone number should be 10 digits" });
    }
    await Schema.userModel.create(newUser);
    return res.status(201).json({
      message: `User Registered with Name: ${username}`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.login = async (req, res) => {
  const predefinedUser = {
    username: "admin",
    password: "admin",
  };
  try {
    const { username, password } = req.query;
    // const users = await Schema.userModel.findOne({username, password})
    if (
      username === predefinedUser.username &&
      password === predefinedUser.password
    ) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.log("Login error", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.addProduct = async (req, res) => {
  try {
    const {
      productId,
      productName,
      productCode,
      description,
      price,
      rating,
      manufacturer,
      osType,
    } = req.body;
    const newProduct = new Schema.productModel({
      productId,
      productName,
      productCode,
      description,
      price,
      rating,
      manufacturer,
      osType,
    });
    await newProduct.save();
    return res.status(201).json({
      message: `New Product added`,
      product: newProduct,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.tablets = async (req, res) => {
  try {
    const tablets = await Schema.productModel.find(
      {
        productCode: "TAB-120",
      },
      {
        _id: 0,
        __v: 0,
      }
    );
    if (tablets.length > 0) {
      res.status(200).json({
        status: "Success",
        tablets,
      });
    } else {
      res.status(400).json({
        status: "Failed",
        data: {
          message: "No Products available",
        },
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).json({
      status: "Product not found",
      data: { message: "Products not found" },
    });
  }
};
exports.mobiles = async (req, res) => {
  try {
    const mobiles = await Schema.productModel.find(
      {
        productCode: "MOB-120",
      },
      {
        _id: 0,
        __v: 0,
      }
    );
    if (mobiles.length > 0) {
      res.status(200).json({
        status: "Success",
        mobiles,
      });
    } else {
      res.status(404).json({
        status: "fail",
        data: { message: "Products not found" },
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};
exports.cart = async (req, res) => {
  try {
    const cart = await Schema.CartModel.find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    );
    if (cart.length > 0) {
      res.status(200).json({
        status: "Success",
        cart,
      });
    } else {
      res.status(404).json({
        status: "Fail",
        message: "Nothing available in cart",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
exports.getUserCartDetails = async (req, res) => {
  try {
    const username = req.params.username;
    const userCart = await Schema.CartModel.findOne({ username });
    if (userCart != null) {
      res.status(200).json({
        status: "Success",
        userCart,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: `${username} not available`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
exports.addProductsToCart = async (req, res) => {
  try{
    const {username, productsInCart} = req.body;
    // const products = productsInCart.map((item) => ({
    //   productId: item.productId,
    //   productName: item.productName,
    //   quantity: item.quantity,
    // }));
    const counter = await Schema.CounterModel.findByIdAndUpdate(
      'cartID',
      { $inc: {sequence_value: 1}},
      { new: true, upsert: true}
    );
    const newCart = new Schema.CartModel({
      cartID: counter.sequence_value,
      username: username,
      productsInCart: productsInCart,
      statusOfCart: 'Open',
    });
    await newCart.save();
    if(newCart != 0){
      res.status(201).json({
        status: 'Success',
        message: `New items got inserted into the cart with the ID : ${newCart.cartID}`,
        newCart,
      })
    }else{
      res.status(404).json({
        status: 'fail',
        message: "User's cart is already available, append to the same cart"
      })
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.updateCartByUser = async (req, res) => {
  try{
    const updateCart = await Schema.CartModel.findOneAndUpdate(
      {username: req.params.username},
      {$set:{productsInCart: req.body.updatedCart}},
      {new: true, runValidators: true}
    );
    if(updateCart != null){
      res.status(200).json({
        status: 'Success',
      message: `cartID: ${updateCart.cartID} updated`,
      updateCart,
      })
    }else{
      res.status(404).json({
        status: 'fail',
        message: `Users cart is not available`
      });
    }
  }catch(err){
    res.status(500).json({
      message: "Internal server error",
    });
    console.log(err);
  }
};
// exports.order = async (req, res) => {

// };
// exports.deleteProduct = async (req, res) => {

// };
// exports.default = async (req, res) => {

// };
