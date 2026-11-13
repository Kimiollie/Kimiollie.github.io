import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import ThemeProvider from './theme/ThemeProvider.tsx';

// Home (with the room) loads straight away; the other pages load when visited.
const Projects = lazy(() => import('./pages/Projects.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Beyond = lazy(() => import('./pages/Beyond.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="about" element={<About />} />
          <Route path="beyond" element={<Beyond />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
