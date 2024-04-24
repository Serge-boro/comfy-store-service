const SchemaCart = require('../moduleDB/moduleCart')
const SchemaProducts = require('../moduleDB/moduleProducts')
const SchemaUser = require('../moduleDB/moduleUser')

const addCartItem = async (req, res, next) => {
  const { cartProduct } = req.body

  const cartItems = await SchemaCart.findOne({
    productID: cartProduct.productID,
  })

  if (cartItems) {
    if (cartItems.productColor !== cartProduct.productColor) {
      await SchemaCart.create(cartProduct)
    } else {
      cartItems.amount += cartProduct.amount
      await cartItems.save()
    }
  } else {
    await SchemaCart.create(cartProduct)
  }

  res.status(200).json({ cartProduct })
}

const removeCartItem = async (req, res, next) => {
  const { cartID } = req.body
  const cart = await SchemaCart.findOneAndDelete({ cartID })
  console.log(cart)
  // const cartItems = cart.filter((item) => item.cartID !== cartID)
  // await cartItems.save()
  // console.log(cartItems)
  res.status(200).json('')
}

const updateCartItem = async (req, res, next) => {
  const { cartID, amount } = req.body
  const cartItems = await SchemaCart.findOneAndUpdate({ cartID }, req.body, {
    new: true,
    runValidators: true,
  })
  res.status(200).json(cartItems)
}

const deleteCartAll = async (req, res) => {
  await SchemaCart.deleteMany({})

  res.status(200).json('cart was deleted')
}

const renderCart = async (req, res) => {
  const cartItems = await SchemaCart.find({})

  res.status(200).json(cartItems)
}

module.exports = {
  addCartItem,
  renderCart,
  removeCartItem,
  updateCartItem,
  deleteCartAll,
}
