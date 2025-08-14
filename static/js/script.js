document.addEventListener('DOMContentLoaded', function () {
  // Navbar scroll effects
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('header nav a, .footer-links a, a.btn');

  // Mobile Menu Toggle Functionality
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          menuToggle.classList.remove('active');
          nav.classList.remove('active');
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!menuToggle.contains(e.target) && !nav.contains(e.target)) {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      // Only apply to internal links
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Course Card Click Handlers - Open course detail modal
  const courseCards = document.querySelectorAll('.course-card');

  courseCards.forEach(card => {
    const viewButton = card.querySelector('.btn');

    viewButton.addEventListener('click', function (e) {
      e.preventDefault();

      // Get course info
      const courseTitle = card.querySelector('h3').textContent;
      const courseDesc = card.querySelector('p').textContent;
      const courseImage = card.querySelector('img').src;
      const isPremium = card.classList.contains('premium');
      const coursePrice = isPremium ? card.querySelector('.price').textContent : 'Free';

      // Create modal with course details
      showCourseModal(courseTitle, courseDesc, courseImage, isPremium, coursePrice);
    });
  });

  // Contact form validation and submission
  const contactForm = document.querySelector('.contact-form form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = this.querySelector('#name');
      const emailInput = this.querySelector('#email');
      const messageInput = this.querySelector('#message');

      // Simple validation
      if (!nameInput.value.trim()) {
        showFormError(nameInput, 'Please enter your name');
        return;
      }

      if (!emailInput.value.trim()) {
        showFormError(emailInput, 'Please enter your email');
        return;
      }

      if (!validateEmail(emailInput.value)) {
        showFormError(emailInput, 'Please enter a valid email');
        return;
      }

      if (!messageInput.value.trim()) {
        showFormError(messageInput, 'Please enter your message');
        return;
      }

      // If validation passes, show success message
      this.innerHTML = `
                <div class="success-message">
                    <i class='bx bx-check-circle'></i>
                    <h3>Message Sent!</h3>
                    <p>Thank you for contacting us. We'll get back to you shortly.</p>
                </div>
            `;
    });
  }

  // Newsletter subscription form
  const newsletterForm = document.querySelector('.footer-newsletter form');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = this.querySelector('input[type="email"]');

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        emailInput.style.borderColor = 'red';
        return;
      }

      // If validation passes
      this.innerHTML = `
                <p class="success-message">Thank you for subscribing to our newsletter!</p>
            `;
    });
  }
});

// Helper Functions

// Function to show course details modal
function showCourseModal(title, description, image, isPremium, price) {
  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'course-modal';

  // Build modal content
  modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-header">
                <img src="${image}" alt="${title}">
                <div class="modal-title">
                    <h3>${title}</h3>
                    <span class="modal-price">${price}</span>
                </div>
            </div>
            <div class="modal-body">
                <div class="course-description">
                    <h4>Course Description</h4>
                    <p>${description}</p>
                    <p>This comprehensive course covers everything you need to know about ${title.toLowerCase()}. 
                    From basic concepts to advanced techniques, you'll gain practical skills that you can apply immediately.</p>
                </div>
                <div class="course-curriculum">
                    <h4>Course Curriculum</h4>
                    <ul>
                        <li>Introduction to ${title}</li>
                        <li>Core Concepts & Fundamentals</li>
                        <li>Practical Exercises</li>
                        <li>Advanced Techniques</li>
                        <li>Final Project & Assessment</li>
                    </ul>
                </div>
                <div class="course-details">
                    <div class="detail">
                        <i class='bx bx-time'></i>
                        <span>Duration: 2 weeks</span>
                    </div>
                    <div class="detail">
                        <i class='bx bx-book'></i>
                        <span>5 lessons</span>
                    </div>
                    <div class="detail">
                        <i class='bx bx-user'></i>
                        <span>Suitable for all levels</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                ${isPremium
      ? `<a href="#" class="btn enroll-btn">Enroll for ${price}</a>`
      : `<a href="#" class="btn enroll-btn">Enroll Now (Free)</a>`
    }
            </div>
        </div>
    `;

  // Add modal to body
  document.body.appendChild(modal);

  // Show modal with animation
  setTimeout(() => {
    modal.classList.add('show');
  }, 10);

  // Close modal functionality
  const closeModal = modal.querySelector('.close-modal');
  closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.remove();
    }, 300);
  });

  // Close when clicking outside modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
      }, 300);
    }
  });

  // Handle enrollment button click
  const enrollBtn = modal.querySelector('.enroll-btn');
  enrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (isPremium) {
      // For premium courses, show payment modal
      showPaymentModal(title, price);
      modal.remove();
    } else {
      // For free courses, redirect to appropriate course page
      if (title === 'Graphic Design') {
        window.location.href = 'graphicdesign.html';
      } else {
        window.location.href = `course.html?title=${encodeURIComponent(title)}&free=true`;
      }
    }
  });
}

// Function to show payment modal for premium courses
function showPaymentModal(courseTitle, price) {
  // Create payment modal
  const paymentModal = document.createElement('div');
  paymentModal.className = 'payment-modal';

  paymentModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Complete Your Purchase</h3>
            <p>You are enrolling in: ${courseTitle}</p>
            <p class="price-display">Total: ${price}</p>
            
            <form id="payment-form">
                <div class="form-group">
                    <label for="card-name">Cardholder Name</label>
                    <input type="text" id="card-name" required>
                </div>
                <div class="form-group">
                    <label for="card-number">Card Number</label>
                    <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
                </div>
                <div class="payment-row">
                    <div class="form-group">
                        <label for="expiry">Expiry Date</label>
                        <input type="text" id="expiry" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" placeholder="123" required>
                    </div>
                </div>
                <button type="submit" class="btn">Complete Payment</button>
            </form>
        </div>
    `;

  // Add payment modal to body
  document.body.appendChild(paymentModal);

  // Show modal with animation
  setTimeout(() => {
    paymentModal.classList.add('show');
  }, 10);

  // Close modal functionality
  const closeModal = paymentModal.querySelector('.close-modal');
  closeModal.addEventListener('click', () => {
    paymentModal.classList.remove('show');
    setTimeout(() => {
      paymentModal.remove();
    }, 300);
  });

  // Handle payment form submission
  const paymentForm = paymentModal.querySelector('#payment-form');
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Show loading state
    const submitBtn = paymentForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Processing...`;

    // Simulate payment processing
    setTimeout(() => {
      paymentModal.querySelector('.modal-content').innerHTML = `
                <div class="success-message">
                    <i class='bx bx-check-circle'></i>
                    <h3>Payment Successful!</h3>
                    <p>Thank you for enrolling in ${courseTitle}.</p>
                    <p>You will receive an email with course access details shortly.</p>
                    <a href="course.html?title=${encodeURIComponent(courseTitle)}" class="btn">Start Learning</a>
                </div>
            `;
    }, 2000);
  });
}

// Form validation helpers
function showFormError(inputElement, message) {
  // Remove existing error message if any
  const parent = inputElement.parentElement;
  const existingError = parent.querySelector('.error-message');

  if (existingError) {
    existingError.remove();
  }

  // Create and append error message
  const errorElement = document.createElement('span');
  errorElement.className = 'error-message';
  errorElement.textContent = message;

  // Style the input and error message
  inputElement.style.borderColor = 'red';
  parent.appendChild(errorElement);

  // Remove error when input changes
  inputElement.addEventListener('input', function () {
    this.style.borderColor = '';
    const error = parent.querySelector('.error-message');
    if (error) {
      error.remove();
    }
  });
}

// Email validation helper
function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}