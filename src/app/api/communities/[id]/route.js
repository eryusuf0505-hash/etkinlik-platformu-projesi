import { NextResponse } from 'next/server';
import { CommunityRepository } from '@/features/communities/Community.repository.js';
import { verifyToken } from '@/shared/middleware/auth.js';

const communityRepository = new CommunityRepository();

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const community = await communityRepository.findById(id);
    if (!community) {
      return NextResponse.json({ error: 'Topluluk bulunamadı.' }, { status: 404 });
    }
    return NextResponse.json(community, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    const body = await req.json();

    const community = await communityRepository.findById(id);
    if (!community) {
      return NextResponse.json({ error: 'Topluluk bulunamadı.' }, { status: 404 });
    }

    // Only owner or admin can update
    if (community.owner.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlemi yapmaya yetkiniz yok.' }, { status: 403 });
    }

    const updated = await communityRepository.update(id, body);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    const status = error.message.includes('Yetkilendirme') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = verifyToken(req);
    const { id } = await params;

    const community = await communityRepository.findById(id);
    if (!community) {
      return NextResponse.json({ error: 'Topluluk bulunamadı.' }, { status: 404 });
    }

    // Only owner or admin can delete
    if (community.owner.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlemi yapmaya yetkiniz yok.' }, { status: 403 });
    }

    await communityRepository.delete(id);
    return NextResponse.json({ message: 'Topluluk başarıyla silindi.' }, { status: 200 });
  } catch (error) {
    const status = error.message.includes('Yetkilendirme') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}

