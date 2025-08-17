const mongoose = require('mongoose');
const Chat = require('./models/chatModel');
const Student = require('./models/studentModel');
const Teacher = require('./models/teacherModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tutor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedChatData = async () => {
  try {
    // Get some existing users
    const students = await Student.find().limit(2);
    const teachers = await Teacher.find().limit(2);
    
    if (students.length === 0 || teachers.length === 0) {
      console.log('No users found. Please create some students and teachers first.');
      return;
    }
    
    const student1 = students[0];
    const teacher1 = teachers[0];
    
    // Clear existing chat data
    await Chat.deleteMany({});
    
    // Create some test chat messages
    const testMessages = [
      {
        sender: student1._id,
        receiver: teacher1._id,
        message: 'hello mam how are you i want you to teach me english as i am not good in english.',
        sentAt: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      },
      {
        sender: teacher1._id,
        receiver: student1._id,
        message: 'Hello! I\'m doing well, thank you. I\'d be happy to help you with English. When would you like to start?',
        sentAt: new Date(Date.now() - 1000 * 60 * 4) // 4 minutes ago
      },
      {
        sender: student1._id,
        receiver: teacher1._id,
        message: 'ok i will schedule our time.',
        sentAt: new Date(Date.now() - 1000 * 60 * 2) // 2 minutes ago
      },
      {
        sender: student1._id,
        receiver: teacher1._id,
        message: 'hii how are you',
        sentAt: new Date(Date.now() - 1000 * 60 * 1) // 1 minute ago
      }
    ];
    
    await Chat.insertMany(testMessages);
    
    console.log('Chat data seeded successfully!');
    console.log('Test messages created between:', student1.fullName, 'and', teacher1.fullName);
    
  } catch (error) {
    console.error('Error seeding chat data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedChatData();
