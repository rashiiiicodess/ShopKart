import Customer from '../models/customer.model.js';
import Product from '../models/product.model.js'
import mongoose from 'mongoose';

// @route   POST /wishlist/:productId
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    // Verify product existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get current authenticated user
    const user = await Customer.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const isWishlisted = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (isWishlisted) {
      return res.status(409).json({
        success: false,
        message: 'Product is already in your wishlist',
      });
    }

    // Add reference and save
    user.wishlist.push(productId);
    await user.save();


    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlistCount: user.wishlist.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while adding to wishlist',
      error: error.message,
    });
  }
};

// @route   GET /wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await Customer.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price category image stock description',
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    return res.status(200).json({
      success: true,
      count: user.wishlist.length,
      wishlist: user.wishlist,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching wishlist',
      error: error.message,
    });
  }
};


// @route   DELETE /wishlist/:productId

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const user = await Customer.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const isPresent = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!isPresent) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in your wishlist',
      });
    }

    // Pull product ID out of wishlist array
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlistCount: user.wishlist.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while removing from wishlist',
      error: error.message,
    });
  }
};





























export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await Customer.findById(req.user.id);
    const isWishlisted = user.wishlist.some((id) => id.toString() === productId);

    if (isWishlisted) {
      user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
      await user.save();
      return res.status(200).json({
        success: true,
        saved: false,
        message: 'Product removed from wishlist',
        wishlistCount: user.wishlist.length,
      });
    } else {
      user.wishlist.push(productId);
      await user.save();
      return res.status(200).json({
        success: true,
        saved: true,
        message: 'Product added to wishlist',
        wishlistCount: user.wishlist.length,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


