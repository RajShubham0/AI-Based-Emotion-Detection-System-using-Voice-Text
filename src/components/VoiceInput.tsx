import { useState, useEffect } from 'react';
import { Mic, MicOff, Radio } from 'lucide-react';

interface VoiceInputProps {
  onAnalyze: (transcript: string) => void;
  isAnalyzing: boolean;
}

export function VoiceInput({ onAnalyze, isAnalyzing }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
    }
  }, []);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      setTranscript('');
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      onAnalyze(speechResult);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  if (!isSupported) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
        <p className="text-center text-yellow-800">
          Voice recording is not supported in your browser. Please try Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        <button
          type="button"
          onClick={startRecording}
          disabled={isRecording || isAnalyzing}
          className={`w-full py-6 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl ${
            isRecording
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse'
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? (
            <>
              <Radio size={24} className="animate-pulse" />
              Listening...
            </>
          ) : isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Mic size={24} />
              Start Voice Recording
            </>
          )}
        </button>

        {transcript && (
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Transcript:</p>
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Click the button and speak naturally about how you're feeling</p>
        </div>
      </div>
    </div>
  );
}
