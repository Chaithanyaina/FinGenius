<div align="center">

FinGenius: AI-Powered Personal Finance Tracker 🚀
An intelligent, full-stack MERN application to track, manage, and gain AI-powered insights into your personal finances.

➡️ View the Live Application ⬅️

</div>

<div align="center">

Take a GIF or high-quality screenshot of your live dashboard and place it here. For example:
<img src="https://i.imgur.com/your-dashboard-demo.gif" alt="FinGenius Dashboard Demo" width="800"/>

</div>

🎯 Project Overview
FinGenius is a scalable, full-stack MERN application designed to provide users with a modern and intuitive way to manage their personal finances. It features a real-time dashboard with interactive charts, full CRUD functionality for transactions, and an innovative AI co-pilot powered by the Google Gemini API. The entire project is containerized with Docker and deployed via a professional CI/CD pipeline using GitHub Actions, ensuring robust and automated updates.

✨ Key Features
📊 Interactive Dashboard: A sleek, real-time dashboard to visualize income, expenses, and budget goals with dynamic charts.

✍️ Full CRUD Operations: Easily add, view, edit, and delete your financial transactions.

🤖 AI Financial Co-Pilot: Integrated with the Google Gemini API to get general insights or ask specific questions about spending habits.

🔐 Secure Authentication: Robust JWT-based authentication with protected routes and server-side validation.

🔔 Onboarding & Notifications: A welcoming flow for new users to set their budget and a dynamic notification system for timely summaries.

🔄 Professional DevOps Pipeline: A complete CI/CD workflow with GitHub Actions for automated testing and deployment to Vercel and Render.

⌨️ Keyboard-First Navigation: A Ctrl+K command menu for fast and efficient navigation.

🛠️ Tech Stack & Tools
Frontend
Backend
AI & DevOps
🏁 Getting Started
To get a local copy up and running, follow these simple steps.

<details>
<summary><strong>Click to view setup instructions</strong></summary>

Prerequisites
Node.js (v18 or later)

npm & Git

Installation & Setup
Clone the repository:

git clone https://github.com/Chaithanyaina/FinGenius.git
cd FinGenius

Setup the Backend Server:

Navigate to the server directory: cd server

Install NPM packages: npm install

Create a .env file in the server directory and add the following variables:

PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key

Start the server: npm run dev

Setup the Frontend Client:

In a new terminal, navigate to the client directory: cd client

Install NPM packages: npm install

Create a .env.local file in the client directory and add the following:

VITE_API_URL=http://localhost:8000/api/v1

Start the client: npm run dev

Your application should now be running locally at http://localhost:5173.

</details>

☁️ Deployment
This project is configured for a professional CI/CD pipeline.

Backend: The server is containerized using a multi-stage Dockerfile and is continuously deployed on Render.

Frontend: The client is continuously deployed on Vercel.

Automation: A GitHub Actions workflow (.github/workflows/deploy.yml) automates the entire process. On every push to the main branch, it runs backend tests and triggers deployments on both platforms.

✉️ Contact
Chaithanya Inaganti - chaithanyainaganti@gmail.com