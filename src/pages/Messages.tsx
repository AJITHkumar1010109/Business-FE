const messages = [
  { from: 'Alice Johnson', subject: 'Order inquiry', preview: 'Hi, I wanted to ask about my recent order...', time: '10:32 AM', unread: true },
  { from: 'Bob Smith', subject: 'Return request', preview: 'I would like to return the item I purchased...', time: '9:15 AM', unread: true },
  { from: 'Carol White', subject: 'Feedback', preview: 'Just wanted to say the product was amazing!', time: 'Yesterday', unread: false },
  { from: 'David Lee', subject: 'Shipping delay', preview: 'My package has not arrived yet, it has been...', time: 'Yesterday', unread: false },
  { from: 'Eva Martinez', subject: 'Bulk order quote', preview: 'We are interested in placing a bulk order...', time: 'Mon', unread: false },
]

export default function Messages() {
  return (
    <>
      <div className="page-header">
        <h1>Messages</h1>
        <p>Your customer inbox</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Inbox</h2>
          <span className="badge-status processing">{messages.filter(m => m.unread).length} unread</span>
        </div>
        <ul className="message-list">
          {messages.map(m => (
            <li key={m.subject} className={`message-item ${m.unread ? 'unread' : ''}`}>
              <div className="avatar sm">{m.from[0]}</div>
              <div className="message-body">
                <div className="message-top">
                  <span className="message-from">{m.from}</span>
                  <span className="message-time">{m.time}</span>
                </div>
                <div className="message-subject">{m.subject}</div>
                <div className="message-preview">{m.preview}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
