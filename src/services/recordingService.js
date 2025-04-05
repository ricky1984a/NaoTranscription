/**
 * Recording service for handling audio recording
 */

// Start audio recording
export const startRecording = async () => {
  try {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create media recorder
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    // Set up event handlers
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    // Start recording
    mediaRecorder.start();

    return { mediaRecorder, audioChunks };
  } catch (error) {
    console.error('Error starting recording:', error);
    throw error;
  }
};

// Stop audio recording
export const stopRecording = (mediaRecorder, audioChunks) => {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder) {
      reject(new Error('MediaRecorder not initialized'));
      return;
    }

    // Set up event handlers
    mediaRecorder.onstop = () => {
      // Stop all media tracks
      mediaRecorder.stream.getTracks().forEach(track => track.stop());

      // Create blob from audio chunks
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      resolve(audioBlob);
    };

    mediaRecorder.onerror = (event) => {
      console.error('MediaRecorder error:', event);
      reject(event.error);
    };

    // Stop recording if it's active
    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    } else {
      reject(new Error('MediaRecorder is not recording'));
    }
  });
};

// Transcribe audio using Web Speech API (fallback for development)
export const transcribeAudioWithWebSpeech = (audioBlob, language = 'en-US') => {
  return new Promise((resolve, reject) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = false;

    let transcript = '';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + ' ';
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      reject(event.error);
    };

    recognition.onend = () => {
      resolve(transcript.trim());
    };

    // Convert blob to audio element and play it for recognition
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      recognition.stop();
    };

    audio.onerror = (error) => {
      console.error('Error playing audio for recognition:', error);
      recognition.stop();
      reject(error);
    };

    recognition.start();
    audio.play().catch(error => {
      console.error('Error starting audio playback:', error);
      recognition.stop();
      reject(error);
    });
  });
};

// Check if browser supports recording
export const isRecordingSupported = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// Check if browser supports speech recognition
export const isSpeechRecognitionSupported = () => {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};