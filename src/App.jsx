import { Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default App;
