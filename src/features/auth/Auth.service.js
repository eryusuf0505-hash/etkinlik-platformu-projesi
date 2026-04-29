import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  constructor(userManager) {
    this.userManager = userManager;
  }

  async register(userData) {
    await this.userManager.validateUniqueEmail(userData.email);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = await this.userManager.create({
      ...userData,
      password: hashedPassword
    });

    return this.generateToken(newUser);
  }

  async login(email, password) {
    const user = await this.userManager.repository.findByEmail(email);
    if (!user) {
      throw new Error('E-posta veya şifre hatalı.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('E-posta veya şifre hatalı.');
    }

    return this.generateToken(user);
  }

  generateToken(user) {
    const payload = {
      id: user._id.toString(),
      role: user.role
    };

    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'gizli_anahtar';
    const token = jwt.sign(payload, secret, {
      expiresIn: '7d'
    });

    return {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }
}
