import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';

interface TextInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function TextInput({ onAnalyze, isAnalyzing }: TextInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isAnalyzing) {
      onAnalyze(text.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-4 text-gray-400">
            <MessageSquare size={24} />
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type how you're feeling... (e.g., 'I feel very happy and excited today!')"
            className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
            rows={4}
            disabled={isAnalyzing}
          />
        </div>
        <button
          type="submit"
          disabled={!text.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-3 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Send size={20} />
              Analyze Emotion
            </>
          )}
        </button>
      </form>
    </div>
  );
}
