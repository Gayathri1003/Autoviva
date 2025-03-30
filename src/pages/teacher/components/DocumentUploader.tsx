// src/pages/teacher/components/DocumentUploader.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuestionStore } from '../../../store/questionStore';
import * as pdfjs from 'pdfjs-dist';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface DocumentUploaderProps {
  subjectId: string;
  onQuestionsGenerated?: () => void;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correct_answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject_id: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const { addQuestion } = useQuestionStore();

  // File size limit: 2MB
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Replace with your Gemini API key
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 multiple-choice questions (MCQs) based on the following text. Each question should have 4 options (A, B, C, D) and specify the correct answer. Return the response in JSON format with the following structure:
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
      });

      const data = await response.json();
      const questions = JSON.parse(data.candidates[0].content.parts[0].text);

      // Add subject_id and id to each question, then store in the question store
      const formattedQuestions: Question[] = questions.map((q: any, index: number) => ({
        id: Date.now().toString() + index,
        text: q.text,
        options: q.options,
        correct_answer: q.correct_answer,
        difficulty: q.difficulty || 'medium',
        subject_id: subjectId,
      }));

      // Add questions to the store
      formattedQuestions.forEach((question) => addQuestion(question));
      setGeneratedQuestions(formattedQuestions);
      toast.success('MCQs generated successfully!');

      if (onQuestionsGenerated) onQuestionsGenerated();
    } catch (error) {
      console.error('Error generating MCQs:', error);
      toast.error('Failed to generate MCQs');
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

      {generatedQuestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Generated MCQs</h3>
          <ul className="space-y-4 mt-4">
            {generatedQuestions.map((question, index) => (
              <li key={question.id} className="p-4 bg-gray-100 rounded-lg flex flex-col space-y-2">
                <p className="font-bold">{index + 1}. {question.text}</p>
                <div className="flex flex-col space-y-1">
                  {question.options.map((option, idx) => (
                    <p
                      key={idx}
                      className={
                        question.correct_answer === String.fromCharCode(65 + idx)
                          ? 'text-green-600'
                          : ''
                      }
                    >
                      {String.fromCharCode(65 + idx)}. {option}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Correct Answer: {question.correct_answer}
                </p>
                <p className="text-sm text-gray-500">Difficulty: {question.difficulty}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;