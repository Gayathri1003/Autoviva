/*
  # Exam Results and Analytics Tables

  1. New Tables
    - `exam_results`: Store student exam results
    - `question_responses`: Individual question responses
    - `result_analytics`: Analytics and statistics
  
  2. Security
    - Enable RLS on all tables
    - Add policies for students, teachers, and admins
*/

-- Exam Results Table
CREATE TABLE IF NOT EXISTS exam_results (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid REFERENCES auth_users(id) ON DELETE CASCADE,
  total_marks INTEGER NOT NULL,
  obtained_marks INTEGER NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pass', 'fail', 'absent')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Question Responses Table
CREATE TABLE IF NOT EXISTS question_responses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  result_id uuid REFERENCES exam_results(id) ON DELETE CASCADE,
  question_id uuid REFERENCES question_bank(id) ON DELETE CASCADE,
  selected_option INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  marks_obtained INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Result Analytics Table
CREATE TABLE IF NOT EXISTS result_analytics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  total_students INTEGER NOT NULL,
  passed_students INTEGER NOT NULL,
  highest_marks INTEGER NOT NULL,
  lowest_marks INTEGER NOT NULL,
  average_marks DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE result_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Students can view their own results" ON exam_results
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view their exam results" ON exam_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exams e
      WHERE e.id = exam_results.exam_id
      AND e.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Students can view their own responses" ON question_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exam_results er
      WHERE er.id = question_responses.result_id
      AND er.student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view exam responses" ON question_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exam_results er
      JOIN exams e ON e.id = er.exam_id
      WHERE er.id = question_responses.result_id
      AND e.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view their exam analytics" ON result_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM exams e
      WHERE e.id = result_analytics.exam_id
      AND e.teacher_id = auth.uid()
    )
  );

-- Indexes
CREATE INDEX idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX idx_question_responses_result_id ON question_responses(result_id);
CREATE INDEX idx_question_responses_question_id ON question_responses(question_id);
CREATE INDEX idx_result_analytics_exam_id ON result_analytics(exam_id);