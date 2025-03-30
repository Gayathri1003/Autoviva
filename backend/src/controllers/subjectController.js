const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subject' });
  }
};

exports.getTeacherSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      teachers: req.user._id,
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subjects' });
  }
};

exports.assignTeacher = async (req, res) => {
  try {
    const { subjectId, teacherId } = req.body;
    
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (!subject.teachers.includes(teacherId)) {
      subject.teachers.push(teacherId);
      await subject.save();
    }

    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign teacher' });
  }
};