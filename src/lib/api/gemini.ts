import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GeneratedQuestion {
  id: string;  // Add ID to the interface
  text: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

export async function generateQuestionsFromText(
  text: string,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate ${count} multiple choice questions from the following topic. 
      Format each question as a JSON object with properties:
      - text: the question text
      - options: array of 4 possible answers
      - correct_answer: index of correct answer (0-3)
      - difficulty: "easy", "medium", or "hard"
      
      Topic: ${text}
      
      Return ONLY a JSON array of questions with no additional text.
      Example format:
      [
        {
          "text": "What is the capital of France?",
          "options": ["London", "Paris", "Berlin", "Madrid"],
          "correct_answer": 1,
          "difficulty": "easy"
        }
      ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();
    
    try {
      // Try to parse the response as JSON directly
      const parsedQuestions = JSON.parse(responseText);
      
      // Add unique IDs and default marks to each question
      return parsedQuestions.map((q: any, index: number) => ({
        ...q,
        id: `gen_${Date.now()}_${index}`,  // Generate unique ID
        marks: 1  // Default marks
      }));
    } catch (error) {
      // If direct parsing fails, try to extract JSON from the text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedQuestions = JSON.parse(jsonMatch[0]);
        return parsedQuestions.map((q: any, index: number) => ({
          ...q,
          id: `gen_${Date.now()}_${index}`,  // Generate unique ID
          marks: 1  // Default marks
        }));
      }
      throw new Error('Failed to parse generated questions');
    }
  } catch (error) {
    console.error('Question generation error:', error);
    throw new Error('Failed to generate questions');
  }
}

export async function generateQuestionsFromDocument(
  documentText: string,
  count: number = 5
): Promise<GeneratedQuestion[]> {
  return generateQuestionsFromText(documentText, count);
}