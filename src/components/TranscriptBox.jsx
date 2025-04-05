import React, { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const TranscriptBox = ({ title, text, language, isLoading, onChange, onChangeComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  // Update local state when text prop changes
  useEffect(() => {
    setEditedText(text);
  }, [text]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);

    // If we're exiting edit mode, apply changes
    if (isEditing) {
      onChangeComplete(editedText);
    }
  };

  const handleCancel = () => {
    setEditedText(text);
    setIsEditing(false);
  };

  const handleTextChange = (e) => {
    setEditedText(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="flex space-x-2">
          {!isLoading && text && (
            isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="text-green-500 hover:text-green-700"
                  title="Save"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-red-500 hover:text-red-700"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="text-blue-500 hover:text-blue-700"
                title="Edit"
              >
                <Pencil size={18} />
              </button>
            )
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-md">
          <LoadingSpinner />
          <p className="mt-4 text-gray-500">Recording...</p>
        </div>
      ) : (
        isEditing ? (
          <textarea
            value={editedText}
            onChange={handleTextChange}
            className="w-full h-64 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Edit transcript..."
            dir={language && ['ar', 'he', 'fa', 'ur'].includes(language.split('-')[0]) ? 'rtl' : 'ltr'}
          />
        ) : (
          <div
            className="h-64 p-3 bg-gray-50 rounded-md overflow-y-auto"
            dir={language && ['ar', 'he', 'fa', 'ur'].includes(language.split('-')[0]) ? 'rtl' : 'ltr'}
          >
            {text ? (
              <p className="whitespace-pre-wrap">{text}</p>
            ) : (
              <p className="text-gray-400 italic">No transcription yet. Press the record button to start.</p>
            )}
          </div>
        )
      )}

      <div className="mt-2 text-xs text-gray-500">
        {language && <span>{getLanguageName(language)}</span>}
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

export default TranscriptBox;