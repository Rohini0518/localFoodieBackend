const express=require("express")
const router=express.Router();
const productController=require("../../controllers/productsController/productController")


router.get("/getAllProducts",productController.getAllProducts)
router.get("/getProductById/:id",productController.getProductById)
router.post("/createProduct",productController.createProduct)
router.put("/updateProduct/:id",productController.updateProductById)
router.delete("/deleteProduct/:id",productController.deleteProduct)

module.exports=router;