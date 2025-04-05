import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LanguageSelector = ({ label, value, onChange, isSource }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        // In a real app, fetch from your API
        // const response = await fetch('/api/languages?type=' + (isSource ? 'source' : 'target'));
        // const data = await response.json();

        // For demo purposes, using hardcoded data
        const data = isSource ? getSourceLanguages() : getTargetLanguages();
        setLanguages(data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [isSource]);

  const handleSelect = (langCode) => {
    onChange(langCode);
    setIsOpen(false);
  };

  const getLanguageName = (code) => {
    const lang = languages.find(l => l.code === code);
    return lang ? lang.name : code;
  };

  return (
    <div className="relative w-full mb-2 md:mb-0">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="border border-gray-300 rounded-md p-2 flex justify-between items-center cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {loading ? (
            <div className="animate-pulse h-5 w-24 bg-gray-200 rounded"></div>
          ) : (
            <>
              <span className="text-lg mr-2">
                {getLanguageFlag(value)}
              </span>
              <span>{getLanguageName(value)}</span>
            </>
          )}
        </div>
        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
          {languages.map((language) => (
            <div
              key={language.code}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
              onClick={() => handleSelect(language.code)}
            >
              <div className="flex items-center">
                <span className="text-lg mr-2">{language.flag}</span>
                <span className={`block truncate ${language.code === value ? 'font-medium' : 'font-normal'}`}>
                  {language.name}
                </span>
              </div>

              {language.code === value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Language data helpers
const getSourceLanguages = () => [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
];

const getTargetLanguages = () => [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
];

const getLanguageFlag = (code) => {
  const sourceLanguages = getSourceLanguages();
  const targetLanguages = getTargetLanguages();
  const allLanguages = [...sourceLanguages, ...targetLanguages];

  const language = allLanguages.find(l => l.code === code);
  return language ? language.flag : '🌐';
};

export default LanguageSelector;