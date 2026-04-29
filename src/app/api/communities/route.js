import { NextResponse } from 'next/server';
import { CommunityRepository } from '@/features/communities/Community.repository.js';
import { CommunityManager } from '@/features/communities/Community.manager.js';
import { verifyToken } from '@/shared/middleware/auth.js';

const communityRepository = new CommunityRepository();
const communityManager = new CommunityManager(communityRepository);

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const filters = {};
    
    if (searchParams.get('category')) filters.category = searchParams.get('category');
    if (searchParams.get('search')) filters.name = { $regex: searchParams.get('search'), $options: 'i' };

    const result = await communityRepository.findMany(filters);
    return NextResponse.json(result.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const user = verifyToken(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Sadece yetkili hesaplar topluluk oluşturabilir.' }, { status: 403 });
    }

    const body = await req.json();
    const newCommunity = await communityManager.createCommunity(body, user.id);
    return NextResponse.json(newCommunity, { status: 201 });
  } catch (error) {
    const status = error.message.includes('Yetkilendirme') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
