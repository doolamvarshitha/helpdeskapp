// src/pages/TicketDetailPage.js

import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'

const TicketDetailPage = () => {
  const {id} = useParams() // Get ticket ID from URL
  const [ticket, setTicket] = useState(null)

  useEffect(() => {
    const fetchTicketDetails = async () => {
      const response = await fetch(`/api/tickets/${id}`)
      const data = await response.json()
      setTicket(data)
    }

    fetchTicketDetails()
  }, [id])

  if (!ticket) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>Ticket Details</h2>
      <p>
        <strong>Title:</strong> {ticket.title}
      </p>
      <p>
        <strong>Status:</strong> {ticket.status}
      </p>
      <p>
        <strong>Customer:</strong> {ticket.customer?.name}
      </p>
      <p>
        <strong>Last Updated On:</strong>{' '}
        {new Date(ticket.lastUpdatedOn).toLocaleString()}
      </p>

      <h3>Notes</h3>
      <ul>
        {ticket.notes.map((note, index) => (
          <li key={index}>
            <p>
              <strong>{note.addedBy}:</strong> {note.content}
            </p>
            <p>{new Date(note.timestamp).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TicketDetailPage
