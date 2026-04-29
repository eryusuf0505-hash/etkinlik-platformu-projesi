import { NextResponse } from 'next/server';
import { verifyToken } from '@/shared/middleware/auth.js';
import { UserRepository } from '@/features/auth/User.repository.js';
import Community from '@/features/communities/Community.model.js'; // Ensure Community model is registered

const userRepository = new UserRepository();

export async function GET(req) {
  try {
    const decoded = verifyToken(req);
    const user = await userRepository.findById(decoded.id, ['joinedCommunities']);
    
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Auth Me Error:', error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}
