import mongoose from 'mongoose';
import { baseSchemaFields, baseSchemaOptions } from '../../base/BaseModel.js';

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Topluluk adı zorunludur.'],
    unique: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    index: true
  },
  icon: {
    type: String,
    default: '👥'
  },
  memberCount: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  ...baseSchemaFields
}, {
  ...baseSchemaOptions
});

const Community = mongoose.models.Community || mongoose.model('Community', communitySchema);
export default Community;
