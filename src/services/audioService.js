/**
 * Audio service for handling audio playback
 */

// Cache for speech synthesis voices
let voicesCache = null;

// Play audio from text using Speech Synthesis API
export const playAudio = (text, language) => {
  if (!text || text.trim() === '') {
    console.warn('Empty text provided for audio playback');
    return;
  }

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set language
  utterance.lang = getLanguageCode(language);

  // Get the appropriate voice
  const voices = getVoices();
  const voice = selectVoice(voices, language);
  if (voice) {
    utterance.voice = voice;
  }

  // Optional settings
  utterance.rate = 1.0; // Normal speed
  utterance.pitch = 1.0; // Normal pitch
  utterance.volume = 1.0; // Maximum volume

  // Add event handlers if needed
  utterance.onstart = () => {
    console.log('Started speaking');
  };

  utterance.onend = () => {
    console.log('Finished speaking');
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
  };

  // Speak the text
  window.speechSynthesis.speak(utterance);
};

// Get all available voices
const getVoices = () => {
  // Return cached voices if available
  if (voicesCache) {
    return voicesCache;
  }

  // Get all voices from the browser
  const voices = window.speechSynthesis.getVoices();

  // Cache voices for future use
  voicesCache = voices;

  return voices;
};

// Initialize voices (necessary for some browsers)
const initVoices = () => {
  if (window.speechSynthesis) {
    // Load voices immediately if available
    voicesCache = window.speechSynthesis.getVoices();

    // Listen for voices changed event
    window.speechSynthesis.onvoiceschanged = () => {
      voicesCache = window.speechSynthesis.getVoices();
    };
  }
};

// Initialize voices when the module loads
if (typeof window !== 'undefined') {
  initVoices();
}

// Select the best voice for a given language
const selectVoice = (voices, language) => {
  if (!voices || voices.length === 0) {
    return null;
  }

  const langCode = getLanguageCode(language);

  // Try to find an exact match for the language
  const exactMatch = voices.find(voice =>
    voice.lang === langCode ||
    voice.lang.startsWith(`${langCode}-`)
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Try to find a voice that matches the first part of the language code
  const baseCode = langCode.split('-')[0];
  const partialMatch = voices.find(voice =>
    voice.lang.startsWith(`${baseCode}-`) ||
    voice.lang.startsWith(baseCode)
  );

  if (partialMatch) {
    return partialMatch;
  }

  // If no match is found, return null, and the browser will use the default voice
  return null;
};

// Convert language code to standard format
const getLanguageCode = (language) => {
  // Map of language codes to standard BCP 47 language tags
  const languageMap = {
    'en': 'en-US',
    'es': 'es-ES',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'it': 'it-IT',
    'ja': 'ja-JP',
    'zh': 'zh-CN',
    'ru': 'ru-RU',
    'ar': 'ar-SA',
    'hi': 'hi-IN',
    'pt': 'pt-BR',
    'nl': 'nl-NL',
    'tr': 'tr-TR',
    'pl': 'pl-PL'
  };

  // If the language code is already in BCP 47 format (e.g., 'en-US')
  if (language.includes('-')) {
    return language;
  }

  // Return the mapped code or the original if no mapping exists
  return languageMap[language] || language;
};

// Play audio from a file URL
export const playAudioFile = (url) => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);

    audio.onended = () => {
      resolve();
    };

    audio.onerror = (error) => {
      console.error('Error playing audio file:', error);
      reject(error);
    };

    audio.play().catch(error => {
      console.error('Error starting audio playback:', error);
      reject(error);
    });
  });
};

// Stop any currently playing audio
export const stopAudio = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};