import { Router } from "express";
import ProductService from "../services/ProductService.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await ProductService.getProducts();
        res.status(200).send({ data: products });   
    }
    catch(error) {
        console.log(error);
        res.status(500).send({ message: 'An error occured. Could not find products.'});
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await ProductService.getProductById(id);
        if (!product) {
            return res.status(404).send({
                message: `Could not find product with id: ${id}`
            })
        }
        res.status(200).send({ data: product });
    }
    catch(error) {
        console.log(error);
        res.status(500).send({ message: 'An error occured. Could not find product.'});
    }
});

export default router;

