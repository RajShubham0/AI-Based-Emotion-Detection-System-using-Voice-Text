/*
  # Emotion Detection System Database Schema

  ## Overview
  This migration creates the database structure for an AI-based emotion detection system
  that analyzes text and voice inputs to detect emotions and provide personalized suggestions.

  ## New Tables

  ### 1. `emotions`
  Stores the different emotion types supported by the system.
  - `id` (uuid, primary key) - Unique identifier for each emotion
  - `name` (text, unique) - Emotion name (happy, sad, angry, neutral, stressed)
  - `emoji` (text) - Emoji representation of the emotion
  - `color` (text) - Color code for UI visualization
  - `description` (text) - Brief description of the emotion
  - `created_at` (timestamptz) - Timestamp of creation

  ### 2. `suggestions`
  Stores motivational quotes, advice, and music recommendations for each emotion.
  - `id` (uuid, primary key) - Unique identifier for each suggestion
  - `emotion_id` (uuid, foreign key) - References the emotion this suggestion is for
  - `type` (text) - Type of suggestion (quote, advice, music)
  - `content` (text) - The actual suggestion content
  - `created_at` (timestamptz) - Timestamp of creation

  ### 3. `detection_history`
  Stores the history of emotion detections for analytics and user history.
  - `id` (uuid, primary key) - Unique identifier for each detection
  - `user_id` (uuid, nullable) - User identifier (nullable for anonymous users)
  - `input_type` (text) - Type of input (text or voice)
  - `input_text` (text, nullable) - Text input or transcription
  - `detected_emotion` (text) - The detected emotion
  - `confidence` (numeric) - Confidence score of the detection (0-1)
  - `suggestion_shown` (text, nullable) - The suggestion that was shown
  - `created_at` (timestamptz) - Timestamp of detection

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Public read access for emotions and suggestions tables
  - Detection history is accessible to all users (no auth required for MVP)

  ## Initial Data
  Seeds initial emotions and suggestions for immediate use
*/

-- Create emotions table
CREATE TABLE IF NOT EXISTS emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  emoji text NOT NULL,
  color text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion_id uuid REFERENCES emotions(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('quote', 'advice', 'music')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create detection history table
CREATE TABLE IF NOT EXISTS detection_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  input_type text NOT NULL CHECK (input_type IN ('text', 'voice')),
  input_text text,
  detected_emotion text NOT NULL,
  confidence numeric CHECK (confidence >= 0 AND confidence <= 1),
  suggestion_shown text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE detection_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emotions (public read access)
CREATE POLICY "Anyone can view emotions"
  ON emotions FOR SELECT
  USING (true);

-- RLS Policies for suggestions (public read access)
CREATE POLICY "Anyone can view suggestions"
  ON suggestions FOR SELECT
  USING (true);

-- RLS Policies for detection_history (public access for MVP)
CREATE POLICY "Anyone can view detection history"
  ON detection_history FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert detection history"
  ON detection_history FOR INSERT
  WITH CHECK (true);

-- Insert initial emotions
INSERT INTO emotions (name, emoji, color, description) VALUES
  ('happy', '😊', '#10B981', 'Feeling joyful, content, and positive'),
  ('sad', '😔', '#6366F1', 'Feeling down, lonely, or melancholic'),
  ('angry', '😠', '#EF4444', 'Feeling frustrated, annoyed, or irritated'),
  ('neutral', '😐', '#6B7280', 'Feeling calm and balanced'),
  ('stressed', '😰', '#F59E0B', 'Feeling anxious, overwhelmed, or pressured')
ON CONFLICT (name) DO NOTHING;

-- Insert suggestions for each emotion
INSERT INTO suggestions (emotion_id, type, content)
SELECT 
  e.id,
  s.type,
  s.content
FROM emotions e
CROSS JOIN (
  VALUES 
    -- Happy suggestions
    ('happy', 'quote', 'Keep spreading your positive energy! Your smile brightens the world ✨'),
    ('happy', 'advice', 'Share your happiness with others today. Call a friend or do something kind!'),
    ('happy', 'music', 'Upbeat Pop, Dance, Feel-good Indie'),
    
    -- Sad suggestions
    ('sad', 'quote', 'You are stronger than you think 💙. This too shall pass.'),
    ('sad', 'advice', 'Take a break, listen to calm music, and remember: it''s okay to not be okay.'),
    ('sad', 'music', 'Calm Acoustic, Lo-fi, Soothing Piano'),
    
    -- Angry suggestions
    ('angry', 'quote', 'Take a deep breath. You have the power to choose your response 🧘'),
    ('angry', 'advice', 'Step away for a moment. Try deep breathing or a quick walk to clear your mind.'),
    ('angry', 'music', 'Heavy Rock, Workout Music, Intense Beats'),
    
    -- Neutral suggestions
    ('neutral', 'quote', 'Balance is the key to everything. You''re doing great! 🌟'),
    ('neutral', 'advice', 'Perfect time to try something new or work on your goals!'),
    ('neutral', 'music', 'Ambient, Jazz, Classical'),
    
    -- Stressed suggestions
    ('stressed', 'quote', 'One step at a time. You''ve got this! 💪'),
    ('stressed', 'advice', 'Break tasks into smaller steps. Take regular breaks and stay hydrated.'),
    ('stressed', 'music', 'Meditation Music, Nature Sounds, Relaxing Instrumentals')
) s(emotion_name, type, content)
WHERE e.name = s.emotion_name
ON CONFLICT DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_suggestions_emotion_id ON suggestions(emotion_id);
CREATE INDEX IF NOT EXISTS idx_detection_history_created_at ON detection_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detection_history_emotion ON detection_history(detected_emotion);