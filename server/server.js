import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const { MONGO_URI, JWT_SECRET, PORT = 5000 } = process.env;

if (!MONGO_URI || !JWT_SECRET) {
  console.error('Missing MONGO_URI or JWT_SECRET. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} catch (error) {
  console.error('Could not connect to MongoDB:', error.message);
  process.exit(1);
}
