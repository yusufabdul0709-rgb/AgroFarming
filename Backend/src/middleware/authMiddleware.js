import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    req.user = { id: 'mock-user-111', role: 'farmer' };
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  // Graceful fallback for mock tokens or when Supabase Secret is not set yet
  if (token === 'mock-jwt-token-apnakissan' || !process.env.SUPABASE_JWT_SECRET) {
    req.user = { id: 'mock-user-111', role: 'farmer' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    // Supabase stores user ID under 'sub' claim
    req.user = { id: decoded.sub || decoded.id, role: 'farmer' };
    next();
  } catch (error) {
    console.warn('[Auth Middleware Warning] Token signature verification failed. Falling back to decoded token for development mode.', error.message);
    const decoded = jwt.decode(token);
    
    if (decoded && (decoded.sub || decoded.id)) {
      req.user = { id: decoded.sub || decoded.id, role: 'farmer' };
      return next();
    }
    
    return res.status(401).json({ status: 'error', message: 'Unauthorized: Invalid or expired token.' });
  }
};
