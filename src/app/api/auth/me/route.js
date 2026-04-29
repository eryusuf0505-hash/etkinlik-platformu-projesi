import { NextResponse } from 'next/server';
import { verifyToken } from '@/shared/middleware/auth.js';
import { UserRepository } from '@/features/auth/User.repository.js';
import Participant from '@/features/events/Participant.model.js';

const userRepository = new UserRepository();

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    const user = await userRepository.findById(decoded.id, ['joinedCommunities']);
    
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Calculate stats
    const eventCount = await Participant.countDocuments({ user: user._id, status: 'joined' });
    const communityCount = user.joinedCommunities?.length || 0;

    const userData = user.toObject();
    userData.stats = {
      eventCount,
      communityCount,
      ticketCount: eventCount, // For now they are same
      favoriteCount: 0 // Placeholder
    };
    
    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error('Auth Me Error:', error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
