const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const userController = require('../controllers/user');
const shopController = require('../controllers/shop');
const categoryController = require('../controllers/category');
const productController = require('../controllers/product');
const cartController = require('../controllers/cart');
const orderController = require('../controllers/order');

const authMiddleware = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/users', authMiddleware, userController.getAll);
router.get('/users/:id', authMiddleware, userController.getById);
router.put('/users/:id', authMiddleware, upload.array('image'), userController.update);
router.delete('/users/:id', authMiddleware, userController.delete);

router.get('/shops', authMiddleware, shopController.getAll);
router.get('/shops/user/:userId', authMiddleware, shopController.getByUserId);
router.post('/shops', authMiddleware, upload.array('image'), shopController.create);
router.get('/shops/:id', authMiddleware, shopController.getById);
router.put('/shops/:id', authMiddleware, upload.array('image'), shopController.update);
router.delete('/shops/:id', authMiddleware, shopController.delete);

router.get('/categories', authMiddleware, categoryController.getAll);
router.post('/categories', authMiddleware, categoryController.create);
router.get('/categories/:id', authMiddleware, categoryController.getById);
router.put('/categories/:id', authMiddleware, categoryController.update);
router.delete('/categories/:id', authMiddleware, categoryController.delete);

router.get('/products', authMiddleware, productController.getAll);
router.get('/products/shop/:shopId', authMiddleware, productController.getByShopId);
router.post('/products', authMiddleware, upload.array('image'), productController.create);
router.get('/products/:id', authMiddleware, productController.getById);
router.put('/products/:id', authMiddleware, upload.array('image'), productController.update);
router.delete('/products/:id', authMiddleware, productController.delete);

router.post('/cart', authMiddleware, cartController.addToCart);
router.delete('/cart', authMiddleware, cartController.removeFromCart);
router.get('/cart', authMiddleware, cartController.viewCart);

router.post('/order', authMiddleware, orderController.placeOrder);
router.get('/order', authMiddleware, orderController.getAllOrders);
router.get('/orders/user/:userId', authMiddleware, orderController.getOrdersByUser);

module.exports = router;
