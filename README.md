FinGenius: AI-Powered Personal Finance Tracker 🚀
Live Application: fin-genius-topaz.vercel.app

(Suggestion: Take a screenshot of your live dashboard and replace the link above to make this even more visually appealing.)

Project Overview
FinGenius is a scalable, full-stack MERN application designed to provide users with a modern and intuitive way to manage their personal finances. It features a real-time dashboard with interactive charts, full CRUD (Create, Read, Update, Delete) functionality for transactions, and an innovative AI co-pilot powered by the Google Gemini API. The entire project is containerized with Docker and deployed via a professional CI/CD pipeline using GitHub Actions, ensuring robust and automated updates.

Key Features ✨
Interactive Dashboard: A sleek, real-time dashboard to visualize income, expenses, and budget goals with dynamic charts from Recharts.

Full CRUD Operations: Users can easily add, view, edit, and delete their financial transactions.

AI Financial Co-Pilot: Integrated with the Google Gemini API, allowing users to get general financial insights or ask specific questions about their spending habits (e.g., "Where am I spending the most?").

Secure Authentication: A robust JWT-based authentication system with protected routes and server-side validation to keep user data secure.

Onboarding & Notifications: A welcoming onboarding flow for new users to set their budget and a dynamic notification system that provides timely financial summaries.

Professional DevOps Pipeline: A complete CI/CD workflow with GitHub Actions for automated testing and deployment to Vercel (frontend) and Render (backend).

Keyboard-First Navigation: A Ctrl+K command menu for fast and efficient navigation and actions.

Tech Stack & Tools 🛠️
Category

Technologies

Frontend

React.js, TypeScript, Tailwind CSS, Recharts, Framer Motion, Axios

Backend

Node.js, Express.js, TypeScript, JWT (JSON Web Tokens)

Database

MongoDB (with Mongoose)

AI

Google Gemini API (@google/generative-ai)

DevOps

Docker, CI/CD, GitHub Actions, Vercel (Frontend Hosting), Render (Backend Hosting)

Testing

Jest, Supertest (Backend)

Getting Started 🏁
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js (v18 or later)

npm

Git

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

Your application should now be running locally, with the frontend at http://localhost:5173.

Deployment ☁️
This project is configured for a professional CI/CD pipeline.

Backend: The server is containerized using a multi-stage Dockerfile and is set up for continuous deployment on Render.

Frontend: The client is configured for continuous deployment on Vercel.

Automation: A GitHub Actions workflow (.github/workflows/deploy.yml) automates the entire process. On every push to the main branch, it runs backend tests, and if they pass, it triggers deployments on both Vercel and Render.

Contact ✉️
Chaithanya Inaganti - chaithanyainaganti@gmail.com

Project Link: https://github.com/Chaithanyaina/FinGenius