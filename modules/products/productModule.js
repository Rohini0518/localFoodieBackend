const mongoose=require("mongoose");

const productSchema=mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    image:{type:String,required:true},
    label:{type:String,required:true},
    healthy:{type:Boolean,default:false}

})

const Product=mongoose.model("Product",productSchema)

module.exports=Product;