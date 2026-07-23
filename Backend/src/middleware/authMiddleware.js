export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    // Graceful offline fallback bypass
    req.user = { id: 'mock-user-111', role: 'farmer' };
    return next();
  }

  // Token validation stub
  req.user = { id: 'mock-user-111', role: 'farmer' };
  next();
};
