import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Yetkilendirme hatası: Token bulunamadı.');
    error.status = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'gizli_anahtar';
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    const authError = new Error('Yetkilendirme hatası: Geçersiz veya süresi dolmuş token.');
    authError.status = 401;
    throw authError;
  }
}

export function authorizeRole(user, allowedRoles) {
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Bu işlem için yetkiniz bulunmamaktadır.');
  }
}
