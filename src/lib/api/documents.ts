import { supabase } from '../supabase';

export async function uploadDocument(
  file: File,
  teacherId: string,
  subjectId: string
) {
  // Upload file to Supabase Storage
  const { data: fileData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(`${teacherId}/${file.name}`, file);

  if (uploadError) throw new Error('Failed to upload file');

  // Create document record
  const { data: document, error: dbError } = await supabase
    .from('documents')
    .insert({
      teacher_id: teacherId,
      subject_id: subjectId,
      name: file.name,
      file_path: fileData.path,
      file_type: file.type,
      size: file.size,
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup uploaded file if database insert fails
    await supabase.storage.from('documents').remove([fileData.path]);
    throw new Error('Failed to create document record');
  }

  return document;
}

export async function getDocuments(subjectId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('subject_id', subjectId);

  if (error) throw new Error('Failed to fetch documents');
  return data;
}

export async function deleteDocument(id: string, filePath: string) {
  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([filePath]);

  if (storageError) throw new Error('Failed to delete file');

  // Delete document record
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (dbError) throw new Error('Failed to delete document record');
}