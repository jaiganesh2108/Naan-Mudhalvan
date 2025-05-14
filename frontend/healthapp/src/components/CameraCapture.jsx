import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

function CameraCapture() {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [result, setResult] = useState(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setStream(stream);
    } catch (error) {
      console.error('Error starting camera:', error);
      setResult({ type: 'Error', medicine: t('camera_error') });
    }
  };

  const captureImage = async () => {
    setLoading(true);
    try {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, 640, 480);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      console.log('Captured image (base64):', imageData.substring(0, 50) + '...');

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      const response = await fetch(`${API_BASE_URL}/injury/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Backend response:', data);

      setResult(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({
        type: 'Error',
        medicine: error.name === 'AbortError'
          ? t('analysis_timeout')
          : t('analysis_error', { message: error.message })
      });
    } finally {
      setLoading(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  return (
    <div>
      <h2><i className="fas fa-camera"></i> {t('camera_title')}</h2>
      <video ref={videoRef} autoPlay className="camera-video" />
      <canvas ref={canvasRef} width="640" height="480" className="camera-canvas" style={{ display: 'none' }} />
      <div className="camera-buttons">
        <button
          onClick={startCamera}
          className="btn-primary"
          disabled={stream || loading}
        >
          {t('start_camera')}
        </button>
        <button
          onClick={captureImage}
          className="btn-secondary"
          disabled={!stream || loading}
        >
          {t('capture_image')}
        </button>
      </div>
      {loading && <div className="spinner">{t('analyzing_image')}</div>}
      {result && (
        <div className="camera-result">
          <p><strong>{t('injury_type')}:</strong> {result.type}</p>
          <p><strong>{t('suggested_medicine')}:</strong> {result.medicine}</p>
        </div>
      )}
    </div>
  );
}

export default CameraCapture;