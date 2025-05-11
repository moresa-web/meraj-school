import express from 'express';

const router = express.Router();

// Get user's IP address
router.get('/ip', (req, res) => {
  const userIP = req.ip || req.socket.remoteAddress || '';
  res.json(userIP);
});

export default router; 