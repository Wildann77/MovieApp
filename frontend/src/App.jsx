// App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import { AllMovies } from "./pages/movies/AllMovies";
import DetailMovie from "./pages/movies/DetailMovie";
import DetailActor from "./pages/actors/DetailActor";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import { Navbar } from "./components/Navbar";
import FooterGlow from "./components/FooterGlow";
import ScrollToTop from "./components/ScrollToTop";
import LoginRoute from "./common/LoginRoute";
import AuthRoute from "./common/AuthRoute";
import AdminRoute from "./common/AdminRoute";
import UserRoute from "./common/UserRoute";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import AdminPage from "./pages/admin/AdminPage";

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
        {/* Auth - Protected from authenticated users */}
        <Route 
          path="/signup" 
          element={
            <AuthRoute>
              <SignUp />
            </AuthRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />

        {/* Main - Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/movies" element={<AllMovies />} />
        <Route path="/movies/:id" element={<DetailMovie />} />
        <Route path="/actors/:id" element={<DetailActor />} />
        <Route 
          path="/favorites" 
          element={
            <LoginRoute>
              <Favorites />
            </LoginRoute>
          } 
        />

        {/* Dashboard - Protected routes for regular users only */}
        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />
        <Route
          path="/dashboard/movies"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />
        <Route
          path="/dashboard/create-movie"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />
        <Route
          path="/dashboard/actors"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />
        <Route
          path="/dashboard/directors"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />
        <Route
          path="/dashboard/writers"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />
        <Route
          path="/dashboard/genres"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <UserRoute>
              <DashboardLayout />
            </UserRoute>
          }
        />

        {/* Admin - Protected routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/master-data"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/actors"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/directors"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/writers"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/genres"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        {/* Fallback - MUST be last */}
        <Route
          path="*"
          element={
            <div className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center p-6">
              {/* Background Glow Effects - Same as Footer */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-chart-1/10 to-chart-2/10 opacity-50"></div>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center">
                <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
                <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
                <a 
                  href="/" 
                  className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors duration-300"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />

        </Routes>
      </main>

      {/* Footer only shows on non-dashboard and non-admin pages */}
      {!isDashboardRoute && !isAdminRoute && <FooterGlow />}
    </div>
  );
}

export default App;