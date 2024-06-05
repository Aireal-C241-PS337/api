const { FieldValue } = require('@google-cloud/firestore');
const { firestore } = require('../firebase');
const uploadFiles = require('../utils/uploadFiles')

const collectionRef = firestore.collection('products');

exports.getAll = async (req, res) => {
  try {
    const snapshot = await collectionRef.get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json({
      status: 'success',
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.create = async (req, res) => {
  const {
    shopId,
    categoryId,
    name,
    description,
    longdescription,
    price,
    stock,
  } = req.body;
  try {
    const imageUrl = await uploadFiles(req.files);
    const docRef = await collectionRef.add({
      shopId,
      categoryId,
      name,
      description,
      longdescription,
      price,
      stock,
      image_url: imageUrl,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const newProduct = {
      id: docRef.id,
      shopId,
      categoryId,
      name,
      description,
      longdescription,
      price,
      stock,
      image_url: imageUrl,
    };

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await collectionRef.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    shopId,
    categoryId,
    name,
    description,
    longdescription,
    price,
    stock,
  } = req.body;

  try {
    const imageUrl = await uploadFiles(req.files);
    const docRef = collectionRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    await docRef.update({
      shopId,
      categoryId,
      name,
      description,
      longdescription,
      price,
      stock,
      image_url: imageUrl,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = collectionRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    await docRef.delete();

    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
