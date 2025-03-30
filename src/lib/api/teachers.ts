import { supabase } from '../supabase';
import { Teacher } from '../../types';

export async function getTeachers() {
  const { data, error } = await supabase
    .from('teachers')
    .select(`
      id,
      users (
        id,
        name,
        username,
        email
      ),
      department,
      subject_assignments (
        subjects (
          name
        )
      )
    `);

  if (error) {
    throw new Error('Failed to fetch teachers');
  }

  return data.map((teacher: any): Teacher => ({
    id: teacher.id,
    name: teacher.users.name,
    username: teacher.users.username,
    email: teacher.users.email,
    department: teacher.department,
    subjects: teacher.subject_assignments.map((sa: any) => sa.subjects.name),
    hasSetPassword: true,
  }));
}

export async function addTeacher(teacher: Omit<Teacher, 'id' | 'hasSetPassword' | 'subjects' | 'password'>) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({
      username: teacher.username,
      email: teacher.email,
      name: teacher.name,
      role: 'teacher',
    })
    .select()
    .single();

  if (userError) {
    throw new Error('Failed to create user');
  }

  const { error: teacherError } = await supabase
    .from('teachers')
    .insert({
      user_id: userData.id,
      department: teacher.department,
    });

  if (teacherError) {
    throw new Error('Failed to create teacher');
  }
}

export async function updateTeacher(id: string, teacher: Partial<Teacher>) {
  const { error } = await supabase
    .from('teachers')
    .update({
      department: teacher.department,
    })
    .eq('id', id);

  if (error) {
    throw new Error('Failed to update teacher');
  }
}

export async function deleteTeacher(id: string) {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Failed to delete teacher');
  }
}