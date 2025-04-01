import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuestionStore } from '../../../store/questionStore';
import { useAuthStore } from '../../../store/authStore';
import * as pdfjs from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
import { Loader2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface DocumentUploaderProps {
  subjectId: string;
  onQuestionsGenerated?: () => void;
}

interface Question {
  text: string;
  options: string[];
  correct_answer: number; // Changed to number (index 0-3)
  difficulty: 'easy' | 'medium' | 'hard';
  subject_id: string;
  teacher_id: string;
  marks: number;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuthStore();
  const [extractedText, setExtractedText] = useState<string>('');
  const { addQuestion } = useQuestionStore();
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());

  const MAX_FILE_SIZE = 2 * 1024 * 1024;

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

  const extractTextFromPDF = async (file: File) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (index: number) => {
    const newSelected = new Set(selectedQuestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedQuestions(newSelected);
  };

  const handleSaveQuestions = async () => {
    try {
      setLoading(true);
      const selectedQuestionsList = Array.from(selectedQuestions).map(
        (index) => generatedQuestions[index]
      );

      await Promise.all(
        selectedQuestionsList.map((question) =>
          addQuestion({
            text: question.text,
            options: question.options,
            correct_answer: question.correct_answer, // Now an index (0-3)
            difficulty: question.difficulty,
            subject_id: subjectId,
            teacher_id: user!.id,
            marks: 1,
          })
        )
      );

      toast.success('Selected questions saved successfully!');
      if (onQuestionsGenerated) onQuestionsGenerated();
      setGeneratedQuestions([]);
      setSelectedQuestions(new Set());
    } catch (error) {
      toast.error('Failed to save questions');
      console.error('Save questions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMCQs = async () => {
    if (!extractedText) {
      toast.error('No text extracted to generate questions');
      return;
    }

    setLoading(true);
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
      console.log('Gemini API Response:', data);

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidates found in API response');
      }

      const generatedContent = data.candidates[0].content.parts[0].text;
      if (!generatedContent) {
        throw new Error('Generated content is empty or malformed');
      }

      let rawQuestions: { text: string; options: string[]; correct_answer: string; difficulty: string }[];
      try {
        rawQuestions = JSON.parse(generatedContent);
      } catch (parseError) {
        console.error('Raw content:', generatedContent);
        throw new Error('Failed to parse generated content as JSON');
      }

      if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
        throw new Error('Generated content is not a valid array of questions');
      }

      // Convert letter-based correct_answer to index-based
      const questions: Question[] = rawQuestions.map((q) => ({
        text: q.text,
        options: q.options,
        correct_answer: q.options.findIndex((_, i) => String.fromCharCode(65 + i) === q.correct_answer), // Convert "A" to 0, "B" to 1, etc.
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
        subject_id: subjectId,
        teacher_id: user!.id,
        marks: 1,
      }));

      setGeneratedQuestions(questions);
      setSelectedQuestions(new Set(questions.map((_, i) => i)));
      toast.success('MCQs generated successfully!');
    } catch (error) {
      console.error('Error generating MCQs:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate MCQs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF Document (Max 2MB)
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
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
              disabled={loading}
              className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Generating Questions...
                </>
              ) : (
                'Generate MCQs'
              )}
            </button>
          </div>
        )}
      </div>

      {generatedQuestions.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Generated Questions</h2>
            <div className="space-x-4">
              <button
                onClick={() => setSelectedQuestions(new Set(generatedQuestions.map((_, i) => i)))}
                className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                disabled={loading}
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedQuestions(new Set())}
                className="text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                disabled={loading}
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {generatedQuestions.map((question, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 space-y-3 cursor-pointer transition-colors ${
                  selectedQuestions.has(index)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleQuestionSelection(index)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.has(index)}
                      onChange={() => toggleQuestionSelection(index)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
                      onClick={(e) => e.stopPropagation()}
                      disabled={loading}
                    />
                    <p className="font-medium text-gray-900">
                      {index + 1}. {question.text}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {question.difficulty}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-2 rounded-md ${
                        optIndex === question.correct_answer
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {String.fromCharCode(65 + optIndex)}. {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveQuestions}
              disabled={selectedQuestions.size === 0 || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Save Selected Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;