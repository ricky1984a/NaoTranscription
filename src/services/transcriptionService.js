/**
 * Transcription service for handling AI-enhanced transcript creation and retrieval
 */
import { getToken } from './authService';

const API_URL = 'http://localhost:2000/api';

// Create a new empty transcription
export const createTranscription = async (data) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/transcriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create transcription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating transcription:', error);
    throw error;
  }
};

// Upload audio for transcription (using AI-enhanced endpoint)
export const uploadAndTranscribe = async (transcriptionId, audioBlob) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('audio_file', audioBlob, 'recording.wav');

    const response = await fetch(`${API_URL}/ai/transcriptions/${transcriptionId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to transcribe audio');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading and transcribing audio:', error);
    throw error;
  }
};

// Get AI analysis of a transcription
export const analyzeTranscription = async (transcriptionId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/ai/transcriptions/${transcriptionId}/analysis`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze transcription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing transcription:', error);
    throw error;
  }
};

// Get AI summary of a transcription
export const summarizeTranscription = async (transcriptionId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/ai/transcriptions/${transcriptionId}/summarize`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to summarize transcription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error summarizing transcription:', error);
    throw error;
  }
};

// Save a transcription
export const saveTranscription = async (transcriptionData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    // First create an empty transcription
    const newTranscription = await createTranscription({
      title: transcriptionData.title,
      language: transcriptionData.source_language
    });

    // Then update it with the content
    const response = await fetch(`${API_URL}/transcriptions/${newTranscription.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        content: transcriptionData.content,
        status: 'completed'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update transcription');
    }

    // Create a translation if translation is provided
    if (transcriptionData.translation) {
      await createTranslation({
        transcription_id: newTranscription.id,
        source_language: transcriptionData.source_language,
        target_language: transcriptionData.target_language,
        content: transcriptionData.translation
      });
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving transcription:', error);
    throw error;
  }
};

// Create a translation for a transcription
const createTranslation = async (translationData) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/translations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(translationData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create translation');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating translation:', error);
    throw error;
  }
};

// Get transcription history
export const getTranscriptionHistory = async () => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/transcriptions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch transcription history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching transcription history:', error);
    throw error;
  }
};

// Get a specific transcription
export const getTranscription = async (transcriptionId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/transcriptions/${transcriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch transcription');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching transcription ${transcriptionId}:`, error);
    throw error;
  }
};

// Delete a transcription
export const deleteTranscription = async (transcriptionId) => {
  try {
    const token = getToken();

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/transcriptions/${transcriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete transcription');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting transcription ${transcriptionId}:`, error);
    throw error;
  }
};