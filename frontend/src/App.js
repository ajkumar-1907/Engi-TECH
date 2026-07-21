import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import EquipmentListPage from './pages/EquipmentListPage';
import EquipmentDetailPage from './pages/EquipmentDetailPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import '@/App.css';

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background blueprint-grid">
        <div className="border-2 border-border p-8 rounded-none bg-card flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-mono uppercase tracking-wider text-foreground">Loading&hellip;</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <LandingPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/equipment/:branch"
                  element={
                    <RequireAuth>
                      <EquipmentListPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/equipment/:branch/:id"
                  element={
                    <RequireAuth>
                      <EquipmentDetailPage />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
