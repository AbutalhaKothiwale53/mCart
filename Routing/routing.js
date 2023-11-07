const express = require("express");
const router = express.Router();
const Handler = require("../controller/handler");

const {
  signup,
  login,
  addProduct,
  tablets,
  mobiles,
  cart,
  getUserCartDetails,
  addProductsToCart,
  updateCartByUser,
} = Handler;

router.post("/signup", signup);
router.get("/login", login);
router.post("/addProduct", addProduct);
router.get("/tablets", tablets);
router.get("/mobiles", mobiles);
router.get("/cart", cart);
router.get("/cart/:username", getUserCartDetails);
router.post("/cart", addProductsToCart);
router.put("/cart/:username", updateCartByUser  )

module.exports = router;
