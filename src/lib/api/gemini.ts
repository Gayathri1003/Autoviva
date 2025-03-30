// gemini.ts
import axios from 'axios';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateQuestionsFromText = async (topic: string, count: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Generate ${count} multiple-choice questions on the topic "${topic}". 
                  Each question should include:
                  1. The question text ending with a '?'.
                  2. Four distinct answer options labeled as A), B), C), and D).
                  3. The correct answer identified as one of A), B), C), or D).
                  4. A varied difficulty level chosen from 'easy', 'medium', or 'hard'.

                  Example Format:
                  - Question: What is the time complexity of binary search?
                  - Options: A) O(n), B) O(log n), C) O(n^2), D) O(1)
                  - Answer: B
                  - Difficulty: medium
                `
              }
            ]
          }
        ]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return response.data;
  } catch (error) {
    console.error('API error while generating questions:', error);
    throw error;
  }
};
