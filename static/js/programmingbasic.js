// Course data
const courseData = {
    title: "Programming Basics",
    description: "This course provides a foundational introduction to programming concepts and techniques. Designed for beginners, it covers essential topics such as variables, data types, control structures (if-else, loops), functions, and basic input/output operations. Students will learn problem-solving skills and algorithmic thinking through hands-on exercises and projects. By the end of the course, learners will be able to write simple programs, understand basic programming logic, and build a solid base for more advanced computer science topics. The course typically uses Python or a similar beginner-friendly language.",
    lessons: {
        lesson1: {
            title: "Introduction to Programming",
            description: "Get started with basic programming concepts",
            videoUrl: "https://www.youtube.com/embed/zOjov-2OZ0E", //for video copy the embedded link from youtube and paste it here
            content: `
                <h3>Welcome to Programming Basics!</h3>
                <p>In this first lesson, we'll cover:</p>
                <ul>
                    <li>What is programming?</li>
                    <li>Basic programming concepts</li>
                    <li>How computers process instructions</li>
                    <li>Writing your first program</li>
                </ul>
            `
        },
        lesson2: {
            title: "Variables and Data Types",
            description: "Understanding how to store and manipulate data",
            videoUrl: "https://www.youtube.com/embed/L9-3VBOjNH4",
            content: `
                <h3>Variables and Data Types</h3>
                <p>Learn about:</p>
                <ul>
                    <li>What are variables</li>
                    <li>Different types of data</li>
                    <li>How to declare and use variables</li>
                    <li>Type conversion</li>
                </ul>
            `
        },
  
        lesson3: {
            title: "Control Flow",
            description: "Learn about decision making in programming",
            videoUrl: "https://www.youtube.com/embed/0P_YvC6Gg0c?si=AA2LOG8hc9TaLJAx",
            content: `
                <h3>Control Flow Structures</h3>
                <p>In this lesson we cover:</p>
                <ul>
                    <li>If statements</li>
                    <li>Loops</li>
                    <li>Switch statements</li>
                    <li>Break and continue</li>
                </ul>
            `
        },
        lesson4: {
            title: "Functions",
            description: "Understanding modular programming",
            videoUrl: "https://www.youtube.com/embed/N8ap4k_1QEQ",
            content: `
                <h3>Functions in Programming</h3>
                <p>Learn about:</p>
                <ul>
                    <li>What are functions</li>
                    <li>Function parameters</li>
                    <li>Return values</li>
                    <li>Function scope</li>
                </ul>
            `
        },
        lesson5: {
            title: "Final Project",
            description: "Build a simple application",
            videoUrl: "//www.youtube.com/embed/xhWHf-bMElk?si=81d1jfm0bFysTk_G",
            content: `
                <h3>Creating a Project</h3>
                <p>We'll explore:</p>
                <ul>
                    <li>Starting with html</li>
                    <li>creating a web based project</li>
                    <li>using DOM elements</li>
                    <li>Deploying to git</li>
                </ul>
            `
        }
    }
};

// Initialize the course when the page loads
window.onload = function() {
    document.getElementById('course-title').textContent = courseData.title;
    document.getElementById('course-description').textContent = courseData.description;
    showLesson('lesson1'); 
};
// Function to display lesson content
function showLesson(lessonId) {
    const lesson = courseData.lessons[lessonId];
    document.getElementById('lesson-video').src = lesson.videoUrl;
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-text').innerHTML = lesson.content;
    const lessonLinks = document.querySelectorAll('.lesson-link');
    lessonLinks.forEach(link => {
        link.classList.remove('active');
        if (link.onclick.toString().includes(lessonId)) {
            link.classList.add('active');
        }
    });
}
