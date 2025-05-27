import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    immutable: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  section: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date, // Date field to store date of birth
    required: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  yearOfStudy: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
  },
  socialLinks: {
    linkedin: {
      type: String,
      required: true,
    },
    github: {
      type: String,
      required: true,
    },
  },
}, { timestamps: true });

const studentProfileModel = mongoose.models.studentProfile || mongoose.model('studentProfile', studentProfileSchema);
export default studentProfileModel;
