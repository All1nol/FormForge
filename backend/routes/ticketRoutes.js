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

// Get tickets with pagination
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Ticket.countDocuments({ user: req.user._id });
    const tickets = await Ticket.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      tickets,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets' });
  }
});

export default router;