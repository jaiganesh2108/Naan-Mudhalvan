import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

function SymptomAnalyzer() {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/symptom/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ diagnosis: 'Error', recommendation: 'Unable to analyze symptoms' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2><i className="fas fa-stethoscope"></i> {t('symptom_analyzer_title')}</h2>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          placeholder={t('enter_symptoms_placeholder')}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && analyzeSymptoms()}
        />
        <button
          onClick={analyzeSymptoms}
          className="btn-primary"
          disabled={loading || !symptoms.trim()}
        >
          {t('analyze')}
        </button>
      </div>
      {loading && <div className="spinner"></div>}
      {result && (
        <div className="camera-result">
          <p><strong>{t('diagnosis')}:</strong> {result.diagnosis}</p>
          <p><strong>{t('recommendation')}:</strong> {result.recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default SymptomAnalyzer;