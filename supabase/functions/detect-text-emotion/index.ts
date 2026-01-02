import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface EmotionKeywords {
  happy: string[];
  sad: string[];
  angry: string[];
  stressed: string[];
  neutral: string[];
}

const emotionKeywords: EmotionKeywords = {
  happy: [
    'happy', 'joy', 'excited', 'great', 'wonderful', 'amazing', 'fantastic',
    'excellent', 'good', 'love', 'blessed', 'grateful', 'thrilled', 'delighted',
    'cheerful', 'pleased', 'glad', 'content', 'satisfied', 'enjoy', 'awesome'
  ],
  sad: [
    'sad', 'unhappy', 'depressed', 'lonely', 'miserable', 'down', 'upset',
    'hurt', 'disappointed', 'gloomy', 'blue', 'heartbroken', 'cry', 'crying',
    'tears', 'sorrow', 'grief', 'melancholy', 'hopeless', 'despair'
  ],
  angry: [
    'angry', 'mad', 'furious', 'annoyed', 'irritated', 'frustrated', 'rage',
    'hate', 'disgusted', 'outraged', 'livid', 'enraged', 'bitter', 'hostile',
    'resentful', 'aggravated', 'pissed', 'upset', 'infuriated'
  ],
  stressed: [
    'stressed', 'anxious', 'worried', 'nervous', 'overwhelmed', 'pressure',
    'tension', 'panic', 'fear', 'scared', 'afraid', 'concerned', 'uneasy',
    'tense', 'restless', 'troubled', 'exhausted', 'tired', 'drained', 'burden'
  ],
  neutral: [
    'okay', 'fine', 'alright', 'normal', 'usual', 'average', 'nothing',
    'regular', 'same', 'typical'
  ]
};

function detectEmotion(text: string): { emotion: string; confidence: number } {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\W+/);
  
  const scores: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    stressed: 0,
    neutral: 0
  };

  for (const word of words) {
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => word.includes(keyword) || keyword.includes(word))) {
        scores[emotion] += 1;
      }
    }
  }

  let maxEmotion = 'neutral';
  let maxScore = 0;
  
  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxEmotion = emotion;
    }
  }

  const totalWords = words.filter(w => w.length > 2).length;
  const confidence = totalWords > 0 ? Math.min(maxScore / totalWords * 2, 1) : 0.5;

  return {
    emotion: maxEmotion,
    confidence: Math.max(confidence, 0.3)
  };
}

async function getSuggestion(emotion: string, supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data: emotionData } = await supabase
    .from('emotions')
    .select('id')
    .eq('name', emotion)
    .maybeSingle();

  if (!emotionData) return null;

  const { data: suggestions } = await supabase
    .from('suggestions')
    .select('type, content')
    .eq('emotion_id', emotionData.id);

  if (!suggestions || suggestions.length === 0) return null;

  const quote = suggestions.find(s => s.type === 'quote')?.content || '';
  const advice = suggestions.find(s => s.type === 'advice')?.content || '';
  const music = suggestions.find(s => s.type === 'music')?.content || '';

  return { quote, advice, music };
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text input is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { emotion, confidence } = detectEmotion(text);
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const suggestion = await getSuggestion(emotion, supabaseUrl, supabaseKey);
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from('detection_history').insert({
      input_type: 'text',
      input_text: text,
      detected_emotion: emotion,
      confidence: confidence,
      suggestion_shown: suggestion?.quote || null
    });

    return new Response(
      JSON.stringify({
        emotion,
        confidence,
        suggestion
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});