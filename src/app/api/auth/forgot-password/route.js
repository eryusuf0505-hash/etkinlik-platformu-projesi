import { NextResponse } from 'next/server';
import { UserRepository } from '../../../../features/auth/User.repository.js';
import { UserManager } from '../../../../features/auth/User.manager.js';

const userRepository = new UserRepository();
const userManager = new UserManager(userRepository);

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    const user = await userManager.findByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Bu e-posta adresi ile kayıtlı bir kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await userRepository.update(user._id, {
      resetOtp: otp,
      resetOtpExpiry: expiry
    });

    console.log(`[DEMO OTP] E-posta: ${email}, Kod: ${otp}`);

    return NextResponse.json({ 
      message: 'Şifre sıfırlama kodu oluşturuldu.',
      mockOtp: otp 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
