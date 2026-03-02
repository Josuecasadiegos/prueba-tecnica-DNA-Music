import 'dotenv/config';
import { connectToDB } from '../lib/db.js';               // ← relativo desde scripts/
import User from '../models/User.js';                     // ← relativo
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';

async function setupAdmin() {
  try {
    await connectToDB();
    console.log('Conexión establecida');

    let adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      console.log('Creando rol "admin"...');
      adminRole = new Role({ name: 'admin' });
      await adminRole.save();
      console.log('Rol creado →', adminRole._id);
    }

    const existing = await User.findOne({ username: 'admin' });
    if (existing) {
      console.log('Admin ya existe');
      process.exit(0);
    }

    const password = 'Admin123!2025';
    const hashed = await bcrypt.hash(password, 10);

    const admin = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: hashed,
      role: adminRole._id,
      isVerified: true,
    });

    await admin.save();

    console.log('\nAdmin creado OK');
    console.log('user: admin');
    console.log('pass: ' + password);
    console.log('email: admin@example.com');

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

setupAdmin();