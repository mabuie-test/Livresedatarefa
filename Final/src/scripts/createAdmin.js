// usage: node src/scripts/createAdmin.js admin@example.com StrongPassword
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();
const MONGO = process.env.MONGO_URI;
if (!MONGO) { console.error('Define MONGO_URI'); process.exit(1); }

async function run(email, password) {
  await mongoose.connect(MONGO);
  const hashed = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });
  if (existing) {
    existing.password = hashed;
    existing.role = 'admin';
    await existing.save();
    console.log('Updated existing user to admin:', email);
  } else {
    const u = new User({ name: 'Admin', email, password: hashed, role: 'admin' });
    await u.save();
    console.log('Created admin:', email);
  }
  process.exit(0);
}

const [,, email, password] = process.argv;
if (!email || !password) { console.error('Usage: node createAdmin.js email password'); process.exit(1); }
run(email, password).catch(e => { console.error(e); process.exit(1); });
