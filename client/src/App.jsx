import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MediaProvider } from './context/MediaContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import Infrastructure from './pages/Infrastructure';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Health from './pages/Health';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <MediaProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/health" element={<Health />} />
          </Route>
          {/* Admin route */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </MediaProvider>
  );
}
