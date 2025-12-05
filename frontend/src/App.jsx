import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MainLayout } from './components/layout';
import ProtectedRoute, { AdminRoute } from './components/common/ProtectedRoute';

// Pages publiques
import Home from './pages/public/Home';
import About from './pages/special/About';
import Contact from './pages/special/Contact';
import FAQ from './pages/special/FAQ';
import Legal from './pages/special/Legal';
import NotFound from './pages/special/NotFound';
import ServerError from './pages/special/ServerError';

// Pages authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RecoverPassword from './pages/auth/RecoverPassword';

// Pages utilisateur (protégées)
import Feed from './pages/user/Feed';
import Gallery from './pages/user/Gallery';
import Leaderboard from './pages/user/Leaderboard';
import Profile from './pages/user/Profile';
import Settings from './pages/user/Settings';
import Upload from './pages/user/Upload';
import Notifications from './pages/user/Notifications';

// Pages admin (protégées ADMIN)
import Dashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminVideos from './pages/admin/Videos';
import AdminVotes from './pages/admin/Votes';
import AdminStats from './pages/admin/Stats';
import AdminSettings from './pages/admin/Settings';
import AdminLogs from './pages/admin/Logs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Layout avec Header, Footer et BottomNav */}
          <Route element={<MainLayout />}>
            {/* ============ PAGES PUBLIQUES ============ */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="/500" element={<ServerError />} />
            
            {/* ============ AUTHENTIFICATION ============ */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/recover-password" element={<RecoverPassword />} />
            
            {/* ============ PAGES UTILISATEUR (Protégées) ============ */}
            <Route 
              path="/feed" 
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/gallery" 
              element={
                <ProtectedRoute>
                  <Gallery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
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
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } 
            />
            
            {/* ============ PAGES ADMIN (Protégées ADMIN) ============ */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/videos" 
              element={
                <AdminRoute>
                  <AdminVideos />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/votes" 
              element={
                <AdminRoute>
                  <AdminVotes />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/stats" 
              element={
                <AdminRoute>
                  <AdminStats />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/logs" 
              element={
                <AdminRoute>
                  <AdminLogs />
                </AdminRoute>
              } 
            />
            
            {/* ============ PAGE 404 ============ */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
