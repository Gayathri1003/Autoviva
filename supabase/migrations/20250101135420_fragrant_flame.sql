/*
  # Exam Management Schema

  1. New Tables
    - questions
      - id (uuid, primary key)
      - subject_id (uuid, foreign key)
      - teacher_id (uuid, foreign key)
      - text (text)
      - options (jsonb)
      - correct_answer (integer)
      - difficulty (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - exams
      - id (uuid, primary key)
      - subject_id (uuid, foreign key)
      - teacher_id (uuid, foreign key)
      - title (text)
      - description (text)
      - duration_minutes (integer)
      - total_marks (integer)
      - start_time (timestamp)
      - end_time (timestamp)
      - is_active (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - exam_questions
      - id (uuid, primary key)
      - exam_id (uuid, foreign key)
      - question_id (uuid, foreign key)
      - marks (integer)
      - created_at (timestamp)
    
    - exam_submissions
      - id (uuid, primary key)
      - exam_id (uuid, foreign key)
      - student_id (uuid, foreign key)
      - answers (jsonb)
      - score (integer)
      - submitted_at (timestamp)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - documents
      - id (uuid, primary key)
      - teacher_id (uuid, foreign key)
      - subject_id (uuid, foreign key)
      - name (text)
      - file_path (text)
      - file_type (text)
      - size (integer)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Questions table
CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer integer NOT NULL,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exams table
CREATE TABLE exams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  duration_minutes integer NOT NULL,
  total_marks integer NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exam questions table
CREATE TABLE exam_questions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  marks integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, question_id)
);

-- Exam submissions table
CREATE TABLE exam_submissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id uuid REFERENCES exams(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  answers jsonb NOT NULL,
  score integer,
  submitted_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(exam_id, student_id)
);

-- Documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  size integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies for questions table
CREATE POLICY "Teachers can manage their questions"
  ON questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers 
      WHERE user_id = auth.uid() 
      AND id = questions.teacher_id
    )
  );

CREATE POLICY "Students can view questions during exam"
  ON questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exam_questions eq
      JOIN exams e ON e.id = eq.exam_id
      JOIN students s ON s.department = (
        SELECT department FROM subjects WHERE id = e.subject_id
      )
      WHERE eq.question_id = questions.id
      AND s.user_id = auth.uid()
      AND e.is_active = true
      AND e.start_time <= now()
      AND e.end_time >= now()
    )
  );

-- Policies for exams table
CREATE POLICY "Teachers can manage their exams"
  ON exams
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers 
      WHERE user_id = auth.uid() 
      AND id = exams.teacher_id
    )
  );

CREATE POLICY "Students can view available exams"
  ON exams
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.user_id = auth.uid()
      AND s.department = (
        SELECT department FROM subjects WHERE id = exams.subject_id
      )
      AND exams.is_active = true
    )
  );

-- Policies for exam_questions table
CREATE POLICY "Teachers can manage exam questions"
  ON exam_questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exams e
      JOIN teachers t ON t.id = e.teacher_id
      WHERE t.user_id = auth.uid()
      AND e.id = exam_questions.exam_id
    )
  );

-- Policies for exam_submissions table
CREATE POLICY "Students can submit their exams"
  ON exam_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.user_id = auth.uid()
      AND s.id = exam_submissions.student_id
    )
  );

CREATE POLICY "Students can view their submissions"
  ON exam_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.user_id = auth.uid()
      AND s.id = exam_submissions.student_id
    )
  );

CREATE POLICY "Teachers can view submissions for their exams"
  ON exam_submissions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM exams e
      JOIN teachers t ON t.id = e.teacher_id
      WHERE t.user_id = auth.uid()
      AND e.id = exam_submissions.exam_id
    )
  );

-- Policies for documents table
CREATE POLICY "Teachers can manage their documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teachers 
      WHERE user_id = auth.uid() 
      AND id = documents.teacher_id
    )
  );

CREATE POLICY "Students can view subject documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.user_id = auth.uid()
      AND s.department = (
        SELECT department FROM subjects WHERE id = documents.subject_id
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_questions_subject_id ON questions(subject_id);
CREATE INDEX idx_questions_teacher_id ON questions(teacher_id);
CREATE INDEX idx_exams_subject_id ON exams(subject_id);
CREATE INDEX idx_exams_teacher_id ON exams(teacher_id);
CREATE INDEX idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX idx_exam_questions_question_id ON exam_questions(question_id);
CREATE INDEX idx_exam_submissions_exam_id ON exam_submissions(exam_id);
CREATE INDEX idx_exam_submissions_student_id ON exam_submissions(student_id);
CREATE INDEX idx_documents_teacher_id ON documents(teacher_id);
CREATE INDEX idx_documents_subject_id ON documents(subject_id);