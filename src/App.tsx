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
import Equipment from "./pages/Equipment";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ApiDocsPage from "./pages/ApiDocsPage";
import ClientProfilePage from "./pages/ClientProfile";
import { WorkerProfilePage } from "./pages/WorkerProfile";
import  SiteEngineerProfilePage  from "./pages/SiteEngineerProfile" ;
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Create a new QueryClient instance outside of component
const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // TODO: Replace with actual authentication check
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
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
                <Route path="/login" element={<Login />} />
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
                <Route path="/documents" element={
                  <ProtectedRoute>
                    <Documents />
                  </ProtectedRoute>
                } />
                <Route path="/team" element={
                  <ProtectedRoute>
                    <Team />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
