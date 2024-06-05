const { FieldValue } = require('@google-cloud/firestore');
const { firestore } = require('../firebase');

const orderCollection = firestore.collection('orders');
const productCollection = firestore.collection('products');
const cartCollection = firestore.collection('carts');

exports.placeOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const cartDoc = await cartCollection.doc(userId).get();
    if (!cartDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart not found',
      });
    }

    const cart = cartDoc.data();
    const batch = firestore.batch();

    for (let item of cart.items) {
      const productRef = productCollection.doc(item.productId);
      const productDoc = await productRef.get();

      if (!productDoc.exists) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found',
        });
      }

      const product = productDoc.data();
      if (product.stock < item.quantity) {
        return res.status(400).json({
          status: 'error',
          message: 'Insufficient stock',
        });
      }

      batch.update(productRef, {
        stock: product.stock - item.quantity,
      });
    }

    const orderRef = orderCollection.doc();
    batch.set(orderRef, {
      userId,
      items: cart.items,
      createdAt: FieldValue.serverTimestamp(),
    });
    batch.delete(cartCollection.doc(userId));

    await batch.commit();

    return res.status(200).json({
      status: 'success',
      message: 'Order placed successfully',
    });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const snapshot = await orderCollection.get();
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const snapshot = await orderCollection.where('userId', '==', userId).get();
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
