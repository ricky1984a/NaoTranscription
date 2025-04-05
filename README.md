# Medical Transcription App

A full-stack application for medical voice transcription with AI-enhanced accuracy, real-time translation, and audio playback.

## Features

- **Voice-to-Text with Generative AI:** Convert spoken input into text transcripts with medical terminology enhancement
- **Real-Time Translation:** Translate transcripts between multiple languages
- **Audio Playback:** Listen to translated text with natural text-to-speech
- **Mobile-First Design:** Responsive interface optimized for both mobile and desktop use
- **Dual Transcript Display:** View original and translated text side-by-side
- **User Authentication:** Secure access to transcription history

## Tech Stack

### Frontend
- React.js with Hooks
- TailwindCSS for styling
- Web Speech API for browser-based speech recognition
- SpeechSynthesis API for text-to-speech
- Lucide React for icons

### Backend
- Flask REST API
- SQLAlchemy ORM
- PostgreSQL database
- JWT authentication
- OpenAI integration for enhanced transcription
- Google Cloud Speech-to-Text API

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL database
- OpenAI API key (optional for enhanced AI features)
- Google Cloud Service Account (optional for enhanced speech recognition)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd backend
   vercel
   ```

4. Configure environment variables in the Vercel dashboard.

## Docker Deployment

A Docker Compose setup is available for containerized deployment:

```bash
docker-compose up -d
```

## Usage Guide

1. **Recording Audio**
   - Click the "Start Recording" button to begin capturing audio
   - Speak clearly into your microphone
   - Click "Stop Recording" when finished
   - The transcription will appear in the "Original Text" panel

2. **Editing Transcriptions**
   - Click the edit icon to modify the transcription text
   - Make your changes and click the checkmark to save
   - Click the X to cancel editing

3. **Translation**
   - Select the source and target languages from the dropdown menus
   - The translation will automatically appear in the "Translation" panel
   - Click the "Play" button to hear the translation spoken aloud

4. **Saving Transcriptions**
   - Click the "Save" button to store your transcription
   - You must be logged in to save transcriptions
   - Access your saved transcriptions from the history page

## Browser Compatibility

The application is compatible with:
- Chrome 60+
- Firefox 55+
- Safari 14+
- Edge 79+

Note: Some features like the Web Speech API have varying levels of support across browsers.

## Privacy and Security

- All medical data is encrypted in transit and at rest
- Personal Health Information (PHI) is anonymized before processing
- Comprehensive audit logging for HIPAA compliance
- Data access controls with role-based permissions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [OpenAI](https://openai.com/) for the GPT language models
- [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text)
- [Flask](https://flask.palletsprojects.com/)
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000.

### Backend Setup

1. Set up a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Set up the database:
   ```bash
   python setup.py
   ```

4. Start the backend server:
   ```bash
   python run.py
   ```

The API will be available at http://localhost:5000.

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Core Configuration
FLASK_ENV=development
SECRET_KEY=your-secure-secret-key
DATABASE_URL=postgresql://username:password@localhost:5432/medical_transcription

# AI Services (Optional)
OPENAI_API_KEY=your-openai-api-key
GOOGLE_APPLICATION_CREDENTIALS=path/to/google-credentials.json
```

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/token` - Get authentication token

### Transcriptions
- `GET /api/transcriptions` - Get all transcriptions for current user
- `POST /api/transcriptions` - Create a new transcription
- `GET /api/transcriptions/:id` - Get a specific transcription
- `PUT /api/transcriptions/:id` - Update a transcription
- `DELETE /api/transcriptions/:id` - Delete a transcription
- `POST /api/transcriptions/:id/upload` - Upload audio for transcription

### Translations
- `GET /api/translations/transcription/:id` - Get translations for a transcription
- `POST /api/translations` - Create a new translation
- `GET /api/translations/:id` - Get a specific translation
- `PUT /api/translations/:id` - Update a translation
- `DELETE /api/translations/:id` - Delete a translation

### AI-Enhanced Routes
- `POST /api/ai/transcriptions/:id/upload` - Upload and transcribe with AI enhancement
- `GET /api/ai/transcriptions/:id/analysis` - Get medical coding and analysis
- `POST /api/ai/translations` - Create AI-enhanced translation
- `GET /api/ai/medical-glossary/:source/:target` - Get medical terminology glossary

## Deployment

The application is configured for deployment on Vercel:

1. Set up Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy frontend:
   ```bash
   cd frontend
   vercel
   ```

3. Deploy backend:
   ```bash