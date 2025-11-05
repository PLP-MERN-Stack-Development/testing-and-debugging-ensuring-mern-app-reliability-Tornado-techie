// Server test setup
const mongoose = require('mongoose');

// Global test setup
beforeAll(async () => {
  // Any global server test setup can go here
});

afterAll(async () => {
  // Clean up after all tests
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clean up after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
