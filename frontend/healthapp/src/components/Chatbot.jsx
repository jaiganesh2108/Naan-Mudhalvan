import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

function Chatbot() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user', timestamp: new Date().toLocaleTimeString() };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await response.json();
      const botMessage = {
        text: data.response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: 'Error: Unable to get a response',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div>
      <h2><i className="fas fa-robot"></i> {t('chatbot_title')}</h2>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <img
              src={msg.sender === 'user' ? '/user-avatar.png' : '/bot-avatar.png'}
              alt={`${msg.sender} avatar`}
              className="avatar"
            />
            <div className="message-content">
              <p>{msg.text}</p>
              <div className="timestamp">{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="spinner"></div>}
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder={t('chatbot_placeholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          className="btn-primary"
          disabled={loading || !input.trim()}
        >
          <i className="fas fa-paper-plane"></i> {t('send')}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;