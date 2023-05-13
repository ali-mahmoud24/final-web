import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ToursPage from './pages/ToursPage';
import AddTourPage from './pages/AddTourPage';
import UpdateTourPage from './pages/UpdateTourPage';

import NotFoundPage from './pages/NotFoundPage';

import {
  SignedInProtectedRoute,
  ProtectedRoute,
} from './shared/utils/auth-routes';

import AuthContext from './shared/context/auth-context';
import { useAuth } from './shared/hooks/use-auth';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          <Route path="/welcome" element={<HomePage />} />

          <Route
            path="/auth"
            element={
              <SignedInProtectedRoute>
                <AuthPage />
              </SignedInProtectedRoute>
            }
          />

          <Route
            path="/tours"
            element={
              <ProtectedRoute>
                <ToursPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-tour"
            element={
              <ProtectedRoute>
                <AddTourPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tours/:tourId"
            element={
              <ProtectedRoute>
                <UpdateTourPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  );
};

export default App;
