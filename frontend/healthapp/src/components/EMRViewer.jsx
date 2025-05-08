import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

function EMRViewer() {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('123'); // Mock user ID
  const [emr, setEmr] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchEmr = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/emr/get`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setEmr(data);
    } catch (error) {
      setEmr({ error: 'Unable to retrieve EMR' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2><i className="fas fa-file-medical"></i> {t('emr_viewer_title')}</h2>
      <button onClick={fetchEmr} className="btn-primary" disabled={loading}>
        {t('view_emr')}
      </button>
      {loading && <div className="spinner"></div>}
      {emr && (
        <div className="camera-result">
          {emr.error ? (
            <p>{emr.error}</p>
          ) : (
            <>
              <p><strong>{t('name')}:</strong> {emr.name}</p>
              <p><strong>{t('age')}:</strong> {emr.age}</p>
              <p><strong>{t('last_visit')}:</strong> {emr.lastVisit}</p>
              <p><strong>{t('allergies')}:</strong> {emr.allergies.join(', ')}</p>
              <p><strong>{t('medical_history')}:</strong></p>
              <ul>
                {emr.medicalHistory.map((record, index) => (
                  <li key={index}>
                    {record.date}: {record.diagnosis} - {record.treatment}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EMRViewer;