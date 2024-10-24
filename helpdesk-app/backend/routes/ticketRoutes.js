const express = require('express')
const Ticket = require('../models/Ticket')
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware')

const router = express.Router()

// Create a new ticket (for customers)
router.post('/', authMiddleware, async (req, res) => {
  const {title} = req.body

  try {
    const newTicket = new Ticket({
      title,
      customer: req.user.id, // Authenticated user is the customer
      lastUpdatedOn: Date.now(),
    })

    await newTicket.save()
    res.status(201).json(newTicket)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// View all tickets (for agents and admins)
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['agent', 'admin']),
  async (req, res) => {
    try {
      const tickets = await Ticket.find().populate('customer', 'name email')
      res.json(tickets)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
)

// View a single ticket by its ID (accessible to all roles)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate(
      'customer',
      'name email',
    )
    if (!ticket) return res.status(404).json({message: 'Ticket not found'})

    res.json(ticket)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Add a note to a ticket (for customers, agents, and admins)
router.post('/:id/notes', authMiddleware, async (req, res) => {
  const {content} = req.body

  try {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) return res.status(404).json({message: 'Ticket not found'})

    const note = {
      addedBy: req.user.id, // Who added the note (customer, agent, or admin)
      content,
      timestamp: Date.now(),
    }

    ticket.notes.push(note)
    ticket.lastUpdatedOn = Date.now() // Update "Last Updated On" field
    await ticket.save()

    res.json(ticket)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

// Update ticket status (for agents and admins)
router.put(
  '/:id/status',
  authMiddleware,
  roleMiddleware(['agent', 'admin']),
  async (req, res) => {
    const {status} = req.body

    try {
      const ticket = await Ticket.findById(req.params.id)
      if (!ticket) return res.status(404).json({message: 'Ticket not found'})

      ticket.status = status
      ticket.lastUpdatedOn = Date.now() // Update "Last Updated On" field
      await ticket.save()

      res.json(ticket)
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
)

// Delete a ticket (for admins only)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id)
      if (!ticket) return res.status(404).json({message: 'Ticket not found'})

      await ticket.remove()
      res.json({message: 'Ticket removed'})
    } catch (error) {
      res.status(500).json({message: error.message})
    }
  },
)

module.exports = router
