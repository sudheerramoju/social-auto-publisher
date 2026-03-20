const express = require('express');
const router = express.Router();

// Placeholder for analytics
router.get('/', (req, res) => {
  res.json({ analytics: {} });
});

module.exports = router;
