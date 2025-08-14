// Course data
const courseData = {
  title: "Graphic Designing",
  description: "This course covers the fundamentals of graphic design, including color theory, typography, and layout.This will help you to create visually appealing designs for various media, including print and digital platforms. Students will learn to use design software such as Adobe Photoshop and Illustrator, and will work on projects that enhance their creativity and technical skills. By the end of the course, learners will be able to produce professional-quality designs and understand the principles of effective visual communication.",
  lessons: {
    lesson1: {
      title: "Introduction to Graphic Design",
      description: "Get started with basic graphic design concepts",
      videoUrl: "https://www.youtube.com/embed/U9DDxPBtJNA?si=P0QAGei220X4-lkX",
      content: `

                <p>In this first lesson, we'll cover:</p>
                <ul>
                    <li>what is graphic designing</li>
                    <li>Understanding design principles and elements</li>
                    <li>Color theory fundamentals</li>
                    <li>Typography basics</li>
                    <li>Layout and composition</li>
                    <li>Design software overview</li>
                </ul>
            `
    },
    lesson2: {
      title: "Working with Figma",
      description: "Understanding how to store and manipulate data",
      videoUrl: "https://www.youtube.com/embed/FTFaQWZBqQ8?si=O8jBhnEKVRFobatE",
      content: `
                <h3>Working with Figma</h3>
                <p>Learn about:</p>
                <ul>
                    <li>Introduction to Figma interface</li>
                    <li>Creating frames and shapes</li>
                    <li>Working with layers and components</li>
                    <li>Prototyping and interactions</li>
                    <li>Collaboration features</li>
                    <li>Exporting designs</li>
                </ul>
            `
    },

    lesson3: {
      title: "Figma Design Fundamentals",
      description: "Learn the fundamentals of creating designs in Figma",
      videoUrl: "https://www.youtube.com/embed/uQsyobT2Rv8?si=SteFMUPDVs7l06xW", 
      content: `
                <h3>Getting Started with Figma Design</h3>
                <p>In this lesson, we'll cover:</p>
                <ul>
                    <li>Setting up your Figma workspace</li>
                    <li>Basic shapes and tools</li>
                    <li>Working with colors and gradients</li>
                    <li>Text and typography in Figma</li>
                    <li>Creating simple layouts</li>
                    <li>Using frames and groups</li>
                </ul>
            `
    
    },
    lesson4: {
      title: "Prototyping in Figma",
      description: "Learn how to create interactive prototypes",
      videoUrl: "https://www.youtube.com/embed/v1UKB-0EUhQ?si=seizOqnn_QBvkfGy",
      content: `
                <h3>Creating Interactive Prototypes</h3>
                <p>Learn about:</p>
                <ul>
                    <li>Setting up connections between frames</li>
                    <li>Creating interactive components</li>
                    <li>Adding animations and transitions</li>
                    <li>Testing and sharing prototypes</li>
                    <li>Smart animate features</li>
                    <li>Prototype settings and navigation</li>
                </ul>
            `
    },
    lesson5: {
      title: "Final Project",
      description: "Build a simple application",
      videoUrl: "https://www.youtube.com/embed/Jo9yksmQRrk?si=1J-yEwA8duIlzEBB",
      content: `
                <h3>Final Figma Project</h3>
                <p>We'll create:</p>
                <ul>
                    <li>A complete UI/UX design</li>
                    <li>Interactive prototype</li>
                    <li>Design system and components</li>
                    <li>Presentation and documentation</li>
                    <li>Export assets for development</li>
                </ul>
            `
    }
  }
};


//it will show first video by default
window.onload = function () {
  document.getElementById('course-title').textContent = courseData.title;
  document.getElementById('course-description').textContent = courseData.description;
  showLesson('lesson1'); // Show first lesson by default
};

// Function to display lesson content
function showLesson(lessonId) {
  const lesson = courseData.lessons[lessonId];

  // Update video
  document.getElementById('lesson-video').src = lesson.videoUrl;

  // Update lesson title
  document.getElementById('lesson-title').textContent = lesson.title;

  // Update lesson content
  document.getElementById('lesson-text').innerHTML = lesson.content;

  // Update active lesson in the list
  const lessonLinks = document.querySelectorAll('.lesson-link');
  lessonLinks.forEach(link => {
    link.classList.remove('active');
    if (link.onclick.toString().includes(lessonId)) {
      link.classList.add('active');
    }
  });
}
