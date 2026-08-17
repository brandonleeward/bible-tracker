import { Link, useLocation } from 'react-router-dom';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        Dashboard
      </Link>
      <Link to="/books" className={`nav-item ${location.pathname === '/books' ? 'active' : ''}`}>
        Books
      </Link>
      <Link to="/goals" className={`nav-item ${location.pathname === '/goals' ? 'active' : ''}`}>
        Goals
      </Link>
      <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
        Settings
      </Link>
    </nav>
  );
}
