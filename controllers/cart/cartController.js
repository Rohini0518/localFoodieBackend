const Cart = require("../../modules/cart/cartModule");

const createcartItem = async (req, res) => {
  try {
    const cart = new Cart({
      productId: req.params.id,
      quantity: req.body.quantity,
    });
    const savedItem = await cart.save();

    const populatedItem = await savedItem.populate(
      "productId",
      "name price image "
    );
    res
      .status(201)
      .send({ message: "Item added to cart", item: populatedItem });
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
    const cart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        productId: req.body.productId,
        quantity: req.body.quantity,
      },
      { new: true }
    ).populate("productId", "name price image label");

    if (!cart) return res.status(404).send("id not found");
    res
      .status(200)
      .send({ message: "cart item updated succcesfully", item: cart });
  } catch (error) {
    res
      .status(500)
      .send({ message: "failed to update cart item", error: error.message });
  }
};
const deleteItemById = async (req, res) => {
  try {
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

module.exports = {
  createcartItem,
  getItemById,
  getCartItems,
  updateItemById,
  deleteItemById,
};
