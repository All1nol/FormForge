<div align="center">

<h3 align="center">FormForge</h3>

  <p align="center">
    Streamlines form creation, submission, and analysis with Jira integration.
    <br />
     <a href="https://github.com/all1nol/formforge">github.com/all1nol/formforge</a>
  </p>
</div>


## Table of Contents

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#key-features">Key Features</a></li>
      </ul>
    </li>
    <li><a href="#architecture">Architecture</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

FormForge is a full-stack web application designed to streamline form creation, submission, and analysis. It allows users to create custom templates with various question types, submit responses, and view aggregated results. The platform also integrates with Jira for creating support tickets directly from the application.

### Key Features

- **Template Management:** Create, edit, and delete form templates with different question types (text, number, boolean, date).
- **User Authentication:** Secure user registration and login with JWT-based authentication.
- **Form Submission:** Users can submit forms based on existing templates.
- **Data Aggregation:** View aggregated results and statistics for submitted forms.
- **Jira Integration:** Create Jira tickets directly from the application for support or issue tracking.
- **Admin Panel:** Manage users and templates with admin privileges.
- **Access Control:** Control template visibility with public and specific user access types.
- **Responsive Design:** User-friendly interface with Tailwind CSS.

## Architecture


The project follows a modular architecture with a clear separation between the frontend and backend:

- **Frontend:** Built with React, using React Router for navigation, React Query for data fetching, and Tailwind CSS for styling. Key components include:
    - `src/components`: Reusable UI elements like `Navbar`, `TemplateCard`, `TemplateForm`, and input components.
    - `src/pages`: Route-specific components such as `MainPage`, `TemplateDetails`, `UserPage`, and `AdminPage`.
    - `src/contexts`: Contexts for authentication (`AuthContext`) and user management (`UserContext`).
    - `src/hooks`: Custom hooks like `useForm` and `useTemplate` for form handling and data fetching.
    - `src/services`: API service (`api.js`) for making requests to the backend.
- **Backend:** Built with Node.js and Express, using Mongoose for MongoDB interaction, and JWT for authentication. Key components include:
    - `backend/models`: Mongoose schemas for `User`, `Template`, `Form`, `Response`, and `Ticket`.
    - `backend/controllers`: Request handlers for user authentication, template management, form submissions, and Jira integration.
    - `backend/routes`: API routes for users, templates, forms, and tickets.
    - `backend/middleware`: Authentication and error handling middleware.
    - `backend/utils`: Utility functions for aggregation, validation, and error handling.

**Frontend Technologies:**

- React
- React Router
- React Query
- Tailwind CSS
- Axios

**Backend Technologies:**

- Node.js
- Express
- Mongoose
- MongoDB
- JWT
- Axios

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB database instance
- Jira account and API token (for Jira integration)

### Installation

Instructions for cloning the repo, installing packages, configuring environment variables, etc:

1. Clone the repository:
   ```sh
   git clone https://github.com/all1nol/formforge.git
   ```
2. Navigate to the backend directory:
   ```sh
   cd formforge/backend
   ```
3. Install backend dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the backend directory and configure the following environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   JIRA_URL=your_jira_url
   JIRA_EMAIL=your_jira_email
   JIRA_API_TOKEN=your_jira_api_token
   JIRA_KEY=your_jira_project_key
   ```
5. Start the backend server:
   ```sh
   npm run dev
   ```
6. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
7. Install frontend dependencies:
   ```sh
   npm install
   ```
8. Create a `.env` file in the frontend directory and configure the following environment variables:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_JIRA_URL=your_jira_url
   ```
9. Start the frontend development server:
   ```sh
   npm start
   ```


