import { NextResponse } from 'next/server';
import { UserRepository } from '../../../../features/auth/User.repository.js';
import { UserManager } from '../../../../features/auth/User.manager.js';
import { AuthService } from '../../../../features/auth/Auth.service.js';

const userRepository = new UserRepository();
const userManager = new UserManager(userRepository);
const authService = new AuthService(userManager);

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await authService.register(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
