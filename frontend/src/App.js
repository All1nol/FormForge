import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TemplateDetails from './pages/TemplateDetails';
import UserPage from './pages/UserPage';
import LoginRegister from './pages/LoginRegister';
import AdminPage from './pages/AdminPage';
import SearchResults from './pages/SearchResults';
import MainPage from './pages/MainPage';
import TemplateForm from './components/TemplateForm';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/template/new" element={<TemplateForm />} />
            <Route path="/template/:id" element={<TemplateDetails />} />
            <Route path="/user" element={<UserPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<LoginRegister />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
