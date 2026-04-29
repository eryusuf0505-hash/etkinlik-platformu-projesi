import mongoose from 'mongoose';
import { baseSchemaFields, baseSchemaOptions } from '../../base/BaseModel.js';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Başlık zorunludur.'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Açıklama zorunludur.']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori zorunludur.']
  },
  city: {
    type: String,
    required: [true, 'Şehir zorunludur.']
  },
  address: String,
  date: {
    type: Date,
    required: [true, 'Tarih zorunludur.']
  },
  imageUrl: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  },
  capacity: Number,
  price: {
    type: Number,
    default: 0
  },
  bankAccount: {
    type: String,
    trim: true
  },
  ...baseSchemaFields
}, {
  ...baseSchemaOptions
});

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
