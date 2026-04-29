import { NextResponse } from 'next/server';
import { UserRepository } from '../../../../features/auth/User.repository.js';
import { UserManager } from '../../../../features/auth/User.manager.js';
import { AuthService } from '../../../../features/auth/Auth.service.js';

const userRepository = new UserRepository();
const userManager = new UserManager(userRepository);
const authService = new AuthService(userManager);

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const result = await authService.login(email, password);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
