# ✅ Todo Task Management Web Application

A full-stack collaborative todo task manager app built using the MERN stack. It supports Google OAuth login, full CRUD task operations, real-time updates, task sharing, and a responsive UI.

---

## 🔧 Tech Stack

| Layer     | Technology                           |
|-----------|---------------------------------------|
| Frontend  | React.js + Bootstrap 5                |
| Backend   | Node.js + Express.js + Passport.js    |
| Auth      | Google OAuth 2.0 (Session-based)      |
| Database  | MongoDB Atlas                         |
| Realtime  | Socket.IO (optional)                  |
| Deployment| Vercel (Frontend), Render (Backend)   |

---

## ✨ Features

- 🔐 Social Login via Google OAuth (Session-based)
- 📝 Add, edit, delete personal tasks
- 👥 Share tasks with other users
- 📅 Filter tasks (by status, due date, priority)
- 🔄 Real-time UI updates (Socket.io / polling)
- 🔔 Toasts for task actions
- 📱 Mobile-responsive UI
- ❌ Error boundaries and fallback UI
- 📊 Task sorting and pagination (ready to scale)

---

## 📁 Folder Structure
todo-task-app/
├── backend/
│ ├── config/ # DB and passport config
│ ├── models/ # Mongoose schemas
│ ├── routes/ # Express routes (auth, tasks)
│ ├── sockets/ # Optional socket setup
│ ├── app.js # Express app setup
│ ├── server.js # Entry point
│ └── .env # NOT committed
├── frontend/
│ ├── src/components # TaskForm, TaskList, Navbar
│ ├── src/App.js # Main React App
│ ├── public/
│ └── .env # Firebase config (if used)


---

## 🚀 Getting Started Locally

### 🔽 Clone the Repo

```bash
git clone https://github.com/gabrielANASH/todo-task-manager.git
cd todo-task-manager

⚙️Backend Setup
bash
Copy code
cd backend
npm install

Create .env file in /backend:
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGO_URI=your_mongodb_uri
CLIENT_URL=http://localhost:3000

Run backend server:
npm start
# App runs on: http://localhost:5000

💻 Frontend Setup
cd ../frontend
npm install
npm start
# App runs on: http://localhost:3000

🧠 Assumptions Made
Only Google OAuth is implemented (GitHub/Facebook skipped for simplicity)

Tasks are shared via user ID (not email)

Realtime is optional but prepped using Socket.io boilerplate

🔗 Demo Links
Frontend (Vercel): [Add link here]

Backend (Render): [Add link here]

🎥 Demo Video:  
[▶️ Click to Watch](./assets/Todo-demovid.mp4)

<video src="assets/Todo-demovid.mp4" controls width="100%" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 12px;"></video>

🗂️ Architecture Diagram
Include your diagram here or link to it

📜 License
This project is licensed under the MIT License.

🙌 Acknowledgements
Google OAuth 2.0

MongoDB Atlas

Katomaran Hackathon Team

🏁 Submission Requirement
This project is a part of a hackathon run by https://www.katomaran.com ✅
