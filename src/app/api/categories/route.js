import { NextResponse } from 'next/server';
import { CategoryRepository } from '../../../features/categories/Category.repository.js';
import { CategoryManager } from '../../../features/categories/Category.manager.js';
import { verifyToken, authorizeRole } from '../../../shared/middleware/auth.js';

const categoryRepository = new CategoryRepository();
const categoryManager = new CategoryManager(categoryRepository);

export async function GET() {
  try {
    const result = await categoryRepository.findMany({}, { sort: { name: 1 }, limit: 100 });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const user = verifyToken(req);
    authorizeRole(user, ['admin']);
    
    const body = await req.json();
    const newCategory = await categoryManager.createCategory(body, user.role);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    const status = error.message.includes('yetkiniz') ? 403 : (error.message.includes('Yetkilendirme') ? 401 : 400);
    return NextResponse.json({ error: error.message }, { status });
  }
}
