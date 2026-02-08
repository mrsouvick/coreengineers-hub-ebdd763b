import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Explore from "./pages/Explore";
import Syllabus from "./pages/Syllabus";
import Announcements from "./pages/Announcements";
import Dashboard from "./pages/Dashboard";
import DashboardCourses from "./pages/DashboardCourses";
import DashboardNotes from "./pages/DashboardNotes";
import DashboardProfile from "./pages/DashboardProfile";
import Admin from "./pages/Admin";
import AdminRoute from "@/components/auth/AdminRoute";
import CourseDetail from "./pages/CourseDetail";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/courses"
              element={
                <ProtectedRoute>
                  <DashboardCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/notes"
              element={
                <ProtectedRoute>
                  <DashboardNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <DashboardProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
