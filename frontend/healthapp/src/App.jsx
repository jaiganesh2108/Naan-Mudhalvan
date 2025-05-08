import { useState, useEffect, Component } from 'react';
import { useTranslation } from 'react-i18next';
import CameraCapture from './components/CameraCapture';
import SymptomAnalyzer from './components/SymptomAnalyzer';
import Chatbot from './components/Chatbot';
import Telemedicine from './components/Telemedicine';
import EMRViewer from './components/EMRViewer';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong:</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [activeSection, setActiveSection] = useState('camera');

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ErrorBoundary>
      <div className="app-container">
        <nav className="sidebar">
          <div className="logo">
            <i className="fas fa-heartbeat"></i>
            <h1>{t('title')}</h1>
          </div>
          <ul>
            <li>
              <a
                href="#camera"
                className={activeSection === 'camera' ? 'active' : ''}
                onClick={() => scrollToSection('camera')}
              >
                <i className="fas fa-camera"></i> {t('camera_title')}
              </a>
            </li>
            <li>
              <a
                href="#symptom-analyzer"
                className={activeSection === 'symptom-analyzer' ? 'active' : ''}
                onClick={() => scrollToSection('symptom-analyzer')}
              >
                <i className="fas fa-stethoscope"></i> {t('symptom_analyzer_title')}
              </a>
            </li>
            <li>
              <a
                href="#telemedicine"
                className={activeSection === 'telemedicine' ? 'active' : ''}
                onClick={() => scrollToSection('telemedicine')}
              >
                <i className="fas fa-video"></i> {t('telemedicine_title')}
              </a>
            </li>
            <li>
              <a
                href="#emr-viewer"
                className={activeSection === 'emr-viewer' ? 'active' : ''}
                onClick={() => scrollToSection('emr-viewer')}
              >
                <i className="fas fa-file-medical"></i> {t('emr_viewer_title')}
              </a>
            </li>
            <li>
              <a
                href="#chatbot"
                className={activeSection === 'chatbot' ? 'active' : ''}
                onClick={() => scrollToSection('chatbot')}
              >
                <i className="fas fa-robot"></i> {t('chatbot_title')}
              </a>
            </li>
          </ul>
        </nav>

        <div className="app-content">
          <div className="language-selector">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="zh">中文 (Chinese)</option>
            </select>
          </div>

          <main className="app-main">
            <section id="camera" className="component-card">
              <CameraCapture />
            </section>

            <div className="section-separator">
              <i className="fas fa-heartbeat"></i>
            </div>

            <section id="symptom-analyzer" className="component-card">
              <SymptomAnalyzer />
            </section>

            <div className="section-separator">
              <i className="fas fa-heartbeat"></i>
            </div>

            <section id="telemedicine" className="component-card">
              <Telemedicine />
            </section>

            <div className="section-separator">
              <i className="fas fa-heartbeat"></i>
            </div>

            <section id="emr-viewer" className="component-card">
              <EMRViewer />
            </section>

            <div className="section-separator">
              <i className="fas fa-heartbeat"></i>
            </div>

            <section id="chatbot" className="component-card">
              <Chatbot />
            </section>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;