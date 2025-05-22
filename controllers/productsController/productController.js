const productModel = require("../../modules/products/productModule");
const joi = require("joi");
const createProduct = async (req, res) => {
  const { error:joierr } = joiProductValidator(req.body);
  if (joierr) {
   return res
      .status(400)
      .send({ message: "validation error", details: error.details[0].message });
  }
  try {
    let product = new productModel({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      label: req.body.label,
    });
    await product.save();
    res.status(201).send({ message: "product created", details: product });
  } catch (err) {
    res.status(500).send({ message: "error occured", error: err });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).send(products);
  } catch (err) {
    res
      .status(400)
      .send({ message: "failed to fetch data", details: err.message });
  }
};

const getProductById = async (req, res) => {
  const { error:joierr } = joiIdValidator(req.params.id);
  if (joierr) return res.status(400).send(joierr);
 
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "product not found" });
    }
    res.status(200).send(product);
  } catch (err) {
    res
      .status(500)
      .send({ message: "failed to fetch data", details: err.message });
  }
};

const updateProductById = async (req, res) => {
   const { error:joierr } = joiIdValidator(req.params.id);
  if (joierr) return res.status(400).send(joierr);
  const { err: bodyError } = joiValidator(req.body);
  if (bodyError) {
    return res
      .status(400)
      .send({
        message: "Validation error",
        details: bodyError.details[0].message,
      });
  }
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        label: req.body.label,
      },
      { new: true }
    );
    if (!product) {
      return res.status(400).send({ message: "product not found" });
    }
    res
      .status(200)
      .send({ message: "product is updated succesfully", details: product });
  } catch (error) {
    res.status(500).send("product not found server error");
  }
};

const deleteProduct = async (req, res) => {
   const { error:joierr } = joiIdValidator(req.params.id);
  if (joierr) return res.status(400).send(joierr);
  try {
    const delProduct = await productModel.findByIdAndRemove(req.params.id);
    if (!delProduct) {
      return res.status(404).send("id not found");
    }
    res
      .status(200)
      .send({ message: "product deleted succesfully", details: delProduct });
  } catch (error) {
    return res.status(500).send("product not found server error");
  }
};

function joiProductValidator(product) {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    price: joi.number().required(),
    image: joi.string().required(),
    label: joi.string().required(),
  });
  return schema.validate(product);
}

function joiIdValidator(id) {
  const schema = joi
    .string()
    .length(24)
    .hex()
    .required()
    .error(() => new Error("Invalid MongoDb objectId format"));
  return schema.validate(id);
}

module.exports={createProduct,getAllProducts,getProductById,updateProductById,deleteProduct}