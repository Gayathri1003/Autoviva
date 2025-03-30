/*
  # Authentication and User Management Tables

  1. New Tables
    - `auth_users`: Core user authentication table
    - `auth_sessions`: User session management
    - `auth_password_resets`: Password reset tracking
  
  2. Security
    - Enable RLS on all tables
    - Add policies for secure access
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auth Users Table
CREATE TABLE IF NOT EXISTS auth_users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Auth Sessions Table
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth_users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Password Reset Table
CREATE TABLE IF NOT EXISTS auth_password_resets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth_users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_password_resets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON auth_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON auth_users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own sessions" ON auth_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own password resets" ON auth_password_resets
  FOR ALL USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_auth_users_username ON auth_users(username);
CREATE INDEX idx_auth_users_email ON auth_users(email);
CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX idx_auth_sessions_token ON auth_sessions(token);
CREATE INDEX idx_auth_password_resets_user_id ON auth_password_resets(user_id);
CREATE INDEX idx_auth_password_resets_token ON auth_password_resets(token);