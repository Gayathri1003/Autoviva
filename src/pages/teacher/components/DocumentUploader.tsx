// src/pages/teacher/components/DocumentUploader.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuestionStore } from '../../../store/questionStore';
import { useAuthStore } from '../../../store/authStore';
import * as pdfjs from 'pdfjs-dist';
// @ts-ignore
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface DocumentUploaderProps {
  subjectId: string;
  onQuestionsGenerated?: () => void;
}

interface Question {
  text: string;
  options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuthStore();
  const [extractedText, setExtractedText] = useState<string>('');
  const { addQuestion } = useQuestionStore();

  // File size limit: 2MB
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  // Handle file selection and validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast.error('File size exceeds 2MB limit');
        return;
      }
      setFile(selectedFile);
      extractTextFromPDF(selectedFile);
    }
  };

  // Extract text from the PDF using pdf.js
  const extractTextFromPDF = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
      let fullText = '';
  
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
  
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
  
        fullText += pageText + '\n';
      }
  
      setExtractedText(fullText);
      toast.success('Text extracted from PDF successfully');
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      toast.error('Failed to extract text from PDF');
      setExtractedText('');
    }
  };    
  
  // Generate MCQs using Gemini API
const handleGenerateMCQs = async () => {
  if (!extractedText) {
    toast.error('No text extracted to generate questions');
    return;
  }

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is missing. Ensure VITE_GEMINI_API_KEY is set in your environment.');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 multiple-choice questions (MCQs) based on the following text. Each question should have 4 options (A, B, C, D) and specify the correct answer. Return the response in JSON format:
                    [
                      {
                        "text": "Question text",
                        "options": ["Option A", "Option B", "Option C", "Option D"],
                        "correct_answer": "A",
                        "difficulty": "medium"
                      }
                    ]
                    Text: ${extractedText}`,
                },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log('Gemini API Response:', data); // Log the full response for debugging

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No candidates found in API response');
    }

    const generatedContent = data.candidates[0].content.parts[0].text;
    if (!generatedContent) {
      throw new Error('Generated content is empty or malformed');
    }

    let questions: Question[];
    try {
      questions = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Raw content:', generatedContent);
      throw new Error('Failed to parse generated content as JSON');
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Generated content is not a valid array of questions');
    }

    await Promise.all(
      questions.map((q) =>
        addQuestion({
          text: q.text,
          options: q.options,
          correct_answer: q.options.findIndex((_opt: string, idx: number) =>
            String.fromCharCode(65 + idx) === q.correct_answer
          ), // Convert "A", "B", "C", "D" to 0, 1, 2, 3
          difficulty: q.difficulty || 'medium',
          subject_id: subjectId,
          teacher_id: user!.id,
          marks: 1,
        })
      )
    );

    toast.success('MCQs generated and saved successfully!');
    if (onQuestionsGenerated) onQuestionsGenerated();
  } catch (error) {
    console.error('Error generating MCQs:', error);
    toast.error(`Failed to generate MCQs`);
  }
};
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload PDF Document (Max 2MB)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {file && (
        <div>
          <p className="text-sm text-gray-500">Uploaded File: {file.name}</p>
          {extractedText && (
            <div className="mt-4">
              <h3 className="text-lg font-bold">Extracted Text</h3>
              <pre className="p-4 bg-gray-100 rounded-lg max-h-60 overflow-auto">{extractedText}</pre>
            </div>
          )}
          <button
            onClick={handleGenerateMCQs}
            className="mt-4 w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Generate MCQs
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
