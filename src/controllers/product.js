const { FieldValue } = require('@google-cloud/firestore');
const { firestore } = require('../firebase');
const uploadFiles = require('../utils/uploadFiles')

const collectionRef = firestore.collection('products');
const categoryCollection = firestore.collection('categories');
const shopCollection = firestore.collection('shops');

exports.getAll = async (req, res) => {
  const { category, name } = req.query;
  try {
    let query = collectionRef;

    if (category) {
      const categorySnapshot = await categoryCollection.where('name', '==', category).get();
      
      if (categorySnapshot.empty) {
        return res.status(404).json({
          status: 'error',
          message: 'Category not found',
        });
      }

      const categoryDoc = categorySnapshot.docs[0];
      const categoryId = categoryDoc.id;

      query = query.where('categoryId', '==', categoryId);
    }

    if (name) {
      query = query.where('name', '>=', name).where('name', '<=', name + '\uf8ff');
    }

    query = query.limit(15);
    
    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: 'error',
        message: 'No product found matching the criteria',
      });
    }

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
    const categoryDoc = await categoryCollection.doc(categoryId).get();
    if (!categoryDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      })
    }

    const shopDoc = await shopCollection.doc(shopId).get();
    if (!shopDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Shop not found'
      })
    }

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

exports.getByShopId = async (req, res) => {
  const { shopId } = req.params;

  try {
    const shopDoc = await shopCollection.doc(shopId).get();
    if (!shopDoc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Shop not found',
      });
    }

    const snapshot = await collectionRef.where('shopId', '==', shopId).get();

    if (snapshot.empty) {
      return res.status(404).json({
        status: 'error',
        message: 'No product found for this shop',
      });
    }

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
    let imageUrl = [];
    if (req.files && req.files.length > 0) {
      imageUrl = await uploadFiles(req.files);
    }

    const docRef = collectionRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found',
      });
    }

    const updateData = {
      shopId,
      categoryId,
      name,
      description,
      longdescription,
      price,
      stock,
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (name !== undefined) {
      updateData.name = name;
    }

    if (imageUrl.length > 0) {
      updateData.image_url = imageUrl;
    }

    await docRef.update(updateData);

    return res.status(200).json({
      status: 'success',
      data: updateData,
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
