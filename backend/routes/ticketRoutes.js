import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import createJiraTicket from '../services/jiraService.js';
import Ticket from '../models/Ticket.js'; 

const router = express.Router();

router.post('/create', protect, async (req, res) => {
  const { summary, priority, templateTitle } = req.body;
  const userEmail = req.user.email;
  const link = req.headers.referer || '';

  try {
    console.log('Creating ticket with:', { summary, priority, templateTitle, userEmail, link });

    const jiraTicket = await createJiraTicket(summary, priority, templateTitle, userEmail, link);
    
    if (!jiraTicket) {
      throw new Error('Failed to create Jira ticket - no response data');
    }

    const ticket = new Ticket({
      user: req.user._id,
      summary,
      priority,
      templateTitle,
      link,
      status: 'Open'
    });

    await ticket.save();
    
    res.status(201).json({ 
      message: 'Ticket created successfully', 
      key: jiraTicket.key,
      ticket 
    });
  } catch (error) {
    console.error('Ticket creation error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Error creating ticket', 
      error: error.response?.data?.message || error.message
    });
  }
});

export default router;