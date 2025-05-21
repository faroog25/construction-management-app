
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Documents from "./pages/Documents";
import Team from "./pages/Team";
import SiteEngineersPage from "./pages/SiteEngineers";
import ClientsPage from "./pages/Clients";
import Equipment from "./pages/Equipment";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Navbar from "./components/Navbar";
import ApiDocsPage from "./pages/ApiDocsPage";
import ClientProfilePage from "./pages/ClientProfile";
import { WorkerProfilePage } from "./pages/WorkerProfile";
import SiteEngineerProfilePage from "./pages/SiteEngineerProfile";
import WorkerSpecialties from "./pages/WorkerSpecialties";
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Create a new QueryClient instance outside of component
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Replace with actual authentication check
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

const App = () => (
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/projects" element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                } />
                <Route path="/projects/:id" element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                } />
                <Route path="/team" element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                } />
                <Route path="/team/engineers" element={
                  <ProtectedRoute>
                    <SiteEngineersPage />
                  </ProtectedRoute>
                } />
                <Route path="/team/clients" element={
                  <ProtectedRoute>
                    <ClientsPage />
                  </ProtectedRoute>
                } />
                <Route path="/team/clients/:id" element={
                  <ProtectedRoute>
                    <ClientProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/team/workers/:id" element={
                  <ProtectedRoute>
                    <WorkerProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/team/site-engineers/:id" element={
                  <ProtectedRoute>
                    <SiteEngineerProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/worker-specialties" element={
                  <ProtectedRoute>
                    <WorkerSpecialties />
                  </ProtectedRoute>
                } />
                <Route path="/equipment" element={
                  <ProtectedRoute>
                    <Equipment />
                  </ProtectedRoute>
                } />
                <Route path="/api-docs" element={
                  <ProtectedRoute>
                    <ApiDocsPage />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<Navigate to="/welcome" replace />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
