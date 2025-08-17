const mongoose = require('mongoose');
const Course = require('./models/coursesModel');
const Teacher = require('./models/teacherModel');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tutor', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedCourseData = async () => {
  try {
    // Get a teacher to assign courses to
    const teachers = await Teacher.find().limit(1);
    
    if (teachers.length === 0) {
      console.log('No teachers found. Please create a teacher first.');
      return;
    }
    
    const teacher = teachers[0];
    
    // Clear existing course data
    await Course.deleteMany({});
    
    // Create sample courses
    const sampleCourses = [
      {
        title: 'Advanced Calculus',
        description: 'Master differential equations, integrals, and mathematical analysis',
        fullDescription: 'This comprehensive course covers advanced calculus concepts including limits, continuity, differentiation, integration, and their applications. You\'ll learn to solve complex mathematical problems and understand the theoretical foundations of calculus.',
        category: 'mathematics',
        level: 'Advanced',
        duration: '12 weeks',
        price: 299,
        image: '📐',
        teacher: teacher._id,
        videos: [
          { title: 'Introduction to Limits', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '15:30' },
          { title: 'Continuity and Differentiability', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:45' }
        ],
        syllabus: [
          'Week 1-2: Limits and Continuity',
          'Week 3-4: Differentiation Techniques',
          'Week 5-6: Applications of Derivatives',
          'Week 7-8: Integration Methods',
          'Week 9-10: Applications of Integrals',
          'Week 11-12: Series and Sequences'
        ],
        requirements: [
          'Basic algebra and trigonometry',
          'Pre-calculus knowledge',
          'Dedication to practice problems'
        ],
        outcomes: [
          'Solve complex calculus problems',
          'Understand mathematical proofs',
          'Apply calculus to real-world scenarios'
        ],
        rating: 4.8,
        totalReviews: 45,
        isPublished: true
      },
      {
        title: 'Python Programming Fundamentals',
        description: 'Learn Python from scratch with hands-on projects and real-world applications',
        fullDescription: 'Start your programming journey with Python! This beginner-friendly course covers everything from basic syntax to object-oriented programming. You\'ll build real projects including a calculator, web scraper, and simple game.',
        category: 'programming',
        level: 'Beginner',
        duration: '8 weeks',
        price: 199,
        image: '🐍',
        teacher: teacher._id,
        videos: [
          { title: 'Introduction to Python', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '12:15' },
          { title: 'Variables and Data Types', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '18:30' }
        ],
        syllabus: [
          'Week 1: Introduction to Python',
          'Week 2: Variables and Data Types',
          'Week 3: Control Structures',
          'Week 4: Functions and Modules',
          'Week 5: Lists and Dictionaries',
          'Week 6: File Handling',
          'Week 7: Object-Oriented Programming',
          'Week 8: Final Project'
        ],
        requirements: [
          'Basic computer literacy',
          'No prior programming experience needed',
          'Windows, Mac, or Linux computer'
        ],
        outcomes: [
          'Write Python programs from scratch',
          'Build practical applications',
          'Understand programming fundamentals'
        ],
        rating: 4.9,
        totalReviews: 128,
        isPublished: true
      },
      {
        title: 'Creative Writing Workshop',
        description: 'Develop your writing skills through creative exercises and peer feedback',
        fullDescription: 'Unlock your creative potential in this interactive writing workshop. You\'ll explore different genres, develop your unique voice, and receive constructive feedback from peers and instructors.',
        category: 'languages',
        level: 'Intermediate',
        duration: '6 weeks',
        price: 149,
        image: '✍️',
        teacher: teacher._id,
        videos: [
          { title: 'Finding Your Voice', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:10' },
          { title: 'Character Development', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '22:45' }
        ],
        syllabus: [
          'Week 1: Finding Your Voice',
          'Week 2: Character Development',
          'Week 3: Plot and Structure',
          'Week 4: Dialogue and Description',
          'Week 5: Revision Techniques',
          'Week 6: Publishing and Sharing'
        ],
        requirements: [
          'Basic writing skills',
          'Openness to feedback',
          'Creative mindset'
        ],
        outcomes: [
          'Develop unique writing style',
          'Create compelling narratives',
          'Receive and give constructive feedback'
        ],
        rating: 4.7,
        totalReviews: 67,
        isPublished: true
      }
    ];
    
    await Course.insertMany(sampleCourses);
    
    console.log('Course data seeded successfully!');
    console.log(`Created ${sampleCourses.length} courses for teacher: ${teacher.fullName}`);
    
  } catch (error) {
    console.error('Error seeding course data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedCourseData();
