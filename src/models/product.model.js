import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'




const {Schema} = mongoose;

const productCollection = 'product';
const productSchema = new Schema({
    nombre: {type: String, required: true},
    cod: {type: Number, required: true, unique: true},
    precio: {type: Number, required: true},
    descripcion: {type: String, required: true},
    thumbnail: {type: String}
})


productSchema.plugin(mongoosePaginate)
productSchema.index({ precio: 1});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;