import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  silindi_mi: { type: Boolean, default: false }
}, { timestamps: true });

export const EventModel = mongoose.models.Event || mongoose.model('Event', eventSchema);