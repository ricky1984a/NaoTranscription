// App.jsx - Updated to integrate with HelpPage
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown,
  Mic,
  MicOff,
  Play,
  RotateCcw,
  Save,
  Settings,
  List,
  HelpCircle
} from 'lucide-react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import LanguageSelector from './components/LanguageSelector';
import TranscriptBox from './components/TranscriptBox';
import TranslationBox from './components/TranslationBox';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import HistoryPage from './components/HistoryPage';
import HelpPage from './components/HelpPage';
import { fetchTranslation } from './services/translationService';
import { startRecording, stopRecording } from './services/recordingService';
import { createTranscription, uploadAndTranscribe, saveTranscription } from './services/transcriptionService';
import { playAudio } from './services/audioService';
import { isAuthenticated, logoutUser } from './services/authService';
import './App.css';

// Main application component
function MainApp() {
  const navigate = useNavigate();

  // State variables
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translation, setTranslation] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en-US');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);
  const [currentTranscriptionId, setCurrentTranscriptionId] = useState(null);

  // References
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Check if user is logged in on component mount
  useEffect(() => {
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);
  }, []);

  // Translate the transcript - wrapped in useCallback
  const translateTranscript = useCallback(async (text) => {
    if (!text || text.trim() === '') return;

    setIsTranslating(true);
    try {
      const translatedText = await fetchTranslation(
        text,
        sourceLanguage.split('-')[0], // Remove country code
        targetLanguage
      );
      setTranslation(translatedText);
    } catch (error) {
      setError("Translation failed. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  }, [sourceLanguage, targetLanguage]);

  // Handle recording toggle
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      try {
        const audioBlob = await stopRecording(mediaRecorderRef.current, audioChunksRef.current);

        if (!isLoggedIn) {
          setError("Please login to transcribe audio");
          setShowLoginModal(true);
          setIsRecording(false);
          return;
        }

        const transcription = await processAudio(audioBlob);
        setTranscript(transcription.content);
        setCurrentTranscriptionId(transcription.id);
        translateTranscript(transcription.content);
      } catch (error) {
        setError("Failed to process recording. Please try again.");
        console.error("Recording error:", error);
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const { mediaRecorder, audioChunks } = await startRecording();
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = audioChunks;
        setIsRecording(true);
        setError(null);
      } catch (error) {
        setError("Microphone access is required for recording.");
        console.error("Microphone access error:", error);
      }
    }
  };

  // Process audio after recording
  const processAudio = async (audioBlob) => {
    try {
      // First create a new transcription
      const newTranscription = await createTranscription({
        title: `Transcription ${new Date().toLocaleString()}`,
        language: sourceLanguage.split('-')[0] // Remove country code
      });

      // Then upload audio and transcribe it
      const result = await uploadAndTranscribe(newTranscription.id, audioBlob);
      return result;
    } catch (error) {
      console.error("Audio processing error:", error);
      throw error;
    }
  };

  // Play translated text audio
  const handlePlayTranslation = () => {
    if (translation && translation.trim() !== '') {
      playAudio(translation, targetLanguage);
    }
  };

  // Save transcription and translation
  const handleSave = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!transcript || transcript.trim() === '') {
      setError("Nothing to save. Record something first.");
      return;
    }

    setIsSaving(true);
    try {
      // If we already have a transcription ID, just update it
      if (currentTranscriptionId) {
        await saveTranscription({
          id: currentTranscriptionId,
          title: `Transcription ${new Date().toLocaleString()}`,
          content: transcript,
          translation: translation,
          source_language: sourceLanguage.split('-')[0],
          target_language: targetLanguage
        });
      } else {
        // Otherwise create a new one
        const result = await saveTranscription({
          title: `Transcription ${new Date().toLocaleString()}`,
          content: transcript,
          translation: translation,
          source_language: sourceLanguage.split('-')[0],
          target_language: targetLanguage
        });
        setCurrentTranscriptionId(result.id);
      }

      setError(null);
    } catch (error) {
      setError("Failed to save. Please try again.");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset everything
  const handleReset = () => {
    setTranscript('');
    setTranslation('');
    setError(null);
    setCurrentTranscriptionId(null);
  };

  // Handle login
  const handleLogin = (success) => {
    setIsLoggedIn(success);
    setShowLoginModal(false);
  };

  // Handle logout
  const handleLogout = () => {
    logoutUser();
    setIsLoggedIn(false);
  };

  // Navigation handlers
  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  // Update translation when transcript or languages change
  useEffect(() => {
    if (transcript) {
      translateTranscript(transcript);
    }
  }, [sourceLanguage, targetLanguage, transcript, translateTranscript]);

  return (
    <div className="app-container flex flex-col min-h-screen bg-gray-50">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onHistoryClick={handleHistoryClick}
        onHelpClick={handleHelpClick}
      />

      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        {/* Language Selection Panel */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Languages</h2>
            <div className="flex space-x-2">
              {isLoggedIn && (
                <button
                  onClick={handleHistoryClick}
                  className="text-blue-500 hover:text-blue-700 flex items-center"
                  title="View history"
                >
                  <List size={20} className="mr-1" />
                  <span className="hidden sm:inline">History</span>
                </button>
              )}
              <button
                onClick={handleHelpClick}
                className="text-blue-500 hover:text-blue-700 flex items-center"
                title="Help"
              >
                <HelpCircle size={20} className="mr-1" />
                <span className="hidden sm:inline">Help</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-500 hover:text-gray-700"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4">
            <LanguageSelector
              label="From"
              value={sourceLanguage}
              onChange={setSourceLanguage}
              isSource={true}
            />
            <div className="hidden md:flex items-center justify-center">
              <ChevronDown className="transform -rotate-90 md:rotate-0 text-gray-400" />
            </div>
            <LanguageSelector
              label="To"
              value={targetLanguage}
              onChange={setTargetLanguage}
              isSource={false}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Transcription Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TranscriptBox
            title="Original Text"
            text={transcript}
            language={sourceLanguage}
            isLoading={isRecording}
            onChange={setTranscript}
            onChangeComplete={(text) => {
              setTranscript(text);
              translateTranscript(text);
            }}
          />

          <TranslationBox
            title="Translation"
            text={translation}
            language={targetLanguage}
            isLoading={isTranslating}
            onPlay={handlePlayTranslation}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button
            onClick={toggleRecording}
            className={`flex items-center px-6 py-3 rounded-full font-medium ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff size={20} className="mr-2" /> Stop Recording
              </>
            ) : (
              <>
                <Mic size={20} className="mr-2" /> Start Recording
              </>
            )}
          </button>

          <button
            onClick={handlePlayTranslation}
            disabled={!translation || isTranslating}
            className="flex items-center px-6 py-3 rounded-full font-medium bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={20} className="mr-2" /> Play Translation
          </button>

          <button
            onClick={handleSave}
            disabled={!transcript || isSaving}
            className="flex items-center px-6 py-3 rounded-full font-medium bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <LoadingSpinner size="small" /> Saving...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" /> Save
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="flex items-center px-6 py-3 rounded-full font-medium bg-gray-300 hover:bg-gray-400 text-gray-700"
          >
            <RotateCcw size={20} className="mr-2" /> Reset
          </button>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          Medical Transcription App &copy; {new Date().getFullYear()}
        </div>
      </footer>

      {showLoginModal && (
        <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
}

// HistoryPage wrapper component
function HistoryPageWrapper() {
  const navigate = useNavigate();
  return <HistoryPage onBack={() => navigate('/')} />;
}

// App component with router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/history" element={<HistoryPageWrapper />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;