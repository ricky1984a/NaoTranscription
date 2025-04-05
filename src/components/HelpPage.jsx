import React from 'react';
import { ArrowLeft, Headphones, Languages, FileText, Save, HelpCircle, FileAudio } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4 text-blue-500 hover:text-blue-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Help & Documentation</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">Getting Started with MedTranscribe</h2>
        <p className="mb-4">
          MedTranscribe is a powerful tool designed for healthcare professionals to transcribe, translate, and manage medical audio recordings.
          Here's how to get started:
        </p>

        <ol className="list-decimal pl-6 mb-6 space-y-2">
          <li>Create an account or sign in to your existing account</li>
          <li>On the home page, you'll find options to record audio or upload existing files</li>
          <li>Once transcribed, you can review, edit, and translate your transcriptions</li>
          <li>Access your history at any time to view or manage past transcriptions</li>
        </ol>

        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-blue-800 font-medium">
            <HelpCircle size={18} className="inline mr-2" />
            Need more assistance? Contact support at support@medtranscribe.com
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
            <Headphones className="mr-2 text-blue-500" size={20} />
            Recording Audio
          </h2>
          <p className="mb-3">Record audio directly from your device:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Click the "Start Recording" button on the home page</li>
            <li>Speak clearly into your device's microphone</li>
            <li>Click "Stop" when finished</li>
            <li>Review the transcription that appears automatically</li>
          </ul>
          <p className="text-sm text-gray-600">
            Tip: For best results, record in a quiet environment and speak at a moderate pace.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
            <FileAudio className="mr-2 text-blue-500" size={20} />
            Uploading Files
          </h2>
          <p className="mb-3">Upload existing audio files for transcription:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Click "Upload File" on the home page</li>
            <li>Select an audio file from your device (supported formats: MP3, WAV, M4A, FLAC)</li>
            <li>The file will upload and be processed automatically</li>
            <li>Larger files may take longer to process</li>
          </ul>
          <p className="text-sm text-gray-600">
            Tip: Files under 10MB generally process faster. For large recordings, consider splitting them.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <Languages className="mr-2 text-blue-500" size={20} />
          Working with Translations
        </h2>
        <p className="mb-4">
          MedTranscribe offers translation capabilities for your medical transcriptions:
        </p>

        <div className="mb-4">
          <h3 className="font-medium mb-2">Available Languages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['English', 'Spanish', 'French', 'German', 'Italian'].map(lang => (
              <div key={lang} className="bg-gray-50 px-3 py-2 rounded text-center">
                {lang}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2">How to Translate</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Open a transcription from your history</li>
            <li>Select the "Translate" button</li>
            <li>Choose the target language</li>
            <li>Wait for the translation to complete</li>
            <li>Review the translation alongside the original text</li>
          </ol>
        </div>

        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="text-yellow-800">
            <HelpCircle size={18} className="inline mr-2" />
            Translation accuracy may vary for specialized medical terminology. Always review translations before clinical use.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
            <FileText className="mr-2 text-blue-500" size={20} />
            Managing Transcriptions
          </h2>
          <p className="mb-3">Work with your saved transcriptions:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>View all transcriptions in the History section</li>
            <li>Edit transcriptions to correct any errors</li>
            <li>Delete transcriptions you no longer need</li>
            <li>Search through your transcription library</li>
            <li>Organize transcriptions by patient or category</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
            <Save className="mr-2 text-blue-500" size={20} />
            Exporting & Sharing
          </h2>
          <p className="mb-3">Share your transcriptions and translations:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Export as PDF, Word document, or plain text</li>
            <li>Copy text directly to clipboard</li>
            <li>Email transcriptions directly from the app</li>
            <li>Print transcriptions with formatting preserved</li>
            <li>Generate shareable links (PRO feature)</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-600 border-b pb-2">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-1">Q: How accurate is the transcription?</h3>
            <p className="text-gray-700">
              A: MedTranscribe achieves 90-95% accuracy for clear audio recordings in standard medical contexts.
              Accuracy may vary depending on audio quality, accents, and specialized terminology.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">Q: Is my data secure?</h3>
            <p className="text-gray-700">
              A: Yes. All audio and transcription data is encrypted both in transit and at rest.
              We follow HIPAA guidelines for medical data security and never share your data with third parties.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">Q: What file formats are supported?</h3>
            <p className="text-gray-700">
              A: MedTranscribe supports MP3, WAV, M4A, FLAC, and OGG audio formats.
              For best quality, we recommend WAV or FLAC formats.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">Q: How long does transcription take?</h3>
            <p className="text-gray-700">
              A: Most recordings are transcribed in approximately the same time as the recording length
              (e.g., a 5-minute recording takes about 5 minutes to transcribe).
              Processing time may vary based on audio quality and server load.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-1">Q: Can I edit the transcription?</h3>
            <p className="text-gray-700">
              A: Yes, you can edit any transcription to correct errors or add details.
              Simply open the transcription and click the Edit button.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Need Additional Help?</h2>
        <p className="mb-4">
          Our support team is available Monday through Friday, 9AM to 5PM EST.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="mailto:support@medtranscribe.com" className="bg-white text-blue-600 py-2 px-4 rounded-md text-center font-medium hover:bg-blue-50">
            Email Support
          </a>
          <a href="tel:+13464418394" className="bg-white text-blue-600 py-2 px-4 rounded-md text-center font-medium hover:bg-blue-50">
            Call Support: +1 (346) 441-8394
          </a>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>MedTranscribe Version 2.1.5 • © 2025 MedTranscribe Technologies</p>
      </div>
    </div>
  );
};

export default HelpPage;