import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// @desc    Create a product
// @route   POST /products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Manual validation check for missing fields
    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, description, price, category, image, stock',
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0',
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock cannot be negative',
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });

    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all products (with search, category filter, and sorting)
// @route   GET /products
export const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const query = {};

    // Search filter (case-insensitive regex)
    if (search) {
      query.name = { $regex: search,$options: 'i' };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Sorting setup (Bonus Challenge)
    let sortOption = {};
    if (sort === 'price_asc') {
      sortOption.price = 1;
    } else if (sort === 'price_desc') {
      sortOption.price = -1;
    } else {
      sortOption.createdAt = -1; 
    }

    const products = await Product.find(query)
      .select('name price category image stock')
      .sort(sortOption);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
};

// @desc    Get single product by ID
// @route   GET /products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product details',
    });
  }
};