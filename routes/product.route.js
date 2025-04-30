import { createProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js";
import { verifyJWT } from "../helpers/auth.js";
import express from "express";

const productRoute = express.Router()

//route for get all products
productRoute.get("/get-all", verifyJWT, getProducts);

//route for create products
productRoute.post("/create", verifyJWT, createProduct);

//route for delete product
productRoute.delete("/delete", verifyJWT, deleteProduct);

//route for update products
productRoute.patch("/update", verifyJWT, updateProduct);

export default productRoute
