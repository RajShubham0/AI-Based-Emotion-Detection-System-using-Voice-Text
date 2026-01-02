import { useState } from 'react';
import { TextInput } from './components/TextInput';
import { VoiceInput } from './components/VoiceInput';
import { EmotionDisplay } from './components/EmotionDisplay';
import { SuggestionCard } from './components/SuggestionCard';
import { EmotionResult } from './types/emotion';
import { Brain, MessageSquare, Mic } from 'lucide-react';

type InputMode = 'text' | 'voice';

function App() {
  const [mode, setMode] = useState<InputMode>('text');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<EmotionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeText = async (text: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-text-emotion`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze emotion');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeVoice = async (transcript: string) => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/detect-voice-emotion`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze emotion');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            AI Emotion Detection System
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Express yourself through text or voice, and let AI understand your emotions
          </p>
        </header>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('text')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              mode === 'text'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <MessageSquare size={20} />
            Text Input
          </button>
          <button
            onClick={() => setMode('voice')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              mode === 'voice'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <Mic size={20} />
            Voice Input
          </button>
        </div>

        <div className="mb-12">
          {mode === 'text' ? (
            <TextInput onAnalyze={analyzeText} isAnalyzing={isAnalyzing} />
          ) : (
            <VoiceInput onAnalyze={analyzeVoice} isAnalyzing={isAnalyzing} />
          )}
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6 animate-fadeIn">
            <EmotionDisplay emotion={result.emotion} confidence={result.confidence} />
            <SuggestionCard suggestion={result.suggestion} emotion={result.emotion} />
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Powered by AI & NLP Technology</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
