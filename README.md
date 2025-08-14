## LearnIt 🎓📚

### 🚧 Status: In Development

LearnIt is a lightweight, multi-page educational website that showcases course categories and simple auth screens, built with plain HTML, CSS, and vanilla JavaScript.

![Hero](static/pics/hero.jpg)

### ✨ Features
- **Responsive landing page**: hero, categories, and featured sections
- **Course pages**: e.g., Graphic Design 🎨
- **Auth UIs**: login and signup screens 🔐
- **Progress/record page**: basic UI for tracking 📈
- **No frameworks**: fast, simple, and easy to modify ⚡

### 🧱 Tech Stack
- HTML5
- CSS3
- JavaScript (vanilla)

### 📂 Project Structure
```text
LearnIt/
  ├── index.html
  ├── course.html
  ├── graphicdesign.html
  ├── login.html
  ├── signup.html
  ├── record.html
  └── static/
      ├── css/
      │   └── style.css
      ├── js/
      │   ├── script.js
      │   ├── graphicdesign.js
      │   ├── programmingbasic.js
      │   └── record.js
      └── pics/
          └── (images)
```

### 🖼️ Screenshots
![Courses](static/pics/programming.jpg)
![Design](static/pics/design.jpg)

### 🚀 Getting Started
- Open `index.html` directly in your browser, or serve locally:
```powershell
py -m http.server 8000
# then visit http://localhost:8000/index.html
```

### 📄 Pages
- `index.html`: Home / landing
- `course.html`: Courses overview
- `graphicdesign.html`: Graphic Design course
- `login.html`, `signup.html`: Auth UIs
- `record.html`: Progress/record UI

### 🛠️ Development
- Styles: `static/css/style.css`
- Scripts: `static/js/*.js`
- Images: `static/pics/`

### 🗺️ Roadmap
- [ ] Improve mobile navigation
- [ ] Add more course detail pages
- [ ] Client-side form validation
- [ ] Persist basic user progress (localStorage)
- [ ] Dark mode

### 🔮 Further Updates (Backend & Data)
- **Backend**: Node.js + Express for a REST API
- **Database**: MongoDB with Mongoose to store users, courses, and progress
- **Auth**: JWT-based sessions; passwords hashed with bcrypt
- **API endpoints (planned)**:
  - `POST /api/auth/signup`, `POST /api/auth/login`
  - `GET /api/courses`, `GET /api/courses/:id`
  - `GET /api/progress`, `PUT /api/progress`
- **Config**: `.env` with `MONGODB_URI`, `JWT_SECRET`, `PORT`
- **Frontend integration**: replace mock UIs with `fetch` calls to the API and persist progress from responses

### 🤝 Contributing
Feedback and PRs are welcome while the project is under active development.

### 📜 License
License to be added. For now, all rights reserved.

If you like this project, consider giving it a ⭐!


