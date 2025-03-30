const Question = require('../models/Question');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateQuestions = async (req, res) => {
  try {
    const { topic, subjectId, count = 5 } = req.body;

    const prompt = `Generate ${count} multiple choice questions about ${topic}. 
    Format each question as a JSON object with:
    - text: question text
    - options: array of 4 possible answers
    - correctAnswer: index of correct answer (0-3)
    - difficulty: "easy", "medium", or "hard"
    - marks: number between 1 and 5`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const generatedQuestions = JSON.parse(completion.choices[0].message.content);

    // Save questions to database
    const savedQuestions = await Promise.all(
      generatedQuestions.map(q => 
        Question.create({
          ...q,
          teacher: req.user._id,
          subject: subjectId,
          topic,
        })
      )
    );

    res.json(savedQuestions);
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ message: 'Failed to generate questions' });
  }
};

exports.getQuestionsBySubject = async (req, res) => {
  try {
    const questions = await Question.find({ subject: req.params.subjectId })
      .populate('teacher', 'name')
      .sort('-createdAt');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
};

exports.createQuestion = async (req, res) => {
  try {
    const question = await Question.create({
      ...req.body,
      teacher: req.user._id,
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create question' });
  }
};