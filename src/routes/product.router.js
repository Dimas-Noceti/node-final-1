import { Router } from 'express';
import productModel from '../models/product.model.js';
import { uploader } from '../utilsMulter.js';


const router = Router();


// Crear 
router.post('/', uploader.single('file'), async (req, res) => {
    try{
        const newProduct = new productModel(req.body);

        if(req.file){
            console.log(req.file);
            newProduct.thumbnail = req.file.filename
        }

        await newProduct.save();
        res.render('product', {product: newProduct.toObject()})
    }catch(error){
        return res.json({message: "Error al crear un producto"});
    }
})


// Ver UN producto
router.get('/:cod', async (req, res) => {
    try{
        let product = await productModel.findOne({cod: req.params.cod});
        if (!product) {
            return res.json({message: "Error al encontrar el producto indicado."})
        }
        res.render('product', {product : product.toObject()})

    }catch(error){
        return res.render({error})
    }
})



// Ver productos
router.get('/', async (req, res) => {
    try{
        let products = await productModel.find();
        res.render('products', {products : products.map( product => product.toObject())})

    }catch(error){
        return res.json({message: error})
    }
})


// Eliminar
router.delete('/:pid', async (req, res) => {
    try{
        const productoAEliminar = await productModel.findByIdAndDelete(req.params.pid);
        if(!productoAEliminar){
            return res.render('error', {error: "No se encontró el producto a eliminar"});
        }
        console.log(`Producto con id ${req.params.pid} eliminado exitosamente`);
        res.redirect('/product');
    }catch(error){
        console.error(error);
        return res.render('error',{error: "Error al borrar el producto"})
    }
})



export default router;