import { NextResponse } from 'next/server';
import { UserRepository } from '../../../../features/auth/User.repository.js';
import { UserManager } from '../../../../features/auth/User.manager.js';
import bcrypt from 'bcryptjs';

const userRepository = new UserRepository();
const userManager = new UserManager(userRepository);

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();
    
    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Tüm alanları doldurun.' }, { status: 400 });
    }

    const user = await userManager.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Geçersiz doğrulama kodu veya e-posta.' }, { status: 400 });
    }

    if (user.resetOtp !== otp || new Date() > new Date(user.resetOtpExpiry)) {
      return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş doğrulama kodu.' }, { status: 400 });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userRepository.update(user._id, {
      password: hashedPassword,
      resetOtp: null,
      resetOtpExpiry: null
    });

    return NextResponse.json({ message: 'Şifreniz başarıyla güncellendi.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
