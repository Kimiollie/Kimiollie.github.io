import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Projects from './pages/Projects.tsx';
import About from './pages/About.tsx';
import Beyond from './pages/Beyond.tsx';
import Contact from './pages/Contact.tsx';
import NotFound from './pages/NotFound.tsx';
import ThemeProvider from './theme/ThemeProvider.tsx';

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
