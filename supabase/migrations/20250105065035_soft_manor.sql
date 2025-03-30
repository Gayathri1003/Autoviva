/*
  # Question Bank and Exam Management Tables

  1. New Tables
    - `question_bank`: Store all questions
    - `question_categories`: Question categorization
    - `question_tags`: Tagging system for questions
  
  2. Security
    - Enable RLS on all tables
    - Add policies for teachers and admins
*/

-- Question Bank Table
CREATE TABLE IF NOT EXISTS question_bank (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id uuid REFERENCES auth_users(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  marks INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Question Categories Table
CREATE TABLE IF NOT EXISTS question_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Question Tags Table
CREATE TABLE IF NOT EXISTS question_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id uuid REFERENCES question_bank(id) ON DELETE CASCADE,
  category_id uuid REFERENCES question_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(question_id, category_id)
);

-- Enable RLS
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Teachers can manage their questions" ON question_bank
  FOR ALL USING (
    auth.uid() = teacher_id OR 
    EXISTS (
      SELECT 1 FROM auth_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Everyone can view active questions" ON question_bank
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage categories" ON question_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Everyone can view categories" ON question_categories
  FOR SELECT USING (true);

CREATE POLICY "Teachers can manage question tags" ON question_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM question_bank 
      WHERE id = question_tags.question_id 
      AND teacher_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM auth_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Indexes
CREATE INDEX idx_question_bank_teacher_id ON question_bank(teacher_id);
CREATE INDEX idx_question_bank_subject_id ON question_bank(subject_id);
CREATE INDEX idx_question_tags_question_id ON question_tags(question_id);
CREATE INDEX idx_question_tags_category_id ON question_tags(category_id);