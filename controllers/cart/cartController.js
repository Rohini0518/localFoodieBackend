const Cart = require("../../modules/cart/cartModule");
const joi = require("joi");

const createCartItem = async (req, res) => {
  try {
    const { error:joierr } = joiItemValidator(req.body);
    if (joierr) return res.status(400).send({message:"error in joi validation",error:joierr.details[0].message});
    const { productId, quantity } = req.body;
    const productExist =await Cart.findOne({ productId });
    
    if (!productExist) {
      const cart =  new Cart({
        productId,
        quantity
      })
      const savedItem = await cart.save();
      const populatedItem = await savedItem.populate(
        "productId",
        "name price image "
      );
      res
        .status(201)
        .send({ message: "Item added to cart", item: populatedItem });
    } else {
      productExist.quantity += 1;
      const savedItem = await productExist.save();
      const populatedItem = await savedItem.populate(
        "productId",
        "name price image "
      );
      res
        .status(201)
        .send({ message: "Item quantity added to cart", item: populatedItem });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send("server error failed to add item to cart");
  }
};

const getCartItems = async (req, res) => {
  try {
    const cart = await Cart.find().populate(
      "productId",
      "name price image label"
    );
    if (!cart || cart.length === 0)
      return res.status(400).send("items not found");
    res
      .status(200)
      .send({ message: "cart items fetched succesfully", item: cart });
  } catch (error) {
    res.status(500).send("server error failed to fetch cart");
  }
};

const getItemById = async (req, res) => {
  try {
    const {error:joierr}=joiIdValidator(req.params.id)
    if(joierr) return res.status(400).send({message:"id is not valid",error:joierr.details[0].message})
    const cart = await Cart.findById(req.params.id).populate(
      "productId",
      "name price image label"
    );
    if (!cart) return res.status(404).send("id not found");
    res
      .status(200)
      .send({ message: "cart item fetched succcesfully", item: cart });
  } catch (error) {
    res
      .status(500)
      .send({ message: "cant fetch id from server", error: error.message });
  }
};

const updateItemById = async (req, res) => {
  try {
    const {error:joierr}=joiIdValidator(req.params.id)
    if(joierr) return res.status(400).send({message:"id is not valid",error:joierr.details[0].message})  
    const { action } = req.body;
    if (action!="increase" || action!="decrease") return res.status(404).send("action is not valid");
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) return res.status(404).send("id is not valid");
    if (cartItem.quantity ===1 && action === "decrease") {
      await Cart.findByIdAndDelete(req.params.id);
       return res
        .status(200)
        .send({ message: "item deleted successfully", item: null });
      }
    if (action === "increase") {
      cartItem.quantity += 1;
    } else if (action === "decrease"&&cartItem.quantity > 1 ) {
      cartItem.quantity -= 1;    
    }
    else return res.status(400).send({ message: "Invalid action data cant delete" });
    
    const updatedItem = await cartItem.save();
    const populatedItem =await  updatedItem.populate(
      "productId",
      "name price image label"
    );
    res
      .status(200)
      .send({ message: `item ${action}d succesfully`, item: populatedItem });
  } catch (error) {
    res
      .status(500)
      .send({ message: "cant fetch data from server", error: error.message });
  }
};

const deleteItemById = async (req, res) => {
  try {
    const {error:joierr}=joiIdValidator(req.params.id)
    if(joierr) return res.status(400).send({message:"id is not valid",error:joierr.details[0].message})
    const cart = await Cart.findByIdAndDelete(req.params.id).populate(
      "productId",
      "name price image label"
    );
    if (!cart) return res.status(404).send("id not found");
    res
      .status(200)
      .send({ message: "cart item deleted succcesfully", item: cart });
  } catch (error) {
    res
      .status(500)
      .send({ message: "item was not deleted", error: error.message });
  }
};

function joiIdValidator(id) {
  const schema = joi
    .string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .error(() => new Error("Invalid MongoDb objectId format"));
  return schema.validate(id);
}

function joiItemValidator(item) {
  const schema = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().integer().required(),
  });
    return schema.validate(item);

}

module.exports = {
  createCartItem,
  getItemById,
  getCartItems,
  updateItemById,
  deleteItemById,
};
