import mongoose from 'mongoose';
import { baseSchemaFields, baseSchemaOptions } from '../../base/BaseModel.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'İsim alanı zorunludur.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'E-posta alanı zorunludur.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Lütfen geçerli bir e-posta adresi giriniz.']
  },
  password: {
    type: String,
    required: [true, 'Şifre alanı zorunludur.'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  city: {
    type: String,
    trim: true
  },
  bio: String,
  profileImage: String,
  resetOtp: String,
  resetOtpExpiry: Date,
  joinedCommunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }],
  ...baseSchemaFields
}, {
  ...baseSchemaOptions
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
