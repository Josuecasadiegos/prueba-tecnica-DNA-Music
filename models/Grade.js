import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  grade: { type: Number, required: true, min: 0, max: 100 }, // ej: 85
  comments: { type: String },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Grade || mongoose.model('Grade', gradeSchema);