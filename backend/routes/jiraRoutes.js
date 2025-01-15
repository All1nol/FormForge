const express = require('express');
const router = express.Router();
const { createJiraTicket } = require('../services/jiraService');

router.post('/create-ticket', async (req, res) => {
  try {
    const { summary, description } = req.body;
    const ticket = await createJiraTicket(summary, description);
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;