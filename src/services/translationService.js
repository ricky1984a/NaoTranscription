/**
 * Translation service for handling AI-enhanced text translation requests
 */
import { getToken } from './authService';

const API_URL = 'http://localhost:2000/api';

// Fetch translation from the backend API using AI-enhanced endpoint
export const fetchTranslation = async (text, sourceLanguage, targetLanguage) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/ai/translations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        text,
        source_language: sourceLanguage,
        target_language: targetLanguage,
        high_quality: true // Use AI-enhanced translation
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Translation failed');
    }

    const data = await response.json();
    return data.content; // Return the translated content
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

// Get translation for an existing transcription
export const getTranslation = async (transcriptionId, targetLanguage) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    // First check if translation already exists
    const response = await fetch(`${API_URL}/translations/transcription/${transcriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch translations');
    }

    const translations = await response.json();

    // Find translation for the requested target language
    const existingTranslation = translations.find(t => t.target_language === targetLanguage);

    if (existingTranslation) {
      return existingTranslation;
    }

    // If no translation exists, create a new one
    const createResponse = await fetch(`${API_URL}/ai/translations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        transcription_id: transcriptionId,
        target_language: targetLanguage,
        high_quality: true
      })
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json();
      throw new Error(errorData.message || 'Failed to create translation');
    }

    return await createResponse.json();
  } catch (error) {
    console.error('Error getting translation:', error);
    throw error;
  }
};

// Get translation quality check
export const checkTranslationQuality = async (translationId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/ai/translations/${translationId}/quality-check`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check translation quality');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking translation quality:', error);
    throw error;
  }
};

// Get medical glossary for language pair
export const getMedicalGlossary = async (sourceLanguage, targetLanguage) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    // Convert language codes to match API format (remove country code if present)
    const srcLang = sourceLanguage.split('-')[0];
    const tgtLang = targetLanguage.split('-')[0];

    const response = await fetch(`${API_URL}/ai/medical-glossary/${srcLang}/${tgtLang}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Glossary not available for this language pair
        return {};
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch medical glossary');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching medical glossary:', error);
    throw error;
  }
};

// Get available languages for translation
export const fetchAvailableLanguages = async (isSourceLanguage = false) => {
  try {
    const endpoint = isSourceLanguage ? 'source' : 'target';
    const response = await fetch(`${API_URL}/languages?type=${endpoint}`);

    if (!response.ok) {
      // Fall back to hardcoded languages
      return isSourceLanguage ? getSourceLanguages() : getTargetLanguages();
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    // Fall back to hardcoded languages
    return isSourceLanguage ? getSourceLanguages() : getTargetLanguages();
  }
};

// Hardcoded language lists as fallback
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
];