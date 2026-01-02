export interface EmotionResult {
  emotion: string;
  confidence: number;
  suggestion: Suggestion;
  transcript?: string;
}

export interface Suggestion {
  quote: string;
  advice: string;
  music: string;
}

export interface EmotionConfig {
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export const emotionConfigs: Record<string, EmotionConfig> = {
  happy: {
    name: 'Happy',
    emoji: '😊',
    color: '#10B981',
    description: 'Feeling joyful and positive'
  },
  sad: {
    name: 'Sad',
    emoji: '😔',
    color: '#6366F1',
    description: 'Feeling down or melancholic'
  },
  angry: {
    name: 'Angry',
    emoji: '😠',
    color: '#EF4444',
    description: 'Feeling frustrated or irritated'
  },
  neutral: {
    name: 'Neutral',
    emoji: '😐',
    color: '#6B7280',
    description: 'Feeling calm and balanced'
  },
  stressed: {
    name: 'Stressed',
    emoji: '😰',
    color: '#F59E0B',
    description: 'Feeling anxious or overwhelmed'
  }
};
