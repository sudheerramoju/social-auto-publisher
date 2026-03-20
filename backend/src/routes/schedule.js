const express = require('express');
const router = express.Router();

// Placeholder for scheduling
router.get('/', (req, res) => {
  res.json({ scheduled: [] });
});

module.exports = router;
