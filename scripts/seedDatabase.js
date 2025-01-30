const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sampleRecipes = require('./sampleRecipes');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Recipe.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword
    });

    // Add recipes with admin user as author
    const recipesWithAuthor = sampleRecipes.map(recipe => ({
      ...recipe,
      author: adminUser._id
    }));

    await Recipe.insertMany(recipesWithAuthor);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
