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
import { AuthProvider } from './contexts/AuthContext';
import CreateTicket from './components/CreateTicket';
import TicketDashboard from './components/TicketDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-cyber-black">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/tickets" element={<TicketDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
