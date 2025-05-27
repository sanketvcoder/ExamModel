import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    immutable: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: String, // or Number if you want to store as numeric years
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String }
  },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String }
  }
}, { timestamps: true });

const teacherModel = mongoose.models.teacherProfile || mongoose.model('teacherProfile', teacherSchema);
export default teacherModel;
