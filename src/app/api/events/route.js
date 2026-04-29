import { NextResponse } from 'next/server';
import { EventRepository } from '@/features/events/Event.repository.js';
import { EventManager } from '@/features/events/Event.manager.js';
import { verifyToken } from '@/shared/middleware/auth.js';

const eventRepository = new EventRepository();
const eventManager = new EventManager(eventRepository);

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    const filters = {};
    
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    let sort = { date: 1 };
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      try {
        sort = JSON.parse(sortParam);
      } catch (e) {
        sort = { [sortParam]: 1 };
      }
    }

    const options = { page, limit, sort };

    if (searchParams.get('category')) filters.category = searchParams.get('category');
    if (searchParams.get('city')) filters.city = searchParams.get('city');
    if (searchParams.get('startDate')) filters.startDate = searchParams.get('startDate');
    if (searchParams.get('endDate')) filters.endDate = searchParams.get('endDate');

    const result = await eventRepository.findWithFilters(filters, options);
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET Events Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const user = verifyToken(req);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Sadece yetkili hesaplar etkinlik oluşturabilir.' }, { status: 403 });
    }
    const body = await req.json();
    
    const newEvent = await eventManager.createEvent(body, user.id);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    const status = error.message.includes('Yetkilendirme') ? 401 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}