const express = require('express');
const router = express.Router();

// Placeholder for platform connection management
router.get('/', (req, res) => {
  res.json({ platforms: [] });
});

module.exports = router;
