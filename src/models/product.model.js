import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'




const {Schema} = mongoose;

const productCollection = 'product';
const productSchema = new Schema({
    nombre: {type: String, required: true},
    cod: {type: Number, required: true, unique: true},
    precio: {type: Number, required: true},
    descripcion: {type: String, required: true},
    thumbnail: {type: String},
    cart: {type: Number, default: 0}
})


productSchema.plugin(mongoosePaginate)
productSchema.index({ precio: 1});

productSchema.methods.addToCart = function(quantity) {
  if (quantity <= 0) {
    throw new Error('La cantidad debe ser mayor que cero.');
  }
  this.cart = (this.cart || 0) + quantity;
  return this.save();
};

productSchema.methods.removeFromCart = function(quantity) {
  if (quantity <= 0) {
    throw new Error('La cantidad debe ser mayor que cero.');
  }
  if (!this.cart || this.cart < quantity) {
    throw new Error('No hay suficientes elementos en el carrito.');
  }
  this.cart -= quantity;
  return this.save();
};

productSchema.methods.updateCartQuantity = function(quantity) {
  if (quantity <= 0) {
    throw new Error('La cantidad debe ser mayor que cero.');
  }
  this.cart = quantity;
  return this.save();
};

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
