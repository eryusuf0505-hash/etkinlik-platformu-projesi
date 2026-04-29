import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['joined', 'cancelled', 'pending'],
    default: 'joined'
  }
}, {
  timestamps: true
});

// Ensure a user can join an event only once
participantSchema.index({ event: 1, user: 1 }, { unique: true });

const Participant = mongoose.models.Participant || mongoose.model('Participant', participantSchema);
export default Participant;
