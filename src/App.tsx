
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Projects from './components/Projects';
import { ErrorBoundary } from './components/ErrorBoundary';
import NewProject from './pages/NewProject';

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/new-project" element={<NewProject />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;
