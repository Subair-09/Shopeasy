import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Admin } from '../models/Admin';
import { Customer } from '../models/Customer';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { StoreSettings } from '../models/StoreSettings';
import { Promotion } from '../models/Promotion';

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Starting ShopEasy Database Seed...');

    // 1. Super Admin
    await Admin.deleteMany({});
    const superAdmin = await Admin.create({
      name: 'Nurudeen Adewale',
      email: 'nuddywale@gmail.com',
      password: 'Adewale009',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      isActive: true,
    });
    console.log(`[Seed] Super Admin created: ${superAdmin.email} / Adewale009`);

    // 2. Store Settings
    await StoreSettings.deleteMany({});
    await StoreSettings.create({
      storeName: 'ShopEasy',
      tagline: 'Shop Smart. Live Better.',
      supportEmail: 'support@shopeasy.com',
      supportPhone: '+234 800 SHOPEASY',
      currency: 'NGN',
      currencySymbol: '₦',
      standardShippingFeeKobo: 200000,
      freeShippingThresholdKobo: 5000000,
      taxPercentage: 7.5,
    });

    // 3. Categories
    await Category.deleteMany({});
    const categoriesData = [
      { name: 'Phones', slug: 'phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80', icon: 'phone-portrait-outline', displayOrder: 1 },
      { name: 'Fashion', slug: 'fashion', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80', icon: 'shirt-outline', displayOrder: 2 },
      { name: 'Beauty', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80', icon: 'sparkles-outline', displayOrder: 3 },
      { name: 'Home', slug: 'home', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80', icon: 'home-outline', displayOrder: 4 },
      { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=80', icon: 'laptop-outline', displayOrder: 5 },
      { name: 'Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80', icon: 'footsteps-outline', displayOrder: 6 },
      { name: 'Accessories', slug: 'accessories', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80', icon: 'headset-outline', displayOrder: 7 },
      { name: 'More', slug: 'more', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', icon: 'grid-outline', displayOrder: 8 },
    ];
    await Category.insertMany(categoriesData);
    console.log(`[Seed] Seeded ${categoriesData.length} categories.`);

    // 4. Products
    await Product.deleteMany({});
    const productsData = [
      {
        name: 'Wireless Earbuds',
        sku: 'SE-EB-001',
        description: 'Premium true wireless earbuds with active noise cancellation, deep bass sound and up to 30 hours total battery life with wireless charging case.',
        category: 'accessories',
        priceKobo: 3000000,
        discountedPriceKobo: 2500000, // ₦25,000
        stock: 54,
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80'],
        rating: 4.5,
        reviewCount: 1200,
        salesCount: 1200,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Sports Shoes',
        sku: 'SE-SH-002',
        description: 'Lightweight breathable sports running shoes engineered with cushioned EVA midsoles and durable rubber outsoles for peak athletic performance.',
        category: 'shoes',
        priceKobo: 5500000,
        discountedPriceKobo: 4500000, // ₦45,000
        stock: 32,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
        rating: 4.6,
        reviewCount: 980,
        salesCount: 980,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Smart Watch',
        sku: 'SE-SW-003',
        description: 'Advanced fitness smartwatch with continuous heart rate monitoring, SpO2 sensor, sleep analytics, AMOLED touch display and 7-day battery life.',
        category: 'accessories',
        priceKobo: 7500000,
        discountedPriceKobo: 6500000, // ₦65,000
        stock: 28,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'],
        rating: 4.7,
        reviewCount: 750,
        salesCount: 750,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Bluetooth Headphones',
        sku: 'SE-HP-004',
        description: 'Over-ear premium wireless headphones featuring high-definition sound drivers, ergonomic memory foam earcups, and crystal clear call microphones.',
        category: 'accessories',
        priceKobo: 4200000,
        discountedPriceKobo: 3500000, // ₦35,000
        stock: 45,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
        rating: 4.5,
        reviewCount: 690,
        salesCount: 690,
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Men's T-Shirt",
        sku: 'SE-TS-005',
        description: 'Classic fit pure combed cotton t-shirt with ribbed crew neck. Soft, breathable, and designed for versatile daily wear and easy layering.',
        category: 'fashion',
        priceKobo: 2200000,
        discountedPriceKobo: 1800000, // ₦18,000
        stock: 80,
        images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80'],
        rating: 4.4,
        reviewCount: 620,
        salesCount: 620,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Laptop',
        sku: 'SE-LP-006',
        description: 'Ultra-thin modern productivity laptop featuring high-resolution 15.6-inch IPS screen, fast 16GB RAM, 512GB NVMe SSD and all-day battery.',
        category: 'electronics',
        priceKobo: 28000000,
        discountedPriceKobo: 25000000, // ₦250,000
        stock: 12,
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80'],
        rating: 4.7,
        reviewCount: 510,
        salesCount: 510,
        isFeatured: true,
        isActive: true,
      },
      {
        name: 'Perfume for Men',
        sku: 'SE-PF-007',
        description: 'Sophisticated eau de parfum with notes of bergamot, cedarwood, and rich ambergris, delivering long-lasting masculine elegance.',
        category: 'beauty',
        priceKobo: 3200000,
        discountedPriceKobo: 2800000, // ₦28,000
        stock: 40,
        images: ['https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&auto=format&fit=crop&q=80'],
        rating: 4.3,
        reviewCount: 430,
        salesCount: 430,
        isFeatured: false,
        isActive: true,
      },
      {
        name: "Women's Handbag",
        sku: 'SE-HB-008',
        description: 'Elegant structured leather handbag with polished gold-tone hardware, multiple interior organizer compartments and detachable shoulder strap.',
        category: 'fashion',
        priceKobo: 3800000,
        discountedPriceKobo: 3200000, // ₦32,000
        stock: 25,
        images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80'],
        rating: 4.5,
        reviewCount: 390,
        salesCount: 390,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Casual Sneakers',
        sku: 'SE-CS-009',
        description: 'Urban street-style low-top sneakers crafted with premium suede accents, flexible rubber cupsole, and antimicrobial insoles.',
        category: 'shoes',
        priceKobo: 4800000,
        discountedPriceKobo: 4000000, // ₦40,000
        stock: 35,
        images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'],
        rating: 4.4,
        reviewCount: 420,
        salesCount: 420,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Beauty Cream',
        sku: 'SE-BC-010',
        description: 'Hydrating revitalizing facial moisturizer infused with hyaluronic acid, niacinamide and botanical botanicals for a natural radiant glow.',
        category: 'beauty',
        priceKobo: 1500000,
        discountedPriceKobo: 1200000, // ₦12,000
        stock: 65,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'],
        rating: 4.6,
        reviewCount: 280,
        salesCount: 280,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Home Blender',
        sku: 'SE-BL-011',
        description: 'High-speed multi-function kitchen countertop blender with 1200W motor, stainless steel blades, and shatterproof glass pitcher.',
        category: 'home',
        priceKobo: 2600000,
        discountedPriceKobo: 2200000, // ₦22,000
        stock: 30,
        images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80'],
        rating: 4.3,
        reviewCount: 310,
        salesCount: 310,
        isFeatured: false,
        isActive: true,
      },
      {
        name: 'Air Fryer',
        sku: 'SE-AF-012',
        description: 'Extra-large 5.5L digital touch air fryer with rapid 360-degree air circulation technology for healthy crisp cooking with 85% less oil.',
        category: 'home',
        priceKobo: 9500000,
        discountedPriceKobo: 8500000, // ₦85,000
        stock: 18,
        images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80'],
        rating: 4.7,
        reviewCount: 270,
        salesCount: 270,
        isFeatured: false,
        isActive: true,
      },
    ];

    const mappedProducts = productsData.map((p: any) => ({
      ...p,
      regularPriceKobo: p.priceKobo || p.regularPriceKobo || 2500000,
      discountedPriceKobo: p.discountedPriceKobo || p.priceKobo || 2500000,
      slug: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${p.sku.toLowerCase()}`,
    }));

    const insertedProducts = await Product.insertMany(mappedProducts);
    console.log(`[Seed] Seeded ${insertedProducts.length} products.`);

    // 5. Customers
    await Customer.deleteMany({});
    const customersData = [
      {
        name: 'Nurudeen Adewale',
        email: 'nurudeen@example.com',
        phone: '+234 801 234 5678',
        password: 'Password@123',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        totalOrders: 8,
        totalSpentKobo: 15600000, // ₦156,000
        isActive: true,
      },
      {
        name: 'Chioma Okafor',
        email: 'chioma@example.com',
        phone: '+234 803 987 6543',
        password: 'Password@123',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        totalOrders: 6,
        totalSpentKobo: 9800000, // ₦98,000
        isActive: true,
      },
      {
        name: 'Emeka Johnson',
        email: 'emeka@example.com',
        phone: '+234 806 111 2233',
        password: 'Password@123',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        totalOrders: 5,
        totalSpentKobo: 7200000, // ₦72,000
        isActive: true,
      },
      {
        name: 'Blessing Adewale',
        email: 'blessing@example.com',
        phone: '+234 807 444 5566',
        password: 'Password@123',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        totalOrders: 4,
        totalSpentKobo: 6500000, // ₦65,000
        isActive: true,
      },
      {
        name: 'Tunde Adebayo',
        email: 'tunde@example.com',
        phone: '+234 809 777 8899',
        password: 'Password@123',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        totalOrders: 3,
        totalSpentKobo: 4800000, // ₦48,000
        isActive: false,
      },
      {
        name: 'Ngozi James',
        email: 'ngozi@example.com',
        phone: '+234 802 333 4455',
        password: 'Password@123',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        totalOrders: 7,
        totalSpentKobo: 12000000, // ₦120,000
        isActive: true,
      },
    ];

    const insertedCustomers = await Customer.insertMany(customersData);
    console.log(`[Seed] Seeded ${insertedCustomers.length} customers.`);

    // 6. Orders
    await Order.deleteMany({});
    const ordersData = [
      {
        orderNumber: 'SE250726001',
        customer: insertedCustomers[1]._id, // Chioma
        items: [
          {
            product: insertedProducts[0]._id,
            name: 'Wireless Earbuds',
            image: insertedProducts[0].images[0],
            priceKobo: 2500000,
            quantity: 1,
            subtotalKobo: 2500000,
          },
          {
            product: insertedProducts[1]._id,
            name: 'Sports Shoes',
            image: insertedProducts[1].images[0],
            priceKobo: 4500000,
            quantity: 1,
            subtotalKobo: 4500000,
          },
        ],
        subtotalKobo: 7000000,
        shippingFeeKobo: 200000,
        taxKobo: 525000,
        discountKobo: 0,
        totalKobo: 8200000, // ₦82,000
        shippingAddress: {
          fullName: 'Chioma Okafor',
          phone: '+234 803 987 6543',
          street: '14 Admiralty Way, Lekki Phase 1',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
        },
        paymentMethod: 'Paystack',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        deliveredAt: new Date(),
        timeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 4 * 86400000), note: 'Order placed' },
          { status: 'Processing', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Packed & ready' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Dispatched with carrier' },
          { status: 'Delivered', timestamp: new Date(Date.now() - 86400000), note: 'Delivered to customer' },
        ],
      },
      {
        orderNumber: 'SE250726002',
        customer: insertedCustomers[2]._id, // Emeka
        items: [
          {
            product: insertedProducts[2]._id,
            name: 'Smart Watch',
            image: insertedProducts[2].images[0],
            priceKobo: 6500000,
            quantity: 1,
            subtotalKobo: 6500000,
          },
        ],
        subtotalKobo: 6500000,
        shippingFeeKobo: 0,
        taxKobo: 0,
        discountKobo: 0,
        totalKobo: 6500000, // ₦65,000
        shippingAddress: {
          fullName: 'Emeka Johnson',
          phone: '+234 806 111 2233',
          street: '22 Isaac John Street, GRA Ikeja',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
        },
        paymentMethod: 'Paystack',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        timeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Order placed' },
          { status: 'Processing', timestamp: new Date(Date.now() - 86400000), note: 'Order in preparation' },
        ],
      },
      {
        orderNumber: 'SE250724003',
        customer: insertedCustomers[3]._id, // Blessing
        items: [
          {
            product: insertedProducts[1]._id,
            name: 'Sports Shoes',
            image: insertedProducts[1].images[0],
            priceKobo: 4500000,
            quantity: 1,
            subtotalKobo: 4500000,
          },
          {
            product: insertedProducts[7]._id,
            name: "Women's Handbag",
            image: insertedProducts[7].images[0],
            priceKobo: 2800000,
            quantity: 1,
            subtotalKobo: 2800000,
          },
        ],
        subtotalKobo: 7300000,
        shippingFeeKobo: 0,
        taxKobo: 0,
        discountKobo: 0,
        totalKobo: 7300000, // ₦73,000
        shippingAddress: {
          fullName: 'Blessing Adewale',
          phone: '+234 807 444 5566',
          street: '5 Victoria Island Boulevard',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
        },
        paymentMethod: 'Paystack',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        trackingNumber: 'TRK-982145',
        timeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Order placed' },
          { status: 'Processing', timestamp: new Date(Date.now() - 2 * 86400000), note: 'Order packed' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 86400000), note: 'In transit with DHL' },
        ],
      },
      {
        orderNumber: 'SE250723004',
        customer: insertedCustomers[4]._id, // Tunde
        items: [
          {
            product: insertedProducts[3]._id,
            name: 'Bluetooth Headphones',
            image: insertedProducts[3].images[0],
            priceKobo: 3500000,
            quantity: 1,
            subtotalKobo: 3500000,
          },
        ],
        subtotalKobo: 3500000,
        shippingFeeKobo: 200000,
        taxKobo: 0,
        discountKobo: 0,
        totalKobo: 4500000, // ₦45,000
        shippingAddress: {
          fullName: 'Tunde Adebayo',
          phone: '+234 809 777 8899',
          street: '10 Allen Avenue',
          city: 'Ikeja',
          state: 'Lagos State',
          country: 'Nigeria',
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        timeline: [
          { status: 'Pending', timestamp: new Date(), note: 'Order placed awaiting confirmation' },
        ],
      },
      {
        orderNumber: 'SE250722005',
        customer: insertedCustomers[5]._id, // Ngozi
        items: [
          {
            product: insertedProducts[5]._id,
            name: 'Laptop',
            image: insertedProducts[5].images[0],
            priceKobo: 25000000,
            quantity: 1,
            subtotalKobo: 25000000,
          },
        ],
        subtotalKobo: 12000000,
        shippingFeeKobo: 0,
        taxKobo: 0,
        discountKobo: 0,
        totalKobo: 12000000, // ₦120,000
        shippingAddress: {
          fullName: 'Ngozi James',
          phone: '+234 802 333 4455',
          street: '8 Banana Island Road, Ikoyi',
          city: 'Lagos',
          state: 'Lagos State',
          country: 'Nigeria',
        },
        paymentMethod: 'Paystack',
        paymentStatus: 'Failed',
        orderStatus: 'Cancelled',
        cancelReason: 'Customer requested cancellation prior to dispatch',
        timeline: [
          { status: 'Pending', timestamp: new Date(Date.now() - 4 * 86400000), note: 'Order placed' },
          { status: 'Cancelled', timestamp: new Date(Date.now() - 3 * 86400000), note: 'Cancelled by customer' },
        ],
      },
    ];

    const mappedOrders = ordersData.map((o: any) => ({
      ...o,
      orderId: o.orderId || o.orderNumber,
      orderNumber: o.orderNumber || o.orderId,
      customerName: o.shippingAddress?.fullName || 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: o.shippingAddress?.phone || '',
      deliveryAddress: typeof o.shippingAddress === 'string'
        ? o.shippingAddress
        : `${o.shippingAddress?.street}, ${o.shippingAddress?.city}`,
    }));

    await Order.insertMany(mappedOrders);
    console.log(`[Seed] Seeded ${mappedOrders.length} orders.`);

    // 7. Promotions
    await Promotion.deleteMany({});
    await Promotion.create({
      code: 'WELCOME10',
      description: '10% discount for first-time shoppers',
      discountType: 'percentage',
      discountValue: 10,
      minimumSpendKobo: 1000000,
      expiresAt: new Date(Date.now() + 60 * 86400000),
      maxUses: 500,
      usedCount: 38,
      isActive: true,
    });

    console.log('[Seed] Database successfully seeded with all initial data!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
