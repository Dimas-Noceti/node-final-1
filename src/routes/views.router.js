import { Router } from 'express';
import productModel from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {

    const elementosPorPagina = req.query.limit ?? 10;
    const paginaActual = req.query.page ?? 1;


    let infoPaginate = await productModel.paginate(
        {},
        { 
            limit: elementosPorPagina,
            page: paginaActual,
            sort: { cod: -1}
        } 
     )
    res.render('index', {info: infoPaginate});
    infoPaginate.docs = infoPaginate.docs.map( doc => doc.toObject())
})
router.get('/crearProducto', (req, res)=> {
    res.render('newProduct');
})


export default router;