const { Router } = require('express')
const {
  getAllUsers,
  postRegister,
  postLogin,
  refreshTokenController,
  logout,
} = require('../controller/controllerAuth')

const verifyJWT = require('../JWT/VerifyJWT')

const {
  getProductsData,
  getSingleProductsData,
} = require('../controller/controllerProducts')

const {
  addCartItem,
  renderCart,
  removeCartItem,
  updateCartItem,
  deleteCartAll,
} = require('../controller/controllerCart')

const router = Router()

router.route('/getAllUsers').get(getAllUsers)
router.route('/register').post(postRegister)
router.route('/login').post(postLogin)
router.route('/refresh').get(refreshTokenController)
router.route('/logout').get(logout)

router.route('/products').get(getProductsData)
router.route('/products/:id').get(verifyJWT, getSingleProductsData)

router.route('/order').get(renderCart).post(verifyJWT, addCartItem)
router.route('/removeItemCart').post(removeCartItem)
router.route('/updateItemCart').patch(updateCartItem)
router.route('/deleteCartAll').delete(deleteCartAll)
module.exports = router
