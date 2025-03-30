import { supabase } from '../supabase';
import { Student } from '../../types';

export async function getStudents() {
  const { data, error } = await supabase
    .from('students')
    .select(`
      id,
      users (
        id,
        name,
        username,
        email
      ),
      department,
      semester,
      class,
      batch
    `);

  if (error) {
    throw new Error('Failed to fetch students');
  }

  return data.map((student: any): Student => ({
    id: student.id,
    name: student.users.name,
    username: student.users.username,
    email: student.users.email,
    department: student.department,
    semester: student.semester.toString(),
    class: student.class,
    batch: student.batch,
    hasSetPassword: true,
  }));
}

export async function addStudent(student: Omit<Student, 'id' | 'hasSetPassword' | 'password'>) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      username: student.username,
      email: student.email,
      name: student.name,
      role: 'student',
    })
    .select()
    .single();

  if (userError) {
    throw new Error('Failed to create user');
  }

  const { error: studentError } = await supabase
    .from('students')
    .insert({
      user_id: userData.id,
      department: student.department,
      semester: parseInt(student.semester),
      class: student.class,
      batch: student.batch,
    });

  if (studentError) {
    throw new Error('Failed to create student');
  }
}

export async function updateStudent(id: string, student: Partial<Student>) {
  const { error } = await supabase
    .from('students')
    .update({
      department: student.department,
      semester: student.semester ? parseInt(student.semester) : undefined,
      class: student.class,
      batch: student.batch,
    })
    .eq('id', id);

  if (error) {
    throw new Error('Failed to update student');
  }
}

export async function deleteStudent(id: string) {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Failed to delete student');
  }
}