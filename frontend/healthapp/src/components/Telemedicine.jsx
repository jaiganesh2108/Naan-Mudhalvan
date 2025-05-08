import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

function Telemedicine() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('123'); // Mock user ID
  const [preferredTime, setPreferredTime] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const initiateSession = async () => {
    if (!preferredTime.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/telemedicine/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferredTime }),
      });
      const data = await response.json();
      setSession(data);
    } catch (error) {
      setSession({ error: 'Unable to initiate session' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2><i className="fas fa-video"></i> {t('telemedicine_title')}</h2>
      <div className="chat-input-container">
        <input
          type="datetime-local"
          className="chat-input"
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
        />
        <button
          onClick={initiateSession}
          className="btn-primary"
          disabled={loading || !preferredTime.trim()}
        >
          {t('schedule_session')}
        </button>
      </div>
      {loading && <div className="spinner"></div>}
      {session && (
        <div className="camera-result">
          {session.error ? (
            <p>{session.error}</p>
          ) : (
            <>
              <p><strong>{t('session_id')}:</strong> {session.sessionId}</p>
              <p><strong>{t('meeting_link')}:</strong> <a href={session.meetingLink} target="_blank">{session.meetingLink}</a></p>
              <p><strong>{t('scheduled_time')}:</strong> {session.scheduledTime}</p>
              <p><strong>{t('doctor')}:</strong> {session.doctor}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Telemedicine;