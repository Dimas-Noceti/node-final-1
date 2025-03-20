import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import methodOverride from "method-override";
import productModel from './models/product.model.js';

import viewsRouter from './routes/views.router.js'
import productRouter from './routes/product.router.js'

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');


app.use(express.static(__dirname + '/public'));

const enviromentInit = async () => {
    await mongoose.connect(config.URL_MONGODB)
}

enviromentInit();

app.use(methodOverride('_method'));


 
app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`));

app.use('/', viewsRouter);
app.use('/product', productRouter)
