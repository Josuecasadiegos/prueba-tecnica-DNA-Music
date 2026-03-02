import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // ej: 'Matemáticas', 'Historia'
});

export default mongoose.models.Subject || mongoose.model('Subject', subjectSchema);