import { NextResponse } from 'next/server';
import { EventRepository } from '../../../../features/events/Event.repository.js';
import { EventManager } from '../../../../features/events/Event.manager.js';
import { verifyToken } from '../../../../shared/middleware/auth.js';

const eventRepository = new EventRepository();
const eventManager = new EventManager(eventRepository);

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const event = await eventManager.getById(id, ['category', 'organizer', 'community']);
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    const body = await req.json();
    
    const updatedEvent = await eventManager.updateEvent(id, body, user.id, user.role);
    return NextResponse.json(updatedEvent);
  } catch (error) {
    const status = error.message.includes('yetkiniz') ? 403 : (error.message.includes('Yetkilendirme') ? 401 : 400);
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = verifyToken(req);
    const { id } = await params;
    
    // Only organizer or admin can delete
    const event = await eventManager.getById(id);
    if (event.organizer.toString() !== user.id && user.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlemi yapmaya yetkiniz yok.' }, { status: 403 });
    }

    await eventManager.delete(id);
    return NextResponse.json({ message: 'Etkinlik başarıyla silindi.' });
  } catch (error) {
    const status = error.message.includes('Yetkilendirme') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
