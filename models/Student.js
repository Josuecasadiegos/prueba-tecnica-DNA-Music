import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);