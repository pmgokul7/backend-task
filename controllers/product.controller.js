import Joi from "joi";
import { sendError, sendSuccess } from "../helpers/requestHandler.js"
import { throwCustomError } from "../helpers/error.js";
import { Product } from "../models/product.js";


export const getProducts = async (req, res) => {
    try {
        const { page = 1, sort = "desc" } = req.query;
        const limit = 10;
        let products = await Product.findAll({
            limit,
            offset: (page - 1) * limit,
            order: [["created_at", sort == "asc" ? "ASC" : "DESC"]],
            raw: true
        })

        return sendSuccess(req, res, "products fetched successfully")(products)

    } catch (error) {
        sendError(req, res, error)
    }
}


export const createProduct = async (req, res) => {
    try {
        const { title, description, quantity, price, image_url = "https://placehold.co/200x300" } = req.body;
        const schema = Joi.object({
            title: Joi.string().min(5).max(25).required(),
            description: Joi.string().min(5).max(250).required(),
            quantity: Joi.number().min(0).required(),
            image_url: Joi.string().optional(),
            price:Joi.number().min(1).required()
        })
        const { error } = schema.validate(req.body)
        error ? console.log("first", error) : ""
        await Product.create({
            title,
            description,
            quantity,
            price,
            image_url
        })
        return sendSuccess(req, res, "product created successfully", 201)()
    } catch (error) {
        console.log(error)
        sendError(req, res, error)
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const schema = Joi.object({
            id: Joi.number().required()
        })
        const { error } = schema.validate(req.body)
        error ? throwCustomError(1002) : ""

        const product = await Product.findOne({
            where: {
                id
            },
            raw: true
        })

        console.log(product)

        if (!product) {
            throwCustomError(1056)
        }
        const deleted = await Product.destroy({
            where: {
                id
            }
        })

        return sendSuccess(req, res, "product deleted", 200)()


    } catch (error) {
        sendError(req, res, error)
    }
}



export const updateProduct = async (req, res) => {
    try {
        const {id} = req?.body;

        const schema = Joi.object({
            id: Joi.number().required(),
            title: Joi.string().min(5).max(25).optional(),
            description: Joi.string().min(5).max(250).optional(),
            quantity: Joi.number().min(0).optional(),
            image_url: Joi.string().optional(),
            price:Joi.number().min(1).required()
        })
        const { error } = schema.validate(req.body)
        error ? throwCustomError(1002) : ""

        await Product.update({ ...req?.body }, {
            where: { id }
        })

        return sendSuccess(req, res, "product updated", 200)()

    } catch (error) {
        sendError(req, res, error)
    }
}