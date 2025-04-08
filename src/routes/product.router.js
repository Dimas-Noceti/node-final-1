import { Router } from 'express';
import productModel from '../models/product.model.js';
import { uploader } from '../utilsMulter.js';


const router = Router();


// Crear
router.post('/', uploader.single('file'), async (req, res) => {
    try {
        const { nombre, cod, precio, descripcion } = req.body;

        if (!nombre || !cod || !precio || !descripcion) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        const newProduct = new productModel(req.body);

        if (req.file) {
            console.log(req.file);
            newProduct.thumbnail = req.file.filename;
        }

        await newProduct.save();
        res.render('product', { product: newProduct.toObject() });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el producto.' });
    }
});


// Ver UN producto
router.get('/:cod', async (req, res) => {
    try {
        let product = await productModel.findOne({ cod: req.params.cod });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.render('product', { product: product.toObject() });

    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { error: 'Error al encontrar el producto.' });
    }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const { nombre, cod, precio, descripcion } = req.body;

        if (!nombre && !cod && !precio && !descripcion) {
            return res.status(400).json({ message: 'Debe proporcionar al menos un campo para actualizar.' });
        }

        const producto = await productModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json({ message: `Producto ${producto.nombre} actualizado.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el producto.' });
    }
});

// Ver productos
router.get('/', async (req, res) => {
    try {
        let products = await productModel.find();
        res.render('products', { products: products.map(product => product.toObject()) });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los productos.' });
    }
});


// Eliminar
router.delete('/:pid', async (req, res) => {
    try {
        const productoAEliminar = await productModel.findByIdAndDelete(req.params.pid);
        if (!productoAEliminar) {
            return res.status(404).render('error', { error: 'No se encontró el producto a eliminar.' });
        }
        console.log(`Producto con id ${req.params.pid} eliminado exitosamente`);
        res.redirect('/product');
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { error: 'Error al borrar el producto.' });
    }
});



// Agregar al carrito
router.post('/:pid/cart', async (req, res) => {
    try {
        const producto = await productModel.findById(req.params.pid);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        const cantidad = parseInt(req.body.cantidad);
        if (isNaN(cantidad) || cantidad <= 0) {
            return res.status(400).json({ message: 'Cantidad inválida.' });
        }

        producto.addToCart(cantidad);
        res.json({ message: `Producto ${producto.nombre} agregado al carrito.` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al agregar el producto al carrito.' });
    }
});

export default router;
