/*
  # Initial Database Schema

  1. New Tables
    - users
      - id (uuid, primary key)
      - username (text, unique)
      - email (text, unique)
      - name (text)
      - role (text)
      - password_hash (text)
      - has_set_password (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - teachers
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - department (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - students
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - department (text)
      - semester (integer)
      - class (text)
      - batch (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - subjects
      - id (uuid, primary key)
      - code (text, unique)
      - name (text)
      - department (text)
      - semester (integer)
      - is_lab (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - subject_assignments
      - id (uuid, primary key)
      - teacher_id (uuid, foreign key)
      - subject_id (uuid, foreign key)
      - batch (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  password_hash text,
  has_set_password boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teachers table
CREATE TABLE teachers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  department text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  department text NOT NULL,
  semester integer NOT NULL CHECK (semester BETWEEN 1 AND 8),
  class text NOT NULL,
  batch text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subjects table
CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  department text NOT NULL,
  semester integer NOT NULL CHECK (semester BETWEEN 1 AND 8),
  is_lab boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Subject assignments table
CREATE TABLE subject_assignments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id uuid REFERENCES teachers(id) ON DELETE CASCADE,
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  batch text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(teacher_id, subject_id, batch)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE subject_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policies for teachers table
CREATE POLICY "Teachers can view their own data"
  ON teachers
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin can manage teachers"
  ON teachers
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policies for students table
CREATE POLICY "Students can view their own data"
  ON students
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Teachers can view their students"
  ON students
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 
    FROM teachers t
    JOIN subject_assignments sa ON sa.teacher_id = t.id
    WHERE t.user_id = auth.uid()
    AND students.department = t.department
  ));

CREATE POLICY "Admin can manage students"
  ON students
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policies for subjects table
CREATE POLICY "Anyone can view subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can manage subjects"
  ON subjects
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policies for subject_assignments table
CREATE POLICY "Teachers can view their assignments"
  ON subject_assignments
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM teachers WHERE user_id = auth.uid() AND id = subject_assignments.teacher_id
  ));

CREATE POLICY "Admin can manage assignments"
  ON subject_assignments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  ));

-- Create indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_teachers_user_id ON teachers(user_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_subject_assignments_teacher_id ON subject_assignments(teacher_id);
CREATE INDEX idx_subject_assignments_subject_id ON subject_assignments(subject_id);