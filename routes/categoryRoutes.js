import { Router } from 'express';
import categoryService from '../services/categoryService.js'


const router = Router();

router.get('/', async (req, res) => {
    try {
        const categories = await categoryService.getCategories()
        res.status(200).send({ data: categories });   
    }
    catch(error) {
        console.log(error);
        res.status(500).send({ message: 'An error occured. Could not find categories.'});
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).send({
                message: `Could not find category with id: ${id}`
            })
        }
        res.status(200).send({ data: category });
    }
    catch(error) {
        console.log(error);
        res.status(500).send({ message: 'An error occured. Could not find category.'});
    }
});

export default router;