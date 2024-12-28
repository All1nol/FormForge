import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TemplateDetails from './pages/TemplateDetails';
import UserPage from './pages/UserPage';
import LoginRegister from './pages/LoginRegister';
import AdminPage from './pages/AdminPage';
import SearchResults from './pages/SearchResults';
import MainPage from './pages/MainPage';
import TemplateForm from './components/TemplateForm';
import ProtectedRoute from './components/ProtectedRoute';
import FormSubmission from './components/FormSubmission';
import FormView from './pages/FormView';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/template/new" element={
              <ProtectedRoute>
                <TemplateForm />
              </ProtectedRoute>
            } />
            <Route path="/template/:id" element={
              <ProtectedRoute>
                <TemplateDetails />
              </ProtectedRoute>
            } />
            <Route path="/template/:id/edit" element={
              <ProtectedRoute>
                <TemplateDetails />
              </ProtectedRoute>
            } />
            <Route path="/user" element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/template/:id/submit" element={
              <ProtectedRoute>
                <FormSubmission />
              </ProtectedRoute>
            } />
            <Route path="/forms/:id/view" element={
              <ProtectedRoute>
                <FormView />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
