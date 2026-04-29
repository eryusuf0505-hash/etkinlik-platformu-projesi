import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { MessageRepository } from '@/features/communities/Message.repository.js';
import { MessageManager } from '@/features/communities/Message.manager.js';
import { verifyToken } from '@/shared/middleware/auth.js';
import User from '@/features/auth/User.model.js'; // Register User model for population
import Community from '@/features/communities/Community.model.js'; // Register Community model

const messageRepository = new MessageRepository();
const messageManager = new MessageManager(messageRepository);

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    
    // Find community to get its real ID if name was passed
    let community = await Community.findOne({ 
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : new mongoose.Types.ObjectId() },
        { name: id }
      ]
    });

    if (!community) {
      return NextResponse.json({ error: 'Topluluk bulunamadı' }, { status: 404 });
    }

    const messages = await messageManager.getMessagesByCommunity(community._id);
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req, { params }) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    const body = await req.json();

    if (!body.text) {
        return NextResponse.json({ error: 'Mesaj metni zorunludur' }, { status: 400 });
    }

    // Resolve community
    let community = await Community.findOne({ 
      $or: [
        { _id: mongoose.isValidObjectId(id) ? id : new mongoose.Types.ObjectId() },
        { name: id }
      ]
    });

    if (!community) {
      return NextResponse.json({ error: 'Topluluk bulunamadı' }, { status: 404 });
    }

    const newMessage = await messageManager.createMessage({ text: body.text, community: community._id }, user.id);
    
    // We should probably populate the user info before returning
    const populatedMessage = await messageRepository.model.findById(newMessage._id).populate('user', 'name profileImage role');

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch (error) {
    const status = error.message.includes('Yetkilendirme') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
