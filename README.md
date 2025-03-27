## Table of Contents
About The Project
FormForge is a full-stack web application designed to streamline form creation, submission, and analysis. It allows users to create custom templates with various question types, submit responses, and view aggregated results. The platform also integrates with Jira for creating support tickets directly from the application.

## Key Features
Template Management: Create, edit, and delete form templates with different question types (text, number, boolean, date).
User Authentication: Secure user registration and login with JWT-based authentication.
Form Submission: Users can submit forms based on existing templates.
Data Aggregation: View aggregated results and statistics for submitted forms.
Jira Integration: Create Jira tickets directly from the application for support or issue tracking.
Admin Panel: Manage users and templates with admin privileges.
Access Control: Control template visibility with public and specific user access types.
Responsive Design: User-friendly interface with Tailwind CSS.
The project follows a modular architecture with a clear separation between the frontend and backend:

## Frontend: Built with React, using React Router for navigation, React Query for data fetching, and Tailwind CSS for styling.
## Backend: Built with Node.js and Express, using Mongoose for MongoDB interaction, and JWT for authentication.

## Frontend Technologies:

React
React Router
React Query
Tailwind CSS
Axios

## Backend Technologies:

Node.js
Express
Mongoose
MongoDB
JWT
Axios

## Getting Started
Prerequisites
Node.js and npm installed
MongoDB database instance
Jira account and API token (for Jira integration)
Installation
Clone the repository:
git clone https://github.com/all1nol/formforge.git
Navigate to the backend directory:
cd formforge/backend
Install backend dependencies:
npm install
Create a .env file in the backend directory and configure the following environment variables:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
FRONTEND_URL=http://localhost:3000
JIRA_URL=your_jira_url
JIRA_EMAIL=your_jira_email
JIRA_API_TOKEN=your_jira_api_token
JIRA_KEY=your_jira_project_key
Start the backend server:
npm run dev
Navigate to the frontend directory:
cd ../frontend
Install frontend dependencies:
npm install
Create a .env file in the frontend directory and configure the following environment variables:
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_JIRA_URL=your_jira_url
Start the frontend development server:
npm start
