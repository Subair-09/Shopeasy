import { Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

export const customerGetCart = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    let cart = await Cart.findOne({ customer: customerId }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({
        customer: customerId,
        items: [],
        subtotalKobo: 0,
        shippingFeeKobo: 200000,
        discountKobo: 0,
        totalKobo: 200000,
      });
    }

    res.json({
      success: true,
      data: { cart },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerAddToCart = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    const { productId, quantity = 1, selectedColor, selectedSize } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404).json({ success: false, message: 'Product not found or unavailable' });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ success: false, message: `Only ${product.stock} items remaining in stock` });
      return;
    }

    let cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      cart = new Cart({
        customer: customerId,
        items: [],
      });
    }

    const existingIndex = cart.items.findIndex(
      (item: any) =>
        (item.product?.toString() === productId || item.productId?.toString() === productId) &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    const priceKobo = product.discountedPriceKobo || product.regularPriceKobo;

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        product: product._id,
        quantity,
        priceKobo,
        selectedColor,
        selectedSize,
        selected: true,
      });
    }

    // Recalculate totals
    const subtotal = cart.items.reduce((acc: number, curr: any) => acc + (curr.priceKobo || 0) * curr.quantity, 0);
    cart.subtotalKobo = subtotal;
    cart.shippingFeeKobo = subtotal > 5000000 ? 0 : 200000;
    cart.totalKobo = Math.max(0, cart.subtotalKobo + cart.shippingFeeKobo - (cart.discountKobo || 0));

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Product added to cart',
      data: { cart },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerUpdateCartItem = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    const item = (cart.items as any).id(itemId);
    if (!item) {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
      return;
    }

    if (quantity <= 0) {
      (cart.items as any).pull(itemId);
    } else {
      item.quantity = quantity;
    }

    const subtotal = cart.items.reduce((acc: number, curr: any) => acc + (curr.priceKobo || 0) * curr.quantity, 0);
    cart.subtotalKobo = subtotal;
    cart.shippingFeeKobo = subtotal > 5000000 ? 0 : 200000;
    cart.totalKobo = Math.max(0, cart.subtotalKobo + cart.shippingFeeKobo - (cart.discountKobo || 0));

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated',
      data: { cart },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerRemoveCartItem = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
      res.status(404).json({ success: false, message: 'Cart not found' });
      return;
    }

    (cart.items as any).pull(itemId);

    const subtotal = cart.items.reduce((acc: number, curr: any) => acc + (curr.priceKobo || 0) * curr.quantity, 0);
    cart.subtotalKobo = subtotal;
    cart.shippingFeeKobo = subtotal > 5000000 ? 0 : 200000;
    cart.totalKobo = Math.max(0, cart.subtotalKobo + cart.shippingFeeKobo - (cart.discountKobo || 0));

    await cart.save();
    await cart.populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: { cart },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerClearCart = async (req: any, res: Response): Promise<void> => {
  try {
    const customerId = req.customer?._id;
    const cart = await Cart.findOne({ customer: customerId });
    if (cart) {
      cart.items = [] as any;
      cart.subtotalKobo = 0;
      cart.discountKobo = 0;
      cart.shippingFeeKobo = 0;
      cart.totalKobo = 0;
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: { cart },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
