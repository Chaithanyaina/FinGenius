import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { DataProvider } from './hooks/useData';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast'; // ✅ Toast notification

// ✅ Lazy-loaded routes (code splitting)
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));

// ✅ Fallback loader for Suspense
const SuspenseLoader = () => (
  <div className="w-full h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen w-full">
          <Toaster position="top-center" /> {/* ✅ Toast container */}

          <Suspense fallback={<SuspenseLoader />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
