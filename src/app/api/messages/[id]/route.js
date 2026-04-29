import { NextResponse } from 'next/server';
import { MessageRepository } from '@/features/communities/Message.repository.js';
import { verifyToken } from '@/shared/middleware/auth.js';

const messageRepository = new MessageRepository();

export async function DELETE(req, { params }) {
  try {
    const user = verifyToken(req);
    const { id: messageId } = await params;

    const message = await messageRepository.findById(messageId);
    if (!message) {
      return NextResponse.json({ error: 'Mesaj bulunamadı.' }, { status: 404 });
    }

    // Only admin or the message owner can delete
    if (user.role !== 'admin' && message.user.toString() !== user.id) {
      return NextResponse.json({ error: 'Bu mesajı silme yetkiniz yok.' }, { status: 403 });
    }

    await messageRepository.delete(messageId);
    return NextResponse.json({ message: 'Mesaj başarıyla silindi.' }, { status: 200 });
  } catch (error) {
    const status = error.message.includes('Yetkilendirme') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
