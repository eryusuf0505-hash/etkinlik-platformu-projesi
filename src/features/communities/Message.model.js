import mongoose from 'mongoose';
import { baseSchemaFields, baseSchemaOptions } from '../../base/BaseModel.js';

const messageSchema = new mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Mesaj metni zorunludur.']
  },
  ...baseSchemaFields
}, {
  ...baseSchemaOptions
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
