import { Suggestion } from '../types/emotion';
import { Heart, Lightbulb, Music } from 'lucide-react';

interface SuggestionCardProps {
  suggestion: Suggestion;
  emotion: string;
}

export function SuggestionCard({ suggestion }: SuggestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-4 animate-fadeIn">
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-pink-100 hover:shadow-xl transition-all">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Heart className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-2 text-lg">Motivation</h4>
            <p className="text-gray-600 leading-relaxed">{suggestion.quote}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 hover:shadow-xl transition-all">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Lightbulb className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-2 text-lg">Advice</h4>
            <p className="text-gray-600 leading-relaxed">{suggestion.advice}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 hover:shadow-xl transition-all">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center">
            <Music className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-2 text-lg">Recommended Music</h4>
            <p className="text-gray-600 leading-relaxed">{suggestion.music}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
