const { Schema, model, Types } = require('mongoose')

// const SingleOrderItemSchema = Schema({
//   cartID: { type: String },
//   productID: { type: Number },
//   image: { type: String },
//   title: { type: String },
//   price: { type: Number },
//   company: { type: String },
//   productColor: { type: [String] },
//   amount: { type: Number },
// })

const SchemaCart = new Schema({
  // numItemsInCart: {
  //   type: Number,
  //   required: [true, 'Please provide total number'],
  // },
  // cartTotal: {
  //   type: Number,
  //   required: [true, 'Please provide total value'],
  // },
  // shipping: {
  //   type: Number,
  //   required: [true, 'Please provide product shippingFree field'],
  // },
  // tax: {
  //   type: Number,
  //   required: [true, 'Please provide tax field'],
  // },
  // orderTotal: {
  //   type: Number,
  //   required: [true, 'Please provide order total value'],
  // },
  // cartItems: [SingleOrderItemSchema],
  // user: {
  //   type: Schema.ObjectId,
  //   ref: 'User',
  //   required: [true, 'Please provide userOrder'],
  // },
  cartID: { type: String },
  productID: { type: Number },
  image: { type: String },
  title: { type: String },
  price: { type: Number },
  company: { type: String },
  productColor: { type: String },
  amount: { type: Number },
  user: {
    type: Types.ObjectId,
    ref: 'Users',
    // required: [true, 'Please provide userOrder'],
  },
})

module.exports = model('Cart', SchemaCart)
