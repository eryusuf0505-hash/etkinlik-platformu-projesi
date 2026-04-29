import { NextResponse } from 'next/server';
import { verifyToken } from '@/shared/middleware/auth.js';
import { UserRepository } from '@/features/auth/User.repository.js';
import { CommunityRepository } from '@/features/communities/Community.repository.js';

const userRepository = new UserRepository();
const communityRepository = new CommunityRepository();

export async function POST(req) {
  try {
    const decoded = verifyToken(req);
    const { communityId } = await req.json();

    if (!communityId) {
      return NextResponse.json({ error: 'Topluluk ID gerekli.' }, { status: 400 });
    }

    // Find the user
    const user = await userRepository.model.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Find the community
    const community = await communityRepository.model.findById(communityId);
    if (!community) {
      return NextResponse.json({ error: 'Topluluk bulunamadı.' }, { status: 404 });
    }

    // Check if already joined
    if (user.joinedCommunities.includes(communityId)) {
      return NextResponse.json({ message: 'Zaten bu topluluktasınız.' }, { status: 200 });
    }

    // Bi-directional update
    user.joinedCommunities.push(communityId);
    community.members.push(user._id);
    community.memberCount = (community.memberCount || 0) + 1;

    await Promise.all([user.save(), community.save()]);

    return NextResponse.json({ message: 'Topluluğa başarıyla katıldınız.' }, { status: 200 });
  } catch (error) {
    console.error('Join Error:', error);
    const status = error.message.includes('token') || error.message.includes('auth') ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
