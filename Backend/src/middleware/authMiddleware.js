import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'apnakissan_secret_key_123';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ status: 'error', message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { _id: decoded.id, role: 'farmer' };
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]', error.message);
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or expired token.' });
  }
};
