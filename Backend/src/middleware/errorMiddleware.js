export const errorMiddleware = (err, req, res, next) => {
  console.error('[Error Middleware Catch]:', err.stack || err.message);
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};
