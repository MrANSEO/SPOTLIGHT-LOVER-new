import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProtectedRoute.css';

// Route protégée pour utilisateurs authentifiés
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner spinner-lg"></div>
          <p className="loading-text">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route protégée pour ADMIN uniquement
export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner spinner-lg"></div>
          <p className="loading-text">Vérification des permissions admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Bloquer si pas ADMIN
  if (user?.role !== 'ADMIN') {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <h1>🚫 Accès Refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <p>Cette section est réservée aux administrateurs.</p>
          <a href="/feed" className="btn btn-primary">Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
