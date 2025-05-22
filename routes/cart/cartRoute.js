const express=require("express");
const router=express.Router()
const cartController=require("../../controllers/cart/cartController");

router.get("/getAllItems",cartController.getCartItems);
router.get("/getItemById/:id",cartController.getItemById);
router.post("/createCartItem",cartController.createCartItem);
router.put("/updateItemById/:id",cartController.updateItemById);
router.delete("/deleteItemById/:id",cartController.deleteItemById);

module.exports=router;
