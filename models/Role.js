import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ej: 'admin', 'teacher'
});

export default mongoose.models.Role || mongoose.model('Role', roleSchema);