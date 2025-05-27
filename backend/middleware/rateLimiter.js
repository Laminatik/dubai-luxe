const rateLimit = require('express-rate-limit');

const reservationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many reservation requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = reservationLimiter;