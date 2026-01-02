import { emotionConfigs } from '../types/emotion';
import { Activity } from 'lucide-react';

interface EmotionDisplayProps {
  emotion: string;
  confidence: number;
}

export function EmotionDisplay({ emotion, confidence }: EmotionDisplayProps) {
  const config = emotionConfigs[emotion] || emotionConfigs.neutral;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className="relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 animate-fadeIn"
        style={{
          background: `linear-gradient(135deg, ${config.color}15 0%, ${config.color}30 100%)`,
          borderColor: config.color,
          borderWidth: '3px',
          borderStyle: 'solid'
        }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-20"
          style={{ backgroundColor: config.color }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Detected Emotion</p>
              <div className="flex items-center gap-3">
                <span className="text-6xl">{config.emoji}</span>
                <div>
                  <h3 className="text-3xl font-bold" style={{ color: config.color }}>
                    {config.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{config.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Activity size={16} />
                Confidence Level
              </span>
              <span className="text-sm font-bold" style={{ color: config.color }}>
                {confidencePercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${confidencePercent}%`,
                  backgroundColor: config.color
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
