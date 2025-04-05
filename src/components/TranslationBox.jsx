import React from 'react';
import { Volume2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const TranslationBox = ({ title, text, language, isLoading, onPlay }) => {
  const isRtlLanguage = language && ['ar', 'he', 'fa', 'ur'].includes(language);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex space-x-2">
          {!isLoading && text && (
            <button
              onClick={onPlay}
              className="text-blue-500 hover:text-blue-700"
              title="Play audio"
            >
              <Volume2 size={18} />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-md">
          <LoadingSpinner />
          <p className="mt-4 text-gray-500">Translating...</p>
        </div>
      ) : (
        <div
          className="h-64 p-3 bg-gray-50 rounded-md overflow-y-auto"
          dir={isRtlLanguage ? 'rtl' : 'ltr'}
        >
          {text ? (
            <p className="whitespace-pre-wrap">{text}</p>
          ) : (
            <p className="text-gray-400 italic">Translation will appear here.</p>
          )}
        </div>
      )}

      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          {language && <span>{getLanguageName(language)}</span>}
        </div>

        {text && (
          <button
            onClick={onPlay}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Volume2 size={16} className="mr-1" /> Speak
          </button>
        )}
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
    'ja-JP': 'Japanese',
    'zh-CN': 'Chinese (Simplified)',
    'ru-RU': 'Russian',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'ja': 'Japanese',
    'zh': 'Chinese (Simplified)',
    'ru': 'Russian',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'pt': 'Portuguese',
    'nl': 'Dutch',
    'tr': 'Turkish',
    'pl': 'Polish',
    'uk': 'Ukrainian',
  };

  return languages[code] || code;
};

export default TranslationBox;