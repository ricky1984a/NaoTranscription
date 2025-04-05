import React, { useState, useEffect } from 'react';
import { Trash2, Eye, FileText, Volume2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { getTranscriptionHistory, deleteTranscription, getTranscription } from '../services/transcriptionService';
import { getTranslation } from '../services/translationService';
import { playAudio } from '../services/audioService';

const HistoryPage = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [transcriptions, setTranscriptions] = useState([]);
  const [selectedTranscription, setSelectedTranscription] = useState(null);
  const [translations, setTranslations] = useState({});
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null); // ID of transcription being deleted

  // Fetch transcription history on component mount
  useEffect(() => {
    fetchTranscriptions();
  }, []);

  const fetchTranscriptions = async () => {
    setLoading(true);
    try {
      const data = await getTranscriptionHistory();
      setTranscriptions(data);
      setError(null);
    } catch (error) {
      setError('Failed to load transcription history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTranscription = async (id) => {
    try {
      const transcription = await getTranscription(id);
      setSelectedTranscription(transcription);
      setError(null);
    } catch (error) {
      setError('Failed to load transcription details');
      console.error(error);
    }
  };

  const handleDeleteTranscription = async (id) => {
    setDeleting(id);
    try {
      await deleteTranscription(id);
      setTranscriptions(transcriptions.filter(t => t.id !== id));

      // If the deleted transcription was selected, clear selection
      if (selectedTranscription && selectedTranscription.id === id) {
        setSelectedTranscription(null);
      }

      setError(null);
    } catch (error) {
      setError('Failed to delete transcription');
      console.error(error);
    } finally {
      setDeleting(null);
    }
  };

  const handleTranslate = async (targetLanguage) => {
    if (!selectedTranscription) return;

    try {
      // Check if we already have this translation
      if (translations[`${selectedTranscription.id}-${targetLanguage}`]) {
        return;
      }

      const translation = await getTranslation(selectedTranscription.id, targetLanguage);

      // Store the translation in state
      setTranslations(prev => ({
        ...prev,
        [`${selectedTranscription.id}-${targetLanguage}`]: translation
      }));

      setError(null);
    } catch (error) {
      setError('Failed to translate transcription');
      console.error(error);
    }
  };

  const handlePlayTranslation = (targetLanguage) => {
    const translation = translations[`${selectedTranscription.id}-${targetLanguage}`];
    if (translation && translation.content) {
      playAudio(translation.content, targetLanguage);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-600">Loading transcription history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transcription History</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Back to Transcribe
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Transcription List */}
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Your Transcriptions</h2>

          {transcriptions.length === 0 ? (
            <p className="text-gray-500 italic">No transcriptions found</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {transcriptions.map(t => (
                <li key={t.id} className="py-3">
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleViewTranscription(t.id)}
                      className="flex items-start text-left w-full"
                    >
                      <FileText size={18} className="mr-2 mt-1 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">{t.title}</p>
                        <p className="text-xs text-gray-500">{formatDate(t.created_at)}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleDeleteTranscription(t.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      disabled={deleting === t.id}
                    >
                      {deleting === t.id ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Transcription Details */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          {selectedTranscription ? (
            <div>
              <h2 className="text-lg font-semibold mb-2">{selectedTranscription.title}</h2>
              <p className="text-sm text-gray-500 mb-4">
                {formatDate(selectedTranscription.created_at)} • {getLanguageName(selectedTranscription.language)}
              </p>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Original Text</h3>
                <p className="whitespace-pre-wrap">{selectedTranscription.content}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Translations</h3>
                <div className="flex flex-wrap gap-2">
                  {['es', 'fr', 'de', 'it'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleTranslate(lang)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-100"
                    >
                      {getLanguageFlag(lang)} {getLanguageName(lang)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display translations */}
              {Object.entries(translations)
                .filter(([key]) => key.startsWith(`${selectedTranscription.id}-`))
                .map(([key, translation]) => {
                  const langCode = key.split('-')[1];
                  return (
                    <div key={key} className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-700">
                          {getLanguageFlag(langCode)} {getLanguageName(langCode)}
                        </h3>
                        <button
                          onClick={() => handlePlayTranslation(langCode)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap">{translation.content}</p>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Eye size={48} className="mb-4 text-gray-300" />
              <p>Select a transcription to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to get language name
const getLanguageName = (code) => {
  const languages = {
    'en-US': 'English (US)',
    'es-ES': 'Spanish (Spain)',
    'fr-FR': 'French',
    'de-DE': 'German',
    'it-IT': 'Italian',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
  };

  return languages[code] || code;
};

// Helper function to get language flag
const getLanguageFlag = (code) => {
  const flags = {
    'en': '🇺🇸',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
  };

  return flags[code] || '🌐';
};

export default HistoryPage;