const { FieldValue } = require('@google-cloud/firestore');
const { firestore } = require('../firebase');

const collectionRef = firestore.collection('categories');

exports.getAll = async (req, res) => {
  try {
    const snapshot = await collectionRef.get();
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json({
      status: 'success',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.create = async (req, res) => {
  const { name } = req.body;

  try {
    const existingCategory = await collectionRef.where('name', '==', name).get();
    if (!existingCategory.empty) {
      return res.status(400).json({
        status: 'error',
        messege: 'category already exist'
      })
    }

    const docRef = await collectionRef.add({
      name,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const newCategory = { id: docRef.id, name };

    return res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    console.error('Error creating category:', error);
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
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const docRef = collectionRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found',
      });
    }

    await docRef.update({
      name,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      status: 'success',
      data: { id, name },
    });
  } catch (error) {
    console.error('Error updating category:', error);
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
        message: 'Category not found',
      });
    }

    await docRef.delete();

    return res.status(200).json({
      status: 'success',
      message: 'Category deleted',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
