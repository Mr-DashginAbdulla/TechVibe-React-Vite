/**
 * Seed script: Migrate data from db.json to MongoDB
 * Usage: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const User = require("./models/User");
const Product = require("./models/Product");
const Category = require("./models/Category");
const Brand = require("./models/Brand");
const Order = require("./models/Order");
const Review = require("./models/Review");
const PromoCode = require("./models/PromoCode");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Read db.json
    const dbPath = path.join(__dirname, "../../server/db.json");
    const rawData = fs.readFileSync(dbPath, "utf-8");
    const data = JSON.parse(rawData);

    // Clear existing data
    console.log("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Brand.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
      PromoCode.deleteMany({}),
    ]);

    // Seed Users (passwords will be hashed by User model pre-save hook)
    if (data.users && data.users.length > 0) {
      console.log(`Seeding ${data.users.length} users...`);
      for (const user of data.users) {
        await User.create({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password || "defaultPassword123",
          role: user.role || "user",
          phone: user.phone || "",
          isVerified: user.isVerified || false,
          avatar: user.avatar || "",
          memberSince: user.createdAt || new Date().toISOString(),
        });
      }
      console.log("Users seeded successfully");
    }

    // Seed Categories
    if (data.categories && data.categories.length > 0) {
      console.log(`Seeding ${data.categories.length} categories...`);
      await Category.insertMany(
        data.categories.map((c) => ({
          _id: c.id,
          name: c.name,
          image: c.image || "",
          parentId: c.parentId || null,
        }))
      );
      console.log("Categories seeded successfully");
    }

    // Seed Products
    if (data.products && data.products.length > 0) {
      console.log(`Seeding ${data.products.length} products...`);
      await Product.insertMany(
        data.products.map((p) => ({
          _id: p.id,
          name: p.name,
          price: p.price,
          category: p.category,
          brand: p.brand,
          stock: p.stock || 0,
          isFeatured: p.isFeatured || false,
          isNewProduct: p.isNew || false,
          description: p.description || "",
          image: p.image || "",
          images: p.images || [],
          specs: p.specs || {},
          colorOptions: p.colorOptions || [],
          memoryOptions: p.memoryOptions || [],
          rating: p.rating || 0,
          reviewsCount: p.reviewsCount || 0,
          discount: p.discount || 0,
          categoryId: p.categoryId || p.category || "",
        }))
      );
      console.log("Products seeded successfully");
    }

    // Seed Brands
    if (data.brands && data.brands.length > 0) {
      console.log(`Seeding ${data.brands.length} brands...`);
      await Brand.insertMany(
        data.brands.map((b) => ({
          _id: b.id,
          name: b.name,
          logo: b.logo || { light: "", dark: "" },
          website: b.website || "",
          isActive: b.isActive !== undefined ? b.isActive : true,
        }))
      );
      console.log("Brands seeded successfully");
    }

    // Seed Reviews
    if (data.reviews && data.reviews.length > 0) {
      console.log(`Seeding ${data.reviews.length} reviews...`);
      // Insert in batches to avoid memory issues
      const batchSize = 100;
      for (let i = 0; i < data.reviews.length; i += batchSize) {
        const batch = data.reviews.slice(i, i + batchSize);
        await Review.insertMany(
          batch.map((r) => ({
            productId: r.productId,
            userId: r.userId || "",
            userName: r.userName,
            rating: r.rating,
            comment: r.comment || "",
            date: r.date || new Date().toISOString().split("T")[0],
            helpful: r.helpful || 0,
          }))
        );
      }
      console.log("Reviews seeded successfully");
    }

    // Seed Promo Codes
    if (data.promoCodes && data.promoCodes.length > 0) {
      console.log(`Seeding ${data.promoCodes.length} promo codes...`);
      await PromoCode.insertMany(
        data.promoCodes.map((p) => ({
          code: p.code,
          type: p.type,
          discount: p.discount,
          minOrder: p.minOrder || 0,
          maxUses: p.maxUses || null,
          usedCount: p.usedCount || 0,
          isActive: p.isActive !== undefined ? p.isActive : true,
          expiresAt: p.expiresAt || null,
          description: p.description || "",
        }))
      );
      console.log("Promo codes seeded successfully");
    }

    console.log("\n✅ All data seeded successfully!");
    console.log("\n📋 Summary:");
    console.log(`   Users: ${data.users?.length || 0}`);
    console.log(`   Categories: ${data.categories?.length || 0}`);
    console.log(`   Products: ${data.products?.length || 0}`);
    console.log(`   Brands: ${data.brands?.length || 0}`);
    console.log(`   Reviews: ${data.reviews?.length || 0}`);
    console.log(`   Promo Codes: ${data.promoCodes?.length || 0}`);

    console.log("\n🔑 Test Accounts:");
    console.log("   Super Admin: superadmin@techvibe.com / superadmin123");
    console.log("   Admin: admin@techvibe.com / (check db.json)");
    console.log("   User: example@example.com / Qwerty123@");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
